import React, { useState } from 'react';
import { X, Table, ShieldCheck, Database, Layers, CheckCircle2, Download, Link, RefreshCw, AlertCircle, Copy } from 'lucide-react';
import { fetchLiveInventory } from '../services/googleSheetsService';

export default function OwnerAdminModal({
  isOpen,
  onClose,
  orders = [],
  products = [],
  onToggleProductAvailability,
  googleScriptUrl,
  onSaveGoogleScriptUrl,
  onRefreshInventory
}) {
  if (!isOpen) return null;

  const [tab, setTab] = useState('orders'); // 'orders' | 'stock' | 'setup'
  const [scriptUrlInput, setScriptUrlInput] = useState(googleScriptUrl || '');
  const [testingSync, setTestingSync] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const handleSaveUrl = (e) => {
    e.preventDefault();
    onSaveGoogleScriptUrl(scriptUrlInput.trim());
    setSyncStatus({ type: 'success', text: 'Google Sheet Web App URL saved successfully!' });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleTestConnection = async () => {
    if (!scriptUrlInput.trim()) {
      setSyncStatus({ type: 'error', text: 'Please paste your Google Apps Script Web App URL first.' });
      return;
    }
    setTestingSync(true);
    setSyncStatus(null);
    const result = await fetchLiveInventory(scriptUrlInput.trim());
    setTestingSync(false);

    if (result.success) {
      setSyncStatus({ type: 'success', text: `Connected! Successfully loaded ${result.data.length} products live from Google Sheet.` });
      onRefreshInventory(result.data);
    } else {
      setSyncStatus({ type: 'error', text: `Connection check failed: ${result.error || 'Check deployment access is set to Anyone'}` });
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert("No orders to export yet.");
      return;
    }

    const headers = ["Order ID", "Customer ID", "Timestamp", "Business Name", "Contact", "Phone", "Fulfillment", "Address", "Notes", "Items Breakdown", "Total Amount (INR)", "Status"];
    const rows = orders.map(ord => [
      ord.orderId,
      ord.customerId || 'CUST-001',
      `"${ord.timestamp}"`,
      `"${ord.businessName}"`,
      `"${ord.contactPerson}"`,
      `"${ord.phone}"`,
      `"${ord.deliveryMode === 'pickup' ? 'Self Pick-up' : 'Delivery as per Demand'}"`,
      `"${ord.deliveryAddress || 'N/A'}"`,
      `"${ord.notes || 'None'}"`,
      `"${ord.items.map(i => `${i.name} (${i.quantity}x)`).join('; ')}"`,
      ord.totalAmount,
      ord.status || 'Confirmed'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `THEMOINMALIK_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dark-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px' }}>
        {/* Header */}
        <div className="modal-dark-header" style={{ background: '#09090d', borderBottom: '1px solid var(--cred-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--cred-neon-subtle)', color: 'var(--cred-neon)', padding: '8px', borderRadius: '10px', border: '1px solid var(--cred-neon-border)' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Owner Google Sheet Manager</h3>
              <p style={{ fontSize: '0.78rem', color: '#8e8e98' }}>Live 2-Way Sync for Orders & Stock Availability</p>
            </div>
          </div>
          <button className="btn-close-dark" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', background: '#0d0d12', padding: '0 20px', borderBottom: '1px solid var(--cred-border)', gap: '12px' }}>
          <button
            onClick={() => setTab('orders')}
            style={{
              padding: '12px 14px',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: tab === 'orders' ? '#00e599' : '#8e8e98',
              borderBottom: tab === 'orders' ? '2.5px solid #00e599' : '2.5px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Database size={15} />
            <span>Orders Sheet ({orders.length})</span>
          </button>

          <button
            onClick={() => setTab('stock')}
            style={{
              padding: '12px 14px',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: tab === 'stock' ? '#00e599' : '#8e8e98',
              borderBottom: tab === 'stock' ? '2.5px solid #00e599' : '2.5px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={15} />
            <span>Stock Availability</span>
          </button>

          <button
            onClick={() => setTab('setup')}
            style={{
              padding: '12px 14px',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: tab === 'setup' ? '#00e599' : '#8e8e98',
              borderBottom: tab === 'setup' ? '2.5px solid #00e599' : '2.5px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Link size={15} />
            <span>Google Sheet Setup & URL</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="modal-dark-body">
          {tab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <p style={{ fontSize: '0.82rem', color: '#8e8e98' }}>
                  Incoming customer bookings populated with unique <strong>Order ID</strong> & <strong>Customer ID</strong>.
                </p>
                {orders.length > 0 && (
                  <button
                    onClick={handleExportCSV}
                    style={{
                      background: '#181822',
                      border: '1px solid var(--cred-border)',
                      color: '#00e599',
                      padding: '6px 14px',
                      borderRadius: 'var(--cred-radius-pill)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Download size={13} />
                    <span>Download Excel / CSV</span>
                  </button>
                )}
              </div>

              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', background: '#0d0d12', borderRadius: '12px', border: '1px dashed var(--cred-border)' }}>
                  <p style={{ color: '#8e8e98', fontSize: '0.9rem' }}>No orders placed yet in this session.</p>
                  <p style={{ color: '#5c5c66', fontSize: '0.78rem', marginTop: '4px' }}>
                    Orders placed on the store will automatically appear here and sync to your Google Sheet!
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto', background: '#0d0d12', borderRadius: '10px', border: '1px solid var(--cred-border)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#14141c', borderBottom: '1px solid var(--cred-border)' }}>
                        <th style={{ padding: '10px 12px', color: '#8e8e98' }}>Order ID</th>
                        <th style={{ padding: '10px 12px', color: '#8e8e98' }}>Customer ID</th>
                        <th style={{ padding: '10px 12px', color: '#8e8e98' }}>Business Name</th>
                        <th style={{ padding: '10px 12px', color: '#8e8e98' }}>Phone</th>
                        <th style={{ padding: '10px 12px', color: '#8e8e98' }}>Fulfillment</th>
                        <th style={{ padding: '10px 12px', color: '#8e8e98' }}>Items</th>
                        <th style={{ padding: '10px 12px', color: '#8e8e98' }}>Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
                        <tr key={ord.orderId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 800, color: '#00e599' }}>{ord.orderId}</td>
                          <td style={{ padding: '10px 12px', color: '#e4e4e7' }}>{ord.customerId || `CUST-${ord.phone.slice(-6)}`}</td>
                          <td style={{ padding: '10px 12px', color: '#fff', fontWeight: 700 }}>{ord.businessName}</td>
                          <td style={{ padding: '10px 12px', color: '#8e8e98' }}>{ord.phone}</td>
                          <td style={{ padding: '10px 12px', color: '#8e8e98' }}>
                            {ord.deliveryMode === 'pickup' ? 'Self Pick-up' : 'Delivery on Demand'}
                          </td>
                          <td style={{ padding: '10px 12px', color: '#e4e4e7', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {ord.items.map(i => `${i.name} (${i.quantity}x)`).join(', ')}
                          </td>
                          <td style={{ padding: '10px 12px', fontWeight: 800, color: '#00e599' }}>
                            ₹{ord.totalAmount.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'stock' && (
            <div>
              <p style={{ fontSize: '0.82rem', color: '#8e8e98', marginBottom: '14px' }}>
                Quick toggle product availability. When connected to Google Sheets, editing column F in the <strong>[Inventory]</strong> tab will update this in real-time.
              </p>

              <div style={{ overflowX: 'auto', background: '#0d0d12', borderRadius: '10px', border: '1px solid var(--cred-border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#14141c', borderBottom: '1px solid var(--cred-border)' }}>
                      <th style={{ padding: '10px 12px', color: '#8e8e98' }}>Product</th>
                      <th style={{ padding: '10px 12px', color: '#8e8e98' }}>Packaging</th>
                      <th style={{ padding: '10px 12px', color: '#8e8e98' }}>Wholesale Price</th>
                      <th style={{ padding: '10px 12px', color: '#8e8e98', textAlign: 'center' }}>Live Store Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#fff' }}>{prod.name}</td>
                        <td style={{ padding: '10px 12px', color: '#8e8e98' }}>{prod.packaging}</td>
                        <td style={{ padding: '10px 12px', color: '#00e599', fontWeight: 800 }}>
                          ₹{prod.pricePerUnit.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button
                            onClick={() => onToggleProductAvailability(prod.id)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: 'var(--cred-radius-pill)',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              background: prod.available ? 'rgba(0, 229, 153, 0.16)' : 'rgba(239, 68, 68, 0.16)',
                              color: prod.available ? '#00e599' : '#f87171',
                              border: `1px solid ${prod.available ? 'rgba(0, 229, 153, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`
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

          {tab === 'setup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* URL Input Form */}
              <form onSubmit={handleSaveUrl} style={{ background: '#0d0d12', padding: '18px', borderRadius: '12px', border: '1px solid var(--cred-border)' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                  GOOGLE APPS SCRIPT WEB APP URL
                </label>
                <p style={{ fontSize: '0.78rem', color: '#8e8e98', marginBottom: '10px' }}>
                  Paste your deployed Google Apps Script URL to enable live 2-way sync with your Google Sheet:
                </p>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="url"
                    value={scriptUrlInput}
                    onChange={(e) => setScriptUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="cred-btn-add" style={{ padding: '0 18px', fontSize: '0.86rem' }}>
                    Save URL
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testingSync}
                    style={{
                      background: '#181822',
                      border: '1px solid var(--cred-border)',
                      color: '#00e599',
                      padding: '8px 16px',
                      borderRadius: 'var(--cred-radius-pill)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RefreshCw size={14} className={testingSync ? 'animate-spin' : ''} />
                    <span>{testingSync ? 'Checking Connection...' : 'Test Connection & Fetch Live Stock'}</span>
                  </button>
                </div>

                {syncStatus && (
                  <div style={{
                    marginTop: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    background: syncStatus.type === 'success' ? 'rgba(0, 229, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: syncStatus.type === 'success' ? '#00e599' : '#f87171',
                    border: `1px solid ${syncStatus.type === 'success' ? 'rgba(0, 229, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                  }}>
                    {syncStatus.text}
                  </div>
                )}
              </form>

              {/* 1-Minute Setup Guide */}
              <div style={{ background: '#0d0d12', padding: '18px', borderRadius: '12px', border: '1px solid var(--cred-border)', fontSize: '0.84rem', lineHeight: '1.6' }}>
                <h4 style={{ color: '#fff', fontSize: '0.98rem', marginBottom: '8px' }}>
                  ⚡ How to get your Google Apps Script URL (Takes 1 Minute):
                </h4>
                <ol style={{ paddingLeft: '18px', color: '#8e8e98', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Create a new blank Google Sheet named <strong>THEMOINMALIK DAIRY DB</strong>.</li>
                  <li>In Google Sheets, click menu <strong>Extensions</strong> → <strong>Apps Script</strong>.</li>
                  <li>Copy all code from the project file <code>google-apps-script.js</code> and paste it there.</li>
                  <li>Click <strong>Deploy</strong> (top right) → <strong>New deployment</strong> → Select type <strong>Web app</strong>.</li>
                  <li>Set <strong>Execute as:</strong> "Me" and <strong>Who has access:</strong> "Anyone".</li>
                  <li>Click <strong>Deploy</strong>, authorize permissions, and copy the <strong>Web app URL</strong>.</li>
                  <li>Paste the URL in the box above and click <strong>Save URL</strong>!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-dark-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="cred-btn-add" onClick={onClose}>
            Back to Portal
          </button>
        </div>
      </div>
    </div>
  );
}
