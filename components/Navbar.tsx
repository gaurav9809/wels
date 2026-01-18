import React from 'react';

interface NavbarProps {
  cartCount: number;
  onViewChange: (view: 'home' | 'cart' | 'admin') => void;
  activeType: 'shoe' | 'tshirt' | 'all';
  onTypeChange: (type: 'shoe' | 'tshirt' | 'all') => void;
  user: any;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onViewChange, activeType, onTypeChange, user, onLoginClick, onLogout }) => {
  return (
    <nav className="fixed w-full z-[100] px-2 py-3 md:px-6 md:py-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/80 md:bg-black/40 backdrop-blur-3xl border border-white/10 md:border-white/5 rounded-2xl md:rounded-3xl p-1.5 md:p-3 px-3 md:px-8 pointer-events-auto shadow-2xl relative overflow-hidden">
        <div className="scanline opacity-10"></div>
        
        {/* Logo Section */}
        <div onClick={() => onViewChange('home')} className="cursor-pointer flex items-center gap-2 md:gap-4 group shrink-0">
          <div className="h-7 w-7 md:h-10 md:w-10 bg-white/5 rounded-lg md:rounded-xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-all">
            <img 
              src="https://api.a0.dev/assets/image?text=WELS%20shoe%20brand%20logo%20modern%20minimalist&seed=123" 
              alt="WELS" 
              className="h-4 md:h-7 object-contain invert" 
            />
          </div>
          <span className="text-sm md:text-2xl font-black heading-font tracking-tighter gradient-text uppercase hidden xs:block">WELS</span>
        </div>

        {/* Categories / Type Switcher */}
        <div className="flex items-center gap-1.5 md:gap-8 overflow-hidden">
          <div className="flex gap-1 md:gap-3 items-center">
            <button 
              onClick={() => onTypeChange('shoe')}
              className={`text-[7px] md:text-[9px] font-black uppercase tracking-widest transition-all tech-font relative px-2 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl flex items-center ${activeType === 'shoe' ? 'text-blue-500 bg-blue-500/10 border border-blue-500/30' : 'text-gray-400 hover:text-white border border-transparent'}`}
            >
              <i className="fas fa-shoe-prints mr-1 md:mr-2"></i> 
              <span className="hidden sm:inline">Shoes</span>
            </button>
            <button 
              onClick={() => onTypeChange('tshirt')}
              className={`text-[7px] md:text-[9px] font-black uppercase tracking-widest transition-all tech-font relative px-2 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl flex items-center ${activeType === 'tshirt' ? 'text-purple-500 bg-purple-500/10 border border-purple-500/30' : 'text-gray-400 hover:text-white border border-transparent'}`}
            >
              <i className="fas fa-shirt mr-1 md:mr-2"></i> 
              <span className="hidden sm:inline">Apparel</span>
            </button>
            <button 
              onClick={() => onTypeChange('all')}
              className={`text-[7px] md:text-[9px] font-black uppercase tracking-widest transition-all tech-font relative px-2 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl hidden lg:flex items-center ${activeType === 'all' ? 'text-green-500 bg-green-500/10 border border-green-500/30' : 'text-gray-400 hover:text-white border border-transparent'}`}
            >
              All
            </button>
          </div>
          
          <div className="hidden sm:block h-6 w-[1px] bg-white/10 mx-1 md:mx-2"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 md:gap-3">
            <button onClick={() => onViewChange('cart')} className="relative p-2 md:p-3 hover:bg-white/5 rounded-xl md:rounded-2xl transition-all border border-transparent hover:border-white/10 group">
              <i className="fas fa-shopping-bag text-sm md:text-lg group-hover:scale-110 transition-transform text-white"></i>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-blue-600 text-[7px] md:text-[10px] font-black w-3.5 h-3.5 md:w-5 md:h-5 rounded-md md:rounded-lg flex items-center justify-center border-2 border-[#0a0a0a] shadow-lg text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-1 md:gap-3">
                <div 
                  onClick={() => user.role === 'admin' && onViewChange('admin')}
                  className="flex items-center gap-1 md:gap-3 bg-white/5 p-1 md:p-1.5 md:pr-4 rounded-xl md:rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all group cursor-pointer"
                >
                  <div className="w-6 h-6 md:w-9 md:h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center text-[9px] md:text-xs font-black shadow-lg shadow-blue-600/20 group-hover:rotate-12 transition-transform text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                     <p className="text-[6px] font-black text-blue-400 uppercase tracking-widest mb-0.5">{user.role === 'admin' ? 'ADMIN' : 'User'}</p>
                     <p className="text-[9px] font-bold tracking-tight truncate max-w-[50px] text-white">{user.name.split(' ')[0]}</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onLogout(); }} 
                    className="ml-0.5 md:ml-1 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-red-500 transition-all"
                  >
                    <i className="fas fa-power-off text-[8px] md:text-[10px]"></i>
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={onLoginClick} 
                className="bg-white text-black px-3 md:px-8 py-2 md:py-3 rounded-lg md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                Access
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;