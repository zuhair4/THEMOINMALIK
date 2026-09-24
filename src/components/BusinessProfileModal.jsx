import React, { useState, useEffect } from 'react';
import { X, Store, Save, CheckCircle2, MapPin, Phone, Building2 } from 'lucide-react';

export default function BusinessProfileModal({
  isOpen,
  onClose,
  businessProfile,
  onSaveProfile
}) {
  if (!isOpen) return null;

  const [form, setForm] = useState({ ...businessProfile });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({ ...businessProfile });
  }, [businessProfile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(form);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dark-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-dark-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(0, 229, 153, 0.12)', color: '#00e599', padding: '8px', borderRadius: '10px' }}>
              <Store size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Store & Delivery Profile</h3>
              <p style={{ fontSize: '0.78rem', color: '#8e8e98' }}>Fill your details for instant 1-click dairy bookings</p>
            </div>
          </div>
          <button className="btn-close-dark" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="modal-dark-body">
            {saved && (
              <div style={{ background: 'rgba(0, 229, 153, 0.15)', color: '#00e599', border: '1px solid rgba(0, 229, 153, 0.3)', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} />
                Store details saved successfully!
              </div>
            )}

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8e8e98', fontWeight: 700, marginBottom: '6px' }}>
                BUSINESS / STORE NAME *
              </label>
              <input
                type="text"
                required
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                style={{ width: '100%' }}
                placeholder="e.g. Royal Sweets & Restaurant"
              />
            </div>

            <div className="form-row-2col">
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#8e8e98', fontWeight: 700, marginBottom: '6px' }}>
                  CONTACT PERSON *
                </label>
                <input
                  type="text"
                  required
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  style={{ width: '100%' }}
                  placeholder="e.g. Moin Malik"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#8e8e98', fontWeight: 700, marginBottom: '6px' }}>
                  WHATSAPP MOBILE *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={{ width: '100%' }}
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8e8e98', fontWeight: 700, marginBottom: '6px' }}>
                STORE / KITCHEN DELIVERY ADDRESS *
              </label>
              <textarea
                rows="2"
                required
                value={form.deliveryAddress}
                onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                style={{ width: '100%', resize: 'vertical' }}
                placeholder="Shop No. / Street / Market area..."
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8e8e98', fontWeight: 700, marginBottom: '6px' }}>
                DISPATCH INSTRUCTIONS / SPECIAL NOTES
              </label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                style={{ width: '100%' }}
                placeholder="e.g. Unload at back kitchen cold room"
              />
            </div>
          </div>

          <div className="modal-dark-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="cred-btn-profile" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="cred-btn-add" style={{ gap: '6px' }}>
              <Save size={15} />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
