
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
        <div onClick={() => onViewChange('home')} className="cursor-pointer flex items-center gap-2 group">
          <div className="h-10 transition-transform group-hover:scale-105">
            <img 
              src="https://api.a0.dev/assets/image?text=WELS%20shoe%20brand%20logo%20modern%20minimalist&seed=123" 
              alt="WELS Logo" 
              className="h-full object-contain filter brightness-0 invert" 
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as any).parentElement.innerHTML = '<div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20"><span class="text-white text-lg font-black italic">W</span></div>';
              }}
            />
          </div>
          <div className="flex flex-col leading-none ml-1">
            <span className="text-2xl font-black heading-font tracking-tighter gradient-text uppercase">WELS</span>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex gap-6 items-center">
            <button onClick={() => onViewChange('home')} className="text-[10px] font-black uppercase tracking-widest hover:text-blue-500 transition-colors">Home</button>
            <button onClick={() => {
               document.getElementById('products')?.scrollIntoView({behavior: 'smooth'});
               onViewChange('home');
            }} className="text-[10px] font-black uppercase tracking-widest hover:text-blue-500 transition-colors">Shop</button>
          </div>
          
          <button onClick={() => onViewChange('cart')} className="relative p-2.5 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
            <i className="fas fa-shopping-bag text-lg"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-[10px] font-black w-5 h-5 rounded-lg flex items-center justify-center border-2 border-[#0a0a0a] shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'admin' && (
                <button 
                  onClick={() => onViewChange('admin')} 
                  className="flex items-center gap-2 text-[10px] font-black tracking-widest text-purple-400 border border-purple-400/30 px-3 py-2 rounded-xl hover:bg-purple-400 hover:text-black transition-all"
                >
                  <i className="fas fa-cog"></i>
                  <span className="hidden xs:inline">DASHBOARD</span>
                </button>
              )}
              <div className="flex items-center gap-2 bg-white/5 pr-4 pl-1.5 py-1.5 rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-[11px] font-black shadow-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                <button 
                  onClick={onLogout} 
                  className="ml-2 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-red-500 transition-all"
                >
                  <i className="fas fa-power-off text-[10px]"></i>
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={onLoginClick} 
              className="bg-white text-black px-8 py-3 rounded-xl text-xs font-black tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              SIGN IN
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
