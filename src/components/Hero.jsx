import React from 'react';
import { Truck, Store, Sparkles } from 'lucide-react';
import { getImageUrl } from '../data/dairyProducts';

export default function Hero({
  deliveryMode,
  setDeliveryMode
}) {
  return (
    <section className="cred-hero-section">
      <div className="cred-hero-container">
        {/* Clean Headline with Official Logo Emblem */}
        <div className="cred-hero-left">
          <div className="cred-hero-brand-header">
            <img
              src={getImageUrl("images/themoinmalik_official_logo.png")}
              alt="THE MOIN MALIK Dairy Official Seal"
              className="cred-hero-seal"
            />
            <div>
              <div className="cred-hero-tag">
                <Sparkles size={12} />
                <span>Quality Dairy Supply • B2B Partner</span>
              </div>
              <h1 className="cred-hero-title">
                Pure Commercial Dairy. <span>Direct from Source.</span>
              </h1>
            </div>
          </div>

          <p className="cred-hero-desc">
            Direct batch fulfillment of pure buffalo milk, whole cow milk, malai paneer blocks, curd buckets, and golden danedaar ghee for professional kitchens.
          </p>
        </div>

        {/* Minimalist Segmented Fulfillment Toggle */}
        <div className="cred-hero-right">
          <div className="cred-fulfillment-pill-group">
            <button
              className={`cred-fulfillment-tab ${deliveryMode === 'delivery' ? 'active' : ''}`}
              onClick={() => setDeliveryMode('delivery')}
              type="button"
            >
              <Truck size={15} />
              <span>Delivery on Demand</span>
            </button>

            <button
              className={`cred-fulfillment-tab ${deliveryMode === 'pickup' ? 'active' : ''}`}
              onClick={() => setDeliveryMode('pickup')}
              type="button"
            >
              <Store size={15} />
              <span>Self Pick-up</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
