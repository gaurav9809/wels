
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Products from './components/Products';
import About from './components/About';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cart from './components/Cart';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import ProductPage from './components/ProductPage';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { Product, StoreService, SiteSettings, ShippingInfo, Order } from './services/StoreService';

export const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'cart' | 'admin' | 'product'>('home');
  const [settings, setSettings] = useState<SiteSettings>(StoreService.getSettings());
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [activeType, setActiveType] = useState<'shoe' | 'tshirt' | 'all'>('shoe');
  const [filter, setFilter] = useState('All');
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Initial data load - immediate
    setSettings(StoreService.getSettings());

    const handleUpdate = () => {
      setSettings(StoreService.getSettings());
    };
    window.addEventListener('store_updated', handleUpdate);
    
    // Trigger any scroll reveal elements to be active immediately
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => el.classList.add('active'));

    return () => {
      window.removeEventListener('store_updated', handleUpdate);
    };
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const handleCheckout = (shipping: ShippingInfo, paymentMethod: string) => {
    const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: cart,
      shipping,
      paymentMethod,
      total,
      date: new Date().toISOString()
    };
    
    const orders = StoreService.getOrders();
    orders.push(order);
    localStorage.setItem('wels_orders', JSON.stringify(orders));
    
    alert('ORDER PLACED SUCCESSFULLY!');
    setCart([]);
    setView('home');
  };

  return (
    <div className="bg-black text-white min-h-screen selection:bg-blue-500 selection:text-white">
      <Navbar 
        cartCount={cart.reduce((a, b) => a + b.qty, 0)} 
        onViewChange={(v) => { setView(v); window.scrollTo(0,0); }}
        activeType={activeType}
        onTypeChange={setActiveType}
        user={user}
        onLoginClick={() => setShowAuth(true)}
        onLogout={() => { setUser(null); setView('home'); }}
      />

      <main className="pt-2">
        {view === 'home' && (
          <div className="animate-in fade-in duration-500">
            <Hero 
              settings={settings} 
              onShopNow={() => document.getElementById('products')?.scrollIntoView({behavior: 'smooth'})}
              onStoryClick={() => {}}
              isAdmin={user?.role === 'admin'}
              onEditClick={() => setView('admin')}
            />
            
            {settings.showFeatures && (
              <Features 
                isAdmin={user?.role === 'admin'} 
                onEditClick={() => setView('admin')} 
              />
            )}
            
            {(activeType === 'shoe' || activeType === 'all') && (
              <Products 
                type="shoe" 
                title="Elite Footwear" 
                onAddToCart={handleAddToCart}
                onProductClick={(p) => { setSelectedProduct(p); setView('product'); }}
                filter={filter}
                onFilterChange={setFilter}
                productsPerRow={settings.productsPerRow}
              />
            )}

            {(activeType === 'tshirt' || activeType === 'all') && (
              <Products 
                type="tshirt" 
                title="Premium Apparel" 
                onAddToCart={handleAddToCart}
                onProductClick={(p) => { setSelectedProduct(p); setView('product'); }}
                filter={filter}
                onFilterChange={setFilter}
                productsPerRow={settings.productsPerRow}
              />
            )}

            {settings.showAbout && (
              <About 
                isAdmin={user?.role === 'admin'} 
                onEditClick={() => setView('admin')} 
              />
            )}
            
            {settings.showGallery && (
              <Gallery 
                isAdmin={user?.role === 'admin'} 
                onEditClick={() => setView('admin')} 
              />
            )}
            
            {settings.showReviews && <Reviews />}
            
            <Contact />
          </div>
        )}

        {view === 'product' && selectedProduct && (
          <ProductPage 
            product={selectedProduct} 
            onAddToCart={handleAddToCart} 
            onBack={() => setView('home')} 
          />
        )}

        {view === 'cart' && (
          <Cart 
            items={cart} 
            onUpdateQty={(id, delta) => setCart(prev => prev.map(item => item.product.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item).filter(i => i.qty > 0))}
            onCheckout={handleCheckout}
            user={user}
            onAuthRequired={() => setShowAuth(true)}
          />
        )}

        {view === 'admin' && user?.role === 'admin' && (
          <AdminDashboard onClose={() => setView('home')} />
        )}
      </main>

      <Footer onCategoryClick={(c) => { setFilter(c); setView('home'); }} />
      <FloatingWhatsApp />

      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onLogin={(u) => { setUser(u); setShowAuth(false); }} 
        />
      )}
    </div>
  );
};
