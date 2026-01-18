
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
    <nav className="fixed w-full z-[100] px-6 py-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-3 px-8 pointer-events-auto shadow-2xl neon-border relative overflow-hidden">
        <div className="scanline opacity-10"></div>
        
        <div onClick={() => onViewChange('home')} className="cursor-pointer flex items-center gap-4 group">
          <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-blue-500/50 transition-all">
            <img 
              src="https://api.a0.dev/assets/image?text=WELS%20shoe%20brand%20logo%20modern%20minimalist&seed=123" 
              alt="WELS" 
              className="h-7 object-contain invert" 
            />
          </div>
          <span className="text-2xl font-black heading-font tracking-tighter gradient-text uppercase hidden xs:block">WELS</span>
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="hidden md:flex gap-8 items-center">
            {['Home', 'Shop', 'Vision'].map((link) => (
              <button 
                key={link}
                onClick={() => link === 'Shop' ? document.getElementById('products')?.scrollIntoView({behavior: 'smooth'}) : onViewChange('home')}
                className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-blue-500 transition-all tech-font relative group"
              >
                {link}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
              </button>
            ))}
          </div>
          
          <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>

          {user?.role === 'admin' && (
            <button 
              onClick={() => onViewChange('admin')}
              className="hidden lg:flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/30 text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
            >
              <i className="fas fa-tools"></i> ADMIN_PANEL
            </button>
          )}

          <button onClick={() => onViewChange('cart')} className="relative p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 group">
            <i className="fas fa-shopping-bag text-lg group-hover:scale-110 transition-transform"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-[10px] font-black w-5 h-5 rounded-lg flex items-center justify-center border-2 border-[#0a0a0a] shadow-lg shadow-blue-600/40">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div 
                onClick={() => user.role === 'admin' && onViewChange('admin')}
                className="flex items-center gap-3 bg-white/5 p-1.5 pr-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-xs font-black shadow-lg shadow-blue-600/20 group-hover:rotate-12 transition-transform">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                   <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-0.5">{user.role === 'admin' ? 'MASTER_ADMIN' : 'Authorized User'}</p>
                   <p className="text-[11px] font-bold tracking-tight truncate max-w-[80px]">{user.name}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onLogout(); }} 
                  className="ml-2 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-500/20 text-red-500 transition-all"
                >
                  <i className="fas fa-power-off text-xs"></i>
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={onLoginClick} 
              className="bg-white text-black px-10 py-3.5 rounded-2xl text-[10px] font-black tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95 tech-font"
            >
              LOGIN_SEC
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
