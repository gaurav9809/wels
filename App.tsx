
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Cart from './components/Cart';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import ProductPage from './components/ProductPage';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { Product, StoreService, SiteSettings } from './services/StoreService';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'cart' | 'admin' | 'product'>('home');
  const [user, setUser] = useState<{name: string, email: string, role: string, avatar?: string} | null>(null);
  const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [settings, setSettings] = useState<SiteSettings>(StoreService.getSettings());

  // Check for persistent login on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('wels_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem('wels_user');
      }
    }

    // Load cart from storage if you want it persistent too
    const savedCart = localStorage.getItem('wels_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Sync cart to storage whenever it changes
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
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('wels_user');
    setView('home');
    window.scrollTo(0, 0);
  };

  const refreshData = () => {
    setSettings(StoreService.getSettings());
  };

  const handleNavigate = (newView: 'home' | 'cart' | 'admin' | 'product', category?: string, prod?: Product) => {
    if (prod) setSelectedProduct(prod);
    
    // Prevent non-admins from accessing admin view
    if (newView === 'admin' && user?.role !== 'admin') {
      setIsAuthOpen(true);
      return;
    }

    setView(newView);
    if (category) {
      setFilter(category);
      setTimeout(() => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (newView !== 'product') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
       window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar 
        cartCount={cart.reduce((a, b) => a + b.qty, 0)} 
        onViewChange={(v) => handleNavigate(v)} 
        user={user}
        onLoginClick={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      <main className="pt-20">
        {view === 'home' && (
          <>
            <Hero 
              settings={settings}
              onShopNow={() => document.getElementById('products')?.scrollIntoView({behavior: 'smooth'})} 
              onStoryClick={() => document.getElementById('about')?.scrollIntoView({behavior: 'smooth'})}
            />
            <Products 
              filter={filter} 
              onFilterChange={setFilter} 
              onAddToCart={addToCart} 
              onProductClick={(p) => handleNavigate('product', undefined, p)}
              productsPerRow={settings.productsPerRow}
            />
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
            onCheckout={() => {
              if(!user) return setIsAuthOpen(true);
              StoreService.createOrder({ 
                userId: user.email, 
                items: cart, 
                total: cart.reduce((a,b) => a + (b.product.price * b.qty), 0) 
              });
              setCart([]);
              alert("Order Placed Successfully!");
              setView('home');
            }}
          />
        )}

        {view === 'admin' && user?.role === 'admin' && (
          <AdminDashboard 
            onClose={() => { setView('home'); refreshData(); }} 
          />
        )}
      </main>

      <Footer onCategoryClick={(cat) => handleNavigate('home', cat)} />
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
