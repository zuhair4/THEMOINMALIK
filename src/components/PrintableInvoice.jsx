import React from 'react';

export default function PrintableInvoice({ order }) {
  if (!order) return null;

  return (
    <div className="printable-invoice">
      <div style={{ border: '2px solid #0f172a', padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', margin: 0, color: '#0f766e' }}>THEMOINMALIK DAIRY</h1>
            <p style={{ margin: '4px 0', fontSize: '13px', color: '#334155' }}>Wholesale Dairy Processing & Distribution Plant</p>
            <p style={{ margin: '2px 0', fontSize: '12px' }}>FSSAI Lic No: 10020011000123 | GSTIN: 07AABCT1234F1Z8</p>
            <p style={{ margin: '2px 0', fontSize: '12px' }}>Dispatch Helpline: +91 98765 43210</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '18px', margin: 0, textTransform: 'uppercase' }}>Delivery Challan / Invoice</h2>
            <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: 'bold' }}>#{order.orderId}</p>
            <p style={{ margin: '2px 0', fontSize: '12px' }}>Date: {order.timestamp || new Date().toLocaleDateString()}</p>
            <p style={{ margin: '2px 0', fontSize: '12px', fontWeight: 'bold', color: '#0f766e' }}>
              Shift: {order.selectedSlot === 'morning' ? 'Morning Shift (4:00 - 7:00 AM)' : 'Afternoon Shift (1:00 - 4:00 PM)'}
            </p>
          </div>
        </div>

        {/* Customer & Delivery Block */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', fontSize: '13px' }}>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px' }}>
            <strong>BILLED & DELIVERED TO:</strong>
            <p style={{ margin: '4px 0', fontWeight: 'bold', fontSize: '14px' }}>{order.businessName}</p>
            <p style={{ margin: '2px 0' }}>Attn: {order.contactPerson} ({order.phone})</p>
            <p style={{ margin: '2px 0' }}>Address: {order.deliveryAddress}, {order.areaPincode}</p>
            {order.gstin && <p style={{ margin: '2px 0' }}>Customer GSTIN: {order.gstin}</p>}
          </div>

          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px' }}>
            <strong>ORDER & DISPATCH DETAILS:</strong>
            <p style={{ margin: '4px 0' }}>Delivery Date: <strong>{order.deliveryDate}</strong></p>
            <p style={{ margin: '2px 0' }}>Frequency: {order.orderType === 'daily-standing' ? 'Daily Standing Order' : 'One-time Booking'}</p>
            <p style={{ margin: '2px 0' }}>Payment Mode: {order.paymentMethod === 'cod' ? 'Pay on Delivery (Cash/UPI QR)' : '7-Day B2B Credit Term'}</p>
            <p style={{ margin: '2px 0', fontStyle: 'italic', color: '#475569' }}>Notes: {order.chillerInstructions || 'Standard Chiller Delivery'}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#0f766e', color: '#fff' }}>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #0f766e' }}>#</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #0f766e' }}>Item Description</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #0f766e' }}>Packaging / Unit</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #0f766e' }}>Qty</th>
              <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #0f766e' }}>Rate (₹)</th>
              <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #0f766e' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{idx + 1}</td>
                <td style={{ padding: '8px', fontWeight: 'bold', border: '1px solid #e2e8f0' }}>{item.name}</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>{item.packaging}</td>
                <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #e2e8f0' }}>{item.quantity}</td>
                <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #e2e8f0' }}>₹{item.pricePerUnit.toLocaleString('en-IN')}</td>
                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', border: '1px solid #e2e8f0' }}>₹{(item.pricePerUnit * item.quantity).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" style={{ padding: '8px', border: 'none' }}></td>
              <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', border: '1px solid #e2e8f0' }}>Commercial Total:</td>
              <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', fontSize: '15px', color: '#0f766e', border: '1px solid #e2e8f0' }}>
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Footer & Signatures */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '40px', paddingTop: '20px', borderTop: '1px dashed #94a3b8', fontSize: '12px' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>Receiver's Seal & Signature:</p>
            <p style={{ color: '#64748b', marginTop: '35px' }}>Goods received in good chilled condition</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>For THEMOINMALIK DAIRY:</p>
            <p style={{ color: '#64748b', marginTop: '35px' }}>Authorized Dispatch In-charge</p>
          </div>
        </div>
      </div>
    </div>
  );
}
