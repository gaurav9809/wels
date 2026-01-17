
import React from 'react';

interface NavbarProps {
  cartCount: number;
  onViewChange: (view: 'home' | 'cart' | 'admin') => void;
  user: any;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onViewChange, user, onLoginClick, onLogout }) => {
  return (
    <nav className="fixed w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div onClick={() => onViewChange('home')} className="cursor-pointer text-2xl font-black heading-font tracking-tighter flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
            <span className="text-white text-lg font-black">W</span>
          </div>
          <span className="gradient-text">WELS</span>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex gap-6 items-center">
            <button onClick={() => onViewChange('home')} className="text-sm font-bold hover:text-blue-500 transition-colors">Home</button>
            <button onClick={() => {
               document.getElementById('products')?.scrollIntoView({behavior: 'smooth'});
               onViewChange('home');
            }} className="text-sm font-bold hover:text-blue-500 transition-colors">Shop</button>
          </div>
          
          <button onClick={() => onViewChange('cart')} className="relative p-2 hover:bg-white/5 rounded-full transition-all">
            <i className="fas fa-shopping-bag text-xl"></i>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-blue-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'admin' && (
                <button 
                  onClick={() => onViewChange('admin')} 
                  className="hidden sm:block text-[10px] font-black tracking-widest text-purple-400 border border-purple-400/30 px-3 py-1.5 rounded-lg hover:bg-purple-400 hover:text-black transition-all"
                >
                  ADMIN
                </button>
              )}
              <div className="flex items-center gap-2 bg-white/5 pr-4 pl-1 py-1 rounded-full border border-white/10">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold hidden sm:inline">{user.name}</span>
                <button 
                  onClick={onLogout} 
                  className="ml-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-500/20 text-red-500 transition-all"
                  title="Logout"
                >
                  <i className="fas fa-sign-out-alt text-[10px]"></i>
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={onLoginClick} 
              className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-black hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-white/5"
            >
              LOGIN
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
