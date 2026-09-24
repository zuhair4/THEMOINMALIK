import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  onProceedToCheckout,
  deliveryMode
}) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.pricePerUnit * item.quantity), 0);
  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-dark-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-dark-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '8px', borderRadius: '8px' }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Dairy Booking Cart</h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {totalUnits} {totalUnits === 1 ? 'pack' : 'packs'} selected • {deliveryMode === 'pickup' ? 'Self Pick-up' : 'Delivery on Demand'}
              </p>
            </div>
          </div>
          <button className="btn-close-dark" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Cart Body */}
        <div className="drawer-dark-body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🥛</div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.84rem', marginBottom: '20px' }}>
                Add fresh milk crates, paneer blocks, curd buckets, ghee or butter from the catalog.
              </p>
              <button
                className="btn-buy-add"
                style={{ margin: '0 auto' }}
                onClick={onClose}
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>SELECTED ITEMS</span>
                <button
                  onClick={onClearCart}
                  style={{ fontSize: '0.78rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                >
                  <Trash2 size={13} /> Clear
                </button>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: '1px solid #1e293b',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.packaging}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#10b981' }}>
                        ₹{(item.pricePerUnit * item.quantity).toLocaleString('en-IN')}
                      </span>

                      <div className="cred-stepper" style={{ transform: 'scale(0.9)', transformOrigin: 'right center' }}>
                        <button className="cred-stepper-btn" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                          <Minus size={13} />
                        </button>
                        <span className="cred-stepper-val">{item.quantity}</span>
                        <button className="cred-stepper-btn" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="drawer-dark-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
              <span>Fulfillment</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>
                {deliveryMode === 'pickup' ? 'Self Pick-up' : 'Delivery as per Demand'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              <span>Total Amount</span>
              <span style={{ color: '#00e599' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <button
              className="cred-btn-add"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px 20px',
                fontSize: '1rem',
                fontWeight: 800,
                color: '#051610',
                background: '#00e599',
                borderRadius: '9999px',
                boxShadow: '0 0 20px rgba(0, 229, 153, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={onProceedToCheckout}
              id="btn-proceed-to-checkout"
            >
              <span>Proceed to Order</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
