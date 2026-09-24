import React, { useState } from 'react';
import { X, Table, CheckCircle2, ToggleLeft, ToggleRight, ExternalLink, RefreshCw, Layers, Database, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SheetSyncPreviewModal({
  isOpen,
  onClose,
  orders = [],
  products = [],
  onToggleProductAvailability,
  onUpdateProductPrice
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory' | 'guide'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px' }}>
        {/* Header */}
        <div className="modal-header" style={{ background: '#022c22', color: '#fff', borderBottom: '1px solid #065f46' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#059669', padding: '8px', borderRadius: '10px', color: '#fff' }}>
              <Table size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Google Sheets Live Integration (Phase 2 Preview)</h3>
              <p style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>
                Simulating two-way real-time Google Spreadsheet sync for Orders & Product Inventory
              </p>
            </div>
          </div>
          <button className="btn-close-circle" onClick={onClose} style={{ background: '#064e3b', color: '#a7f3d0' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', background: '#064e3b', padding: '0 20px', borderBottom: '1px solid #065f46', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '12px 16px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: activeTab === 'orders' ? '#34d399' : '#a7f3d0',
              borderBottom: activeTab === 'orders' ? '3px solid #34d399' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Database size={16} />
            <span>Sheet 1: Incoming Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            style={{
              padding: '12px 16px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: activeTab === 'inventory' ? '#34d399' : '#a7f3d0',
              borderBottom: activeTab === 'inventory' ? '3px solid #34d399' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={16} />
            <span>Sheet 2: Owner Inventory & Stock Control</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            style={{
              padding: '12px 16px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: activeTab === 'guide' ? '#34d399' : '#a7f3d0',
              borderBottom: activeTab === 'guide' ? '3px solid #34d399' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ExternalLink size={16} />
            <span>Phase 2 Webhook Guide</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="modal-body" style={{ background: '#f8fafc' }}>
          {activeTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#0f172a' }}>Google Sheet: [Orders_Database]</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    When a buyer places a booking, a new row is instantly appended with the exact columns below:
                  </p>
                </div>
                <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '999px', fontWeight: 700 }}>
                  ● Google Apps Script Ready
                </span>
              </div>

              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
                  <p style={{ fontWeight: 600, color: '#334155' }}>No orders placed in this session yet.</p>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                    Add items to your cart and place a booking to see the live Google Sheet row generated automatically!
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: '#1e293b' }}>A: Order ID</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: '#1e293b' }}>B: Timestamp</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: '#1e293b' }}>C: Business Name</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: '#1e293b' }}>D: Phone</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: '#1e293b' }}>E: Delivery Date & Shift</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: '#1e293b' }}>F: Items Breakdown</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: '#1e293b' }}>G: Total (₹)</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: '#1e293b' }}>H: Payment</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: '#1e293b' }}>I: Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
                        <tr key={ord.orderId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f766e' }}>{ord.orderId}</td>
                          <td style={{ padding: '10px 12px', color: '#64748b' }}>{ord.timestamp}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 600 }}>{ord.businessName}</td>
                          <td style={{ padding: '10px 12px' }}>{ord.phone}</td>
                          <td style={{ padding: '10px 12px' }}>
                            {ord.deliveryDate} ({ord.selectedSlot === 'morning' ? 'Morning 4-7 AM' : 'Afternoon 1-4 PM'})
                          </td>
                          <td style={{ padding: '10px 12px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {ord.items.map(i => `${i.name} (${i.quantity}x)`).join(', ')}
                          </td>
                          <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>
                            ₹{ord.totalAmount.toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            {ord.paymentMethod === 'cod' ? 'Pay on Delivery' : '7-Day Credit'}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                              {ord.status || 'Dispatched'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#0f172a' }}>Google Sheet: [Product_Inventory_Master]</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    In Phase 2, the owner can set an item to "Out of Stock" or update prices in Excel/Google Sheets, and the store UI will reflect it instantly. <strong>Try toggling below to test!</strong>
                  </p>
                </div>
              </div>

              <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>SKU / Item Name</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>Category</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>Unit Packaging</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>Wholesale Rate (₹)</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'center' }}>Live Website Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{prod.name}</td>
                        <td style={{ padding: '10px 12px', color: '#64748b' }}>{prod.category}</td>
                        <td style={{ padding: '10px 12px' }}>{prod.packaging}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f766e' }}>
                          ₹{prod.pricePerUnit.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button
                            onClick={() => onToggleProductAvailability(prod.id)}
                            style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: prod.available ? '#dcfce7' : '#fee2e2',
                              color: prod.available ? '#166534' : '#991b1b',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            {prod.available ? '● IN STOCK (Available)' : '✕ OUT OF STOCK'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.88rem', lineHeight: '1.6' }}>
              <h4 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '10px' }}>
                🚀 Phase 2 Google Sheets Connection Blueprint
              </h4>
              <p style={{ color: '#475569', marginBottom: '14px' }}>
                In Phase 2, we will attach a free Google Apps Script Webhook to your Google Spreadsheet. Here is how simple the architecture is:
              </p>

              <ol style={{ paddingLeft: '20px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <strong>Step 1 (Orders Writing):</strong> When user clicks "Place Daily Booking", the app executes an HTTP <code>POST</code> to your Google Apps Script URL, instantly creating a new row in your Orders sheet.
                </li>
                <li>
                  <strong>Step 2 (Live Inventory Reading):</strong> On website load, the app executes an HTTP <code>GET</code> to fetch product availability and prices directly from your Inventory sheet.
                </li>
                <li>
                  <strong>Step 3 (Owner Simplicity):</strong> The owner only needs to open Google Sheets on their phone or PC to manage everything—no complex database or backend hosting needed!
                </li>
              </ol>

              <div style={{ background: '#f0fdf4', padding: '12px 16px', borderRadius: '8px', border: '1px solid #86efac', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontSize: '0.84rem' }}>
                <ShieldCheck size={18} />
                <span>Phase 1 codebase is 100% structured and ready for Phase 2 API hookups.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-add-cart" onClick={onClose}>
            Back to Portal
          </button>
        </div>
      </div>
    </div>
  );
}
