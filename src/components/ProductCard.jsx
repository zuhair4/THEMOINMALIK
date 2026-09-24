import React from 'react';
import { Plus, Minus, Package, ShieldCheck } from 'lucide-react';

export default function ProductCard({
  product,
  quantity = 0,
  onAddToCart,
  onUpdateQuantity
}) {
  const isAvailable = product.available;
  const discount = product.mrp ? Math.round(((product.mrp - product.pricePerUnit) / product.mrp) * 100) : 0;

  return (
    <div className={`cred-card ${!isAvailable ? 'opacity-50' : ''}`} id={`product-${product.id}`}>
      {/* Top Media Area */}
      <div className="cred-card-media">
        <img
          src={product.image}
          alt={product.name}
          className="cred-card-img"
          loading="lazy"
        />

        {/* Badges */}
        {product.badge && (
          <span className="cred-badge-tag">
            {product.badge}
          </span>
        )}

        <span className={`cred-badge-stock ${isAvailable ? 'cred-stock-in' : 'cred-stock-out'}`}>
          {isAvailable ? '● IN STOCK' : '✕ SOLD OUT'}
        </span>
      </div>

      {/* Card Body */}
      <div className="cred-card-body">
        {/* Purity Guarantee Tag */}
        <div className="cred-purity-row">
          <ShieldCheck size={13} color="#00e599" />
          <span>{product.purityTag || '100% Pure Dairy'}</span>
        </div>

        {/* Title */}
        <h3 className="cred-card-title">{product.name}</h3>
        <p className="cred-card-desc">{product.description}</p>

        {/* Pack Unit Spec */}
        <div className="cred-pack-pill">
          <Package size={14} color="#00e599" />
          <span>Pack: <strong>{product.packaging}</strong></span>
        </div>

        {/* Fat & SNF Specs */}
        <div className="cred-specs-row">
          {product.fatContent && (
            <span className="cred-spec-chip">
              {product.fatContent}
            </span>
          )}
          {product.snfContent && (
            <span className="cred-spec-chip">
              {product.snfContent}
            </span>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="cred-pricing-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="cred-price-main">₹{product.pricePerUnit.toLocaleString('en-IN')}</span>
              {product.mrp && (
                <span className="cred-price-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span className="cred-rate-text">
                ₹{product.pricePerLitreKg} / {product.unit === 'Crate' ? 'L' : 'Kg'}
              </span>
              {discount > 0 && (
                <span className="cred-discount-tag">Save {discount}%</span>
              )}
            </div>
          </div>

          {/* Action Button */}
          {isAvailable ? (
            quantity > 0 ? (
              <div className="cred-stepper">
                <button
                  className="cred-stepper-btn"
                  onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                  title="Reduce quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="cred-stepper-val">{quantity}</span>
                <button
                  className="cred-stepper-btn"
                  onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                  title="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                className="cred-btn-add"
                onClick={() => onAddToCart(product)}
              >
                <Plus size={15} />
                <span>ADD</span>
              </button>
            )
          ) : (
            <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 600 }}>Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
}
