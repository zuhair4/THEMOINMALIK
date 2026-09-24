import React from 'react';
import { Truck, Store, ShieldCheck, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { DELIVERY_OPTIONS } from '../data/dairyProducts';

export default function Hero({
  deliveryMode,
  setDeliveryMode
}) {
  return (
    <section className="cred-hero-section">
      <div className="cred-hero-container">
        {/* Left Column: Farm Fresh Purity Banner */}
        <div>
          <div className="cred-hero-tag">
            <Sparkles size={13} />
            <span>FARM FRESH • ZERO ADULTERATION</span>
          </div>

          <h1 className="cred-hero-title">
            Pure Dairy. <span>Zero Compromise.</span>
          </h1>

          <p className="cred-hero-desc">
            Commercial daily supply of pure buffalo milk, whole cow milk, malai paneer blocks, thick set curd, and golden danedaar ghee directly from THEMOINMALIK DAIRY plant.
          </p>

          <div className="cred-hero-highlights">
            <div className="cred-hero-pill">
              <ShieldCheck size={15} color="#00e599" />
              <span>Zero Preservatives</span>
            </div>
            <div className="cred-hero-pill">
              <Award size={15} color="#00e599" />
              <span>FSSAI Certified Pure</span>
            </div>
            <div className="cred-hero-pill">
              <Truck size={15} color="#00e599" />
              <span>Chilled Van Dispatch</span>
            </div>
          </div>
        </div>

        {/* Right Column: 2 Delivery Options Card */}
        <div className="cred-delivery-card">
          <div className="cred-deliv-header">
            <span className="cred-deliv-title">Fulfillment Preference</span>
            <span style={{ fontSize: '0.72rem', color: '#00e599', background: 'rgba(0,229,153,0.12)', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
              Live
            </span>
          </div>

          <div className="cred-deliv-options-grid">
            {DELIVERY_OPTIONS.map((opt) => {
              const isSelected = deliveryMode === opt.id;
              const IconComp = opt.id === 'delivery' ? Truck : Store;

              return (
                <div
                  key={opt.id}
                  className={`cred-deliv-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setDeliveryMode(opt.id)}
                >
                  <div className="cred-deliv-top-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IconComp size={16} color={isSelected ? '#00e599' : '#8e8e98'} />
                      <span className="cred-deliv-name">{opt.title}</span>
                    </div>
                    {isSelected && <CheckCircle2 size={16} color="#00e599" />}
                  </div>

                  <p className="cred-deliv-desc">{opt.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
