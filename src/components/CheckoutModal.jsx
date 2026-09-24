import React, { useState } from 'react';
import { X, Building2, Phone, MapPin, Truck, Store, ArrowRight, ShieldCheck } from 'lucide-react';
import { DELIVERY_OPTIONS } from '../data/dairyProducts';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  businessProfile,
  onUpdateBusinessProfile,
  deliveryMode,
  setDeliveryMode,
  onCompleteBooking
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    businessName: businessProfile.businessName || '',
    contactPerson: businessProfile.contactPerson || '',
    phone: businessProfile.phone || '',
    deliveryAddress: businessProfile.deliveryAddress || '',
    notes: businessProfile.notes || '',
    paymentMethod: 'cod'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.pricePerUnit * item.quantity), 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    onUpdateBusinessProfile({
      businessName: formData.businessName,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      deliveryAddress: formData.deliveryAddress,
      notes: formData.notes
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onCompleteBooking({
        ...formData,
        deliveryMode,
        items: cartItems,
        totalAmount
      });
    }, 500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dark-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-dark-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Complete Dairy Booking</h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>THEMOINMALIK DAIRY Wholesale</p>
          </div>
          <button className="btn-close-dark" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-dark-body">
            {/* Fulfillment Option Selector (2 Options) */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                FULFILLMENT METHOD *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {DELIVERY_OPTIONS.map((opt) => {
                  const isSelected = deliveryMode === opt.id;
                  const IconComp = opt.id === 'delivery' ? Truck : Store;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setDeliveryMode(opt.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: `1.5px solid ${isSelected ? '#10b981' : '#1e293b'}`,
                        background: isSelected ? 'rgba(16, 185, 129, 0.12)' : '#172033',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.88rem', color: isSelected ? '#34d399' : '#fff', marginBottom: '2px' }}>
                        <IconComp size={16} />
                        <span>{opt.title}</span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                        {opt.subtitle}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Business Details */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                STORE & CONTACT INFORMATION *
              </label>
              <div className="form-row-2col">
                <div>
                  <input
                    type="text"
                    name="businessName"
                    required
                    placeholder="Business / Store Name *"
                    value={formData.businessName}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="contactPerson"
                    required
                    placeholder="Contact Person *"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="WhatsApp Mobile Number (for dispatch) *"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Address (If Delivery is selected) */}
            {deliveryMode === 'delivery' && (
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                  DELIVERY LOCATION ADDRESS *
                </label>
                <textarea
                  name="deliveryAddress"
                  required
                  rows="2"
                  placeholder="Shop / Hotel Address & Area Landmark..."
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
            )}

            {/* Special Notes */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                NOTES / SPECIAL INSTRUCTIONS
              </label>
              <input
                type="text"
                name="notes"
                placeholder={deliveryMode === 'pickup' ? "e.g. Expected pickup time 9:00 AM" : "e.g. Call driver upon arrival at kitchen gate"}
                value={formData.notes}
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </div>

            {/* Order Items Summary */}
            <div style={{ background: '#0f172a', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>SUMMARY ({cartItems.length} items)</div>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '3px' }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>₹{(item.pricePerUnit * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-dark-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Commercial Total</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>
                ₹{totalAmount.toLocaleString('en-IN')}
              </div>
            </div>

            <button
              type="submit"
              className="cred-btn-add"
              disabled={isSubmitting}
              style={{ padding: '12px 26px', fontSize: '0.96rem', background: '#00e599', color: '#051610', fontWeight: 800 }}
              id="btn-confirm-order"
            >
              {isSubmitting ? (
                <span>Placing Booking...</span>
              ) : (
                <>
                  <span>Place Order</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
