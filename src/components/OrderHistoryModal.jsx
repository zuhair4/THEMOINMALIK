import React from 'react';
import { X, Clock, Repeat, CheckCircle2, ChevronRight, Package } from 'lucide-react';

export default function OrderHistoryModal({
  isOpen,
  onClose,
  orders = [],
  onReorder
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#f0fdfa', padding: '8px', borderRadius: '10px', color: '#0f766e' }}>
              <Clock size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>Past Dairy Orders & Standing Quota</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Quick 1-Click Reorder for your daily recurring dairy needs
              </p>
            </div>
          </div>
          <button className="btn-close-circle" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <p>No past orders recorded yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {orders.map((ord) => (
                <div
                  key={ord.orderId}
                  style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f766e' }}>{ord.orderId}</span>
                        <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                          {ord.status || 'Confirmed'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                        Booked on {ord.timestamp} • Shift: {ord.selectedSlot === 'morning' ? 'Morning 4-7 AM' : 'Afternoon 1-4 PM'}
                      </div>
                    </div>

                    <button
                      className="btn-add-cart"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '4px' }}
                      onClick={() => {
                        onReorder(ord.items);
                        onClose();
                      }}
                    >
                      <Repeat size={14} />
                      <span>Re-order This Quota</span>
                    </button>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '0.82rem', color: '#334155', marginBottom: '10px' }}>
                    {ord.items.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                        <span>• {item.name} × {item.quantity}</span>
                        <span style={{ fontWeight: 600 }}>₹{(item.pricePerUnit * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                    <span>Total Amount:</span>
                    <span style={{ color: '#0f766e' }}>₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-header-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
