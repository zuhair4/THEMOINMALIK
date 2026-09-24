import React from 'react';
import { ShoppingBag, Search, Store } from 'lucide-react';

export default function Header({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenProfile,
  searchQuery,
  setSearchQuery,
  businessProfile
}) {
  const displayStoreName = businessProfile?.businessName ? businessProfile.businessName : 'My Store';

  return (
    <header className="cred-header">
      <div className="cred-main-bar">
        <div className="cred-header-inner">
          {/* Official THEMOINMALIK DAIRY Brand Monogram & Title */}
          <div className="cred-brand-wrap" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="cred-logo-monogram">
              <span className="cred-logo-symbol">🥛</span>
            </div>
            <div>
              <div className="cred-logo-title">THEMOINMALIK <span>DAIRY</span></div>
              <div className="cred-logo-sub">Pure B2B Wholesale Portal</div>
            </div>
          </div>

          {/* Search Box */}
          <div className="cred-search-box">
            <Search size={16} className="cred-search-icon" />
            <input
              type="text"
              placeholder="Search pure milk, malai paneer, danedaar ghee, dahi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Action Buttons: Store Profile & Cart next to each other */}
          <div className="cred-header-actions">
            {/* Store Profile Button */}
            <button
              className="cred-btn-profile"
              onClick={onOpenProfile}
              title="Click to fill or edit your Store & Delivery Details"
            >
              <Store size={16} color="#00e599" />
              <span className="cred-profile-text">
                {displayStoreName}
              </span>
            </button>

            {/* Cart Button */}
            <button
              className="cred-btn-cart"
              onClick={onOpenCart}
              id="btn-header-cart"
              title="View Cart & Checkout"
            >
              <ShoppingBag size={17} />
              <span className="cred-cart-badge">{cartCount}</span>
              {cartTotal > 0 && (
                <span className="cred-cart-total">₹{cartTotal.toLocaleString('en-IN')}</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="cred-mobile-search-row">
          <Search size={14} className="cred-search-icon" />
          <input
            type="text"
            placeholder="Search milk, malai paneer, ghee, dahi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
