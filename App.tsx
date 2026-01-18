import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Cart from './components/Cart';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import ProductPage from './components/ProductPage';
import Footer from './components/Footer';
import Features from './components/Features';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import About from './components/About';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { Product, StoreService, SiteSettings, ShippingInfo } from './services/StoreService';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'cart' | 'admin' | 'product'>('home');
  const [activeType, setActiveType] = useState<'shoe' | 'tshirt' | 'all'>('shoe');
  const [user, setUser] = useState<{name: string, email: string, role: string, avatar?: string} | null>(null);
  const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [settings, setSettings] = useState<SiteSettings>(StoreService.getSettings());

  const refreshGlobalState = () => {
    setSettings(StoreService.getSettings());
  };

  useEffect(() => {
    refreshGlobalState();
    window.addEventListener('store_updated', refreshGlobalState);
    return () => window.removeEventListener('store_updated', refreshGlobalState);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', settings.accentColor);
  }, [settings]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.05 });

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [view, filter, settings, activeType]);

  useEffect(() => {
    const savedUser = localStorage.getItem('wels_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { localStorage.removeItem('wels_user'); }
    }
    const savedCart = localStorage.getItem('wels_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('wels_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? {...item, qty: item.qty + 1} : item);
      return [...prev, { product, qty: 1 }];
    });
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('wels_user', JSON.stringify(userData));
    setIsAuthOpen(false);
    if (userData.role === 'admin') setView('admin');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('wels_user');
    setView('home');
    window.scrollTo(0, 0);
  };

  const handleCheckout = (shipping: ShippingInfo, paymentMethod: string) => {
    if (!user) { setIsAuthOpen(true); return; }
    StoreService.createOrder({ 
      userId: user.email, 
      userName: user.name, 
      shippingInfo: shipping,
      paymentMethod: paymentMethod,
      items: cart, 
      total: cart.reduce((a,b) => a + (b.product.price * b.qty), 0) 
    });
    setCart([]);
    alert(`Order Finalized! Protocol ${paymentMethod} initiated.`);
    setView('home');
  };

  return (
    <div className="min-h-screen selection:bg-blue-500 selection:text-white">
      <Navbar 
        cartCount={cart.reduce((a, b) => a + b.qty, 0)} 
        onViewChange={(v) => {
          if (v === 'admin' && user?.role !== 'admin') { setIsAuthOpen(true); return; }
          setView(v);
        }} 
        activeType={activeType}
        onTypeChange={(type) => {
          setActiveType(type);
          setFilter('All');
          setView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onLoginClick={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      <main className="pt-20">
        {view === 'home' && (
          <>
            <Hero 
              settings={settings}
              onShopNow={() => document.getElementById('collection-anchor')?.scrollIntoView({behavior: 'smooth'})} 
              onStoryClick={() => document.getElementById('about')?.scrollIntoView({behavior: 'smooth'})}
              isAdmin={user?.role === 'admin'}
              onEditClick={() => setView('admin')}
            />
            {settings.showFeatures && <Features isAdmin={user?.role === 'admin'} onEditClick={() => setView('admin')} />}
            
            <div id="collection-anchor" className="scroll-mt-32">
              {(activeType === 'shoe' || activeType === 'all') && (
                <Products 
                  type="shoe"
                  title="SHOES CENTER"
                  filter={filter} 
                  onFilterChange={setFilter} 
                  onAddToCart={addToCart} 
                  onProductClick={(p) => { setSelectedProduct(p); setView('product'); }}
                  productsPerRow={settings.productsPerRow}
                  isAdmin={user?.role === 'admin'}
                  onEditClick={() => setView('admin')}
                />
              )}

              {settings.showTshirts && (activeType === 'tshirt' || activeType === 'all') && (
                <Products 
                  type="tshirt"
                  title="TSHIRT CENTER"
                  filter={filter} 
                  onFilterChange={setFilter} 
                  onAddToCart={addToCart} 
                  onProductClick={(p) => { setSelectedProduct(p); setView('product'); }}
                  productsPerRow={settings.productsPerRow}
                  isAdmin={user?.role === 'admin'}
                  onEditClick={() => setView('admin')}
                />
              )}
            </div>

            {settings.showAbout && <About isAdmin={user?.role === 'admin'} onEditClick={() => setView('admin')} />}
            {settings.showGallery && <Gallery isAdmin={user?.role === 'admin'} onEditClick={() => setView('admin')} />}
            {settings.showReviews && <Reviews />}
          </>
        )}
        
        {view === 'product' && selectedProduct && (
          <ProductPage 
            product={selectedProduct} 
            onAddToCart={addToCart} 
            onBack={() => setView('home')} 
          />
        )}
        
        {view === 'cart' && (
          <Cart 
            items={cart} 
            onUpdateQty={(id, delta) => setCart(prev => prev.map(i => i.product.id === id ? {...i, qty: Math.max(0, i.qty + delta)} : i).filter(i => i.qty > 0))}
            onCheckout={handleCheckout}
            user={user}
            onAuthRequired={() => setIsAuthOpen(true)}
          />
        )}

        {view === 'admin' && user?.role === 'admin' && (
          <AdminDashboard onClose={() => setView('home')} />
        )}
      </main>

      <Footer onCategoryClick={(cat) => { setFilter(cat); setView('home'); }} />
      <FloatingWhatsApp />
      
      {isAuthOpen && (
        <AuthModal 
          onClose={() => setIsAuthOpen(false)} 
          onLogin={handleLogin} 
        />
      )}
    </div>
  );
};

export default App;