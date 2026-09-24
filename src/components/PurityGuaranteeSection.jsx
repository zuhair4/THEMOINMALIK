import React from 'react';
import { ShieldCheck, Snowflake, Award, Zap } from 'lucide-react';

export default function PurityGuaranteeSection() {
  const guarantees = [
    {
      icon: ShieldCheck,
      title: "Tested for 70+ Parameters",
      desc: "Zero urea, zero synthetic starch, zero detergent or preservatives. 100% farm-pure dairy."
    },
    {
      icon: Snowflake,
      title: "Chilled Cold Chain (< 4°C)",
      desc: "Strict temperature-controlled transit directly from our plant to your kitchen."
    },
    {
      icon: Award,
      title: "Direct Dairy Farm Sourcing",
      desc: "Pure buffalo and cow milk sourced straight from certified local dairy farms."
    },
    {
      icon: Zap,
      title: "Fulfillment on Demand",
      desc: "Fresh daily morning and on-demand batches prepared specifically for your quota."
    }
  ];

  return (
    <section className="cred-purity-section">
      <div className="cred-purity-header">
        <div className="cred-purity-badge">
          <Award size={13} />
          <span>THEMOINMALIK QUALITY STANDARD</span>
        </div>
        <h3 className="cred-purity-title">
          Uncompromised Dairy Purity
        </h3>
        <p className="cred-purity-sub">
          Every batch of milk, paneer, dahi, ghee, and butter is rigorously laboratory tested to guarantee zero adulteration for your business.
        </p>
      </div>

      <div className="cred-purity-grid">
        {guarantees.map((g, idx) => {
          const Icon = g.icon;
          return (
            <div key={idx} className="cred-purity-card">
              <div className="cred-purity-icon">
                <Icon size={22} />
              </div>
              <h4 className="cred-purity-card-title">{g.title}</h4>
              <p className="cred-purity-card-desc">{g.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
