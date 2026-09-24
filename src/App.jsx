import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryStories from './components/CategoryStories';
import ProductCard from './components/ProductCard';
import PurityGuaranteeSection from './components/PurityGuaranteeSection';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import OwnerAdminModal from './components/OwnerAdminModal';
import BusinessProfileModal from './components/BusinessProfileModal';
import PrintableInvoice from './components/PrintableInvoice';
import { INITIAL_PRODUCTS, DEFAULT_BUSINESS_PROFILE, enrichSheetProduct } from './data/dairyProducts';
import {
  fetchLiveInventory,
  submitOrderToGoogleSheet,
  generateUniqueCustomerId,
  generateUniqueOrderId
} from './services/googleSheetsService';
import { ShoppingBag, Lock, ShieldCheck, RefreshCw } from 'lucide-react';

export default function App() {
  // Google Script URL configuration
  const [googleScriptUrl, setGoogleScriptUrl] = useState(() => {
    return import.meta.env.VITE_GOOGLE_SHEETS_WEBAPP_URL || localStorage.getItem('tmd_google_script_url') || "https://script.google.com/macros/s/AKfycbzJvTtrVTWbR2OiFStdy-DFNDse0mPWBw22XsvMbhUENUFnu3j25KzQbx8ESuBrBMVCmA/exec";
  });

  // Products state (loads directly from Google Sheet data)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('tmd_cred_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  // Business Profile state (clean defaults for actual buyer entry)
  const [businessProfile, setBusinessProfile] = useState(() => {
    const saved = localStorage.getItem('tmd_cred_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.businessName === "Royal Sweets & Restaurant") {
          return DEFAULT_BUSINESS_PROFILE;
        }
        return parsed;
      } catch (e) {
        return DEFAULT_BUSINESS_PROFILE;
      }
    }
    return DEFAULT_BUSINESS_PROFILE;
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('tmd_cred_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders state
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('tmd_cred_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Category & Search
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');

  // 2 Delivery Modes: 'delivery' (Demand Delivery) vs 'pickup' (Self Pick-up)
  const [deliveryMode, setDeliveryMode] = useState('delivery');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [latestOrder, setLatestOrder] = useState(null);

  // Sync products directly from Google Sheet on mount & URL change
  useEffect(() => {
    let isMounted = true;
    if (googleScriptUrl) {
      setIsLoadingInventory(true);
      fetchLiveInventory(googleScriptUrl).then((result) => {
        if (isMounted) {
          setIsLoadingInventory(false);
          if (result.success && result.data && result.data.length > 0) {
            // Render 100% data from Google Sheet
            const enriched = result.data.map((item) => enrichSheetProduct(item));
            setProducts(enriched);
          }
        }
      }).catch(() => {
        if (isMounted) setIsLoadingInventory(false);
      });
    }
    return () => { isMounted = false; };
  }, [googleScriptUrl]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('tmd_cred_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('tmd_cred_profile', JSON.stringify(businessProfile));
  }, [businessProfile]);

  useEffect(() => {
    localStorage.setItem('tmd_cred_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tmd_cred_orders', JSON.stringify(orders));
  }, [orders]);

  const handleSaveGoogleScriptUrl = (newUrl) => {
    setGoogleScriptUrl(newUrl);
    localStorage.setItem('tmd_google_script_url', newUrl);
  };

  const handleRefreshInventory = (liveData) => {
    if (liveData && liveData.length > 0) {
      const enriched = liveData.map((item) => enrichSheetProduct(item));
      setProducts(enriched);
    }
  };

  // Cart operations
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: product.moq || 1 }];
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Owner Stock Toggle
  const handleToggleProductAvailability = (productId) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, available: !p.available } : p))
    );
  };

  // Complete Booking (Generates unique Customer ID & Order ID, and posts to Google Sheet)
  const handleCompleteBooking = async (orderPayload) => {
    const orderId = generateUniqueOrderId();
    const customerId = generateUniqueCustomerId(orderPayload.phone, orderPayload.businessName);

    const newOrder = {
      ...orderPayload,
      orderId,
      customerId,
      timestamp: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Confirmed'
    };

    // Save locally
    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);

    // Sync to Google Sheet asynchronously in the background
    submitOrderToGoogleSheet(newOrder, googleScriptUrl);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All Products' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.packaging.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.pricePerUnit * item.quantity, 0);

  return (
    <div className="cred-app">
      {/* 1. Header with Store Profile & Cart next to each other */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        businessProfile={businessProfile}
      />

      {/* 2. Hero Section & 2 Delivery Options */}
      <Hero
        deliveryMode={deliveryMode}
        setDeliveryMode={setDeliveryMode}
      />

      {/* 3. Circular Stories Bar */}
      <CategoryStories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 4. Product Catalog Grid */}
      <main className="cred-content">
        <div className="cred-section-header">
          <div>
            <h2 className="cred-section-title">
              {selectedCategory === 'All Products' ? 'Commercial Dairy Portfolio' : selectedCategory}
            </h2>
            <p className="cred-section-sub">
              Farm-fresh unadulterated commercial dairy • Direct batch fulfillment
            </p>
          </div>

          <div className="cred-mode-badge">
            <span>Fulfillment: <strong>{deliveryMode === 'pickup' ? 'Self Pick-up' : 'Delivery on Demand'}</strong></span>
          </div>
        </div>

        {/* Product Cards */}
        <div className="cred-grid">
          {filteredProducts.map((product) => {
            const cartItem = cart.find((item) => item.id === product.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            return (
              <ProductCard
                key={product.id}
                product={product}
                quantity={quantity}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            );
          })}
        </div>

        {/* 5. CRED Purity Guarantee Section */}
        <PurityGuaranteeSection />
      </main>

      {/* 6. Floating Mobile Bar */}
      {cartCount > 0 && (
        <div className="cred-mobile-bar">
          <div>
            <div style={{ fontSize: '0.74rem', color: '#8e8e98' }}>{cartCount} items selected</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00e599' }}>
              ₹{cartTotal.toLocaleString('en-IN')}
            </div>
          </div>
          <button
            className="cred-btn-add"
            style={{ padding: '10px 22px', fontSize: '0.92rem' }}
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={17} />
            <span>View Cart</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        deliveryMode={deliveryMode}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        businessProfile={businessProfile}
        onUpdateBusinessProfile={setBusinessProfile}
        deliveryMode={deliveryMode}
        setDeliveryMode={setDeliveryMode}
        onCompleteBooking={handleCompleteBooking}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        order={latestOrder}
        onClose={() => setLatestOrder(null)}
      />

      {/* Business Profile Modal */}
      <BusinessProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        businessProfile={businessProfile}
        onSaveProfile={setBusinessProfile}
      />

      {/* Dedicated Owner Portal & Google Sheets Live Sync */}
      <OwnerAdminModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        orders={orders}
        products={products}
        onToggleProductAvailability={handleToggleProductAvailability}
        googleScriptUrl={googleScriptUrl}
        onSaveGoogleScriptUrl={handleSaveGoogleScriptUrl}
        onRefreshInventory={handleRefreshInventory}
      />

      {/* Printable Delivery Challan */}
      <PrintableInvoice order={latestOrder} />

      {/* Clean Luxury Footer */}
      <footer className="cred-footer">
        <div className="cred-footer-inner">
          <div>
            <div className="cred-footer-title">THEMOINMALIK DAIRY</div>
            <p className="cred-footer-sub">
              Crafted for Commercial Excellence • 100% Farm Pure Dairy Supply
            </p>
          </div>

          <div className="cred-footer-links">
            <span>📞 Helpline: +91 98765 43210</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
