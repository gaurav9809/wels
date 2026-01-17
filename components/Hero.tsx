
import React from 'react';
import { SiteSettings } from '../services/StoreService';

interface Props {
  settings: SiteSettings;
  onShopNow: () => void;
  onStoryClick: () => void;
}

const Hero: React.FC<Props> = ({ settings, onShopNow, onStoryClick }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden px-6 pt-12">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10 w-full">
        <div className="text-center md:text-left order-2 md:order-1">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-blue-400 font-black mb-8 text-[10px] tracking-[0.3em] uppercase">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            WELS OFFICIAL STORE • 2024
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black heading-font leading-[0.9] tracking-tighter mb-8 uppercase">
            {settings.heroTitle.includes('WELS') ? settings.heroTitle : `WELS ${settings.heroTitle}`.split(' ').map((word, i) => (
              <React.Fragment key={i}>
                {word === 'WELS' ? <span className="gradient-text">{word}</span> : word}{' '}
                {i === 1 && <br />}
              </React.Fragment>
            ))}
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-lg mb-12 mx-auto md:mx-0 font-light leading-relaxed">
            {settings.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
            <button 
              onClick={onShopNow}
              className="bg-white text-black px-12 py-5 rounded-[1.5rem] font-black text-xs tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-2xl active:scale-95 uppercase"
            >
              Explore Shop
            </button>
            <button 
              onClick={onStoryClick}
              className="glass-card px-12 py-5 rounded-[1.5rem] font-black text-xs tracking-[0.2em] hover:bg-white/10 transition-all uppercase border border-white/5"
            >
              Our Legacy
            </button>
          </div>
        </div>

        <div className="relative flex justify-center items-center order-1 md:order-2">
            <div className="absolute w-[350px] h-[350px] md:w-[550px] md:h-[550px] border border-white/5 rounded-[4rem] animate-[spin_40s_linear_infinite]"></div>
            <div className="absolute w-[250px] h-[250px] md:w-[450px] md:h-[450px] border border-blue-500/10 rounded-full"></div>
            
            <img 
                src={settings.heroImage} 
                alt="WELS Signature Model" 
                className="relative z-20 w-full max-w-lg animate-float shoe-shadow object-contain h-[350px] md:h-[500px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000';
                }}
            />
            
            {/* Logo Badge Overlay */}
            <div className="absolute -bottom-4 -right-4 md:bottom-10 md:right-10 z-30 bg-black/60 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex items-center gap-3 animate-bounce">
              <img src="https://raw.githubusercontent.com/vibe-stream/cdn/main/WELS-logo.png" className="w-8 h-8 object-contain filter invert" alt="WELS" />
              <div className="text-left">
                <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">WELS TECH</p>
                <p className="text-xs font-bold">2024 DROP</p>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
