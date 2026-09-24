import React, { useEffect } from 'react';
import { CheckCircle2, MessageSquare, Printer, ArrowRight, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccessModal({
  order,
  onClose
}) {
  if (!order) return null;

  useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  }, []);

  const itemsText = order.items
    .map((item, idx) => `${idx + 1}. *${item.name}* x ${item.quantity} (${item.packaging}) = ₹${(item.pricePerUnit * item.quantity).toLocaleString('en-IN')}`)
    .join('%0A');

  const fulfillmentText = order.deliveryMode === 'pickup'
    ? 'Self Pick-up from Plant'
    : `Delivery as per Demand (Address: ${order.deliveryAddress || 'On file'})`;

  const whatsappMessage = `🥛 *NEW B2B DAIRY ORDER - THEMOINMALIK DAIRY*%0A%0A` +
    `*Order ID:* ${order.orderId}%0A` +
    `*Store/Business:* ${order.businessName}%0A` +
    `*Contact:* ${order.contactPerson} (${order.phone})%0A` +
    `*Fulfillment:* ${fulfillmentText}%0A` +
    `*Notes:* ${order.notes || 'None'}%0A%0A` +
    `*Items Ordered:*%0A${itemsText}%0A%0A` +
    `*Total Commercial Amount:* ₹${order.totalAmount.toLocaleString('en-IN')}`;

  const whatsappUrl = `https://wa.me/919876543210?text=${whatsappMessage}`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dark-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Success Header */}
        <div style={{ textAlign: 'center', padding: '24px 20px 16px', background: 'radial-gradient(circle at 50% 0%, #172a38 0%, #131b2e 100%)', borderBottom: '1px solid #1e293b' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#10b981' }}>
            <CheckCircle2 size={32} />
          </div>
          <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '4px' }}>Order Placed Successfully!</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Thank you, <strong>{order.businessName}</strong>. Your order has been recorded.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0f172a', border: '1px solid #1e293b', padding: '6px 14px', borderRadius: '999px', marginTop: '10px', fontSize: '0.82rem' }}>
            <span style={{ color: '#94a3b8' }}>Order ID:</span>
            <strong style={{ color: '#10b981' }}>{order.orderId}</strong>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-dark-body">
          {/* Action Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-buy-add"
              style={{
                background: '#25D366',
                color: '#fff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px',
                fontSize: '0.86rem'
              }}
            >
              <MessageSquare size={16} />
              <span>Send via WhatsApp</span>
            </a>

            <button
              onClick={() => window.print()}
              className="btn-header-profile"
              style={{ justifyContent: 'center', padding: '10px', fontSize: '0.86rem' }}
            >
              <Printer size={16} />
              <span>Print Slip</span>
            </button>
          </div>

          {/* Details Block */}
          <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '16px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#94a3b8' }}>Fulfillment:</span>
              <strong style={{ color: '#fff' }}>
                {order.deliveryMode === 'pickup' ? 'Self Pick-up from Plant' : 'Delivery as per Demand'}
              </strong>
            </div>

            {order.deliveryAddress && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#94a3b8' }}>Location:</span>
                <span style={{ color: '#cbd5e1', textAlign: 'right', maxWidth: '60%' }}>{order.deliveryAddress}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #1e293b' }}>
              <span style={{ color: '#94a3b8' }}>Total Amount:</span>
              <strong style={{ color: '#10b981', fontSize: '1rem' }}>₹{order.totalAmount.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>ITEMS IN THIS ORDER</div>
            {order.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '4px 0', borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
                <span>{item.name} × {item.quantity}</span>
                <span style={{ color: '#fff' }}>₹{(item.pricePerUnit * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-dark-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="cred-btn-add" onClick={onClose} style={{ background: '#00e599', color: '#051610', fontWeight: 800 }}>
            <span>Done</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
