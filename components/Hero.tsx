import React from 'react';
import { SiteSettings } from '../services/StoreService';

interface Props {
  settings: SiteSettings;
  onShopNow: () => void;
  onStoryClick: () => void;
  isAdmin?: boolean;
  onEditClick?: () => void;
}

const Hero: React.FC<Props> = ({ settings, onShopNow, onStoryClick, isAdmin, onEditClick }) => {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 pb-12 md:pb-20 pt-28 md:pt-32">
      {isAdmin && (
        <button 
          onClick={onEditClick}
          className="absolute top-24 right-4 md:right-10 z-[80] bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2"
        >
          <i className="fas fa-edit"></i> Edit_Hero
        </button>
      )}
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none opacity-20">
         <div className="absolute w-[300px] h-[300px] md:w-[800px] md:h-[800px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
         <div className="absolute w-[250px] h-[250px] md:w-[600px] md:h-[600px] border border-blue-500/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10 w-full text-center lg:text-left">
        <div className="reveal order-2 lg:order-1 px-4 sm:px-0">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 md:px-6 md:py-2 rounded-full glass-card border-blue-500/30 text-blue-400 font-black mb-6 md:mb-10 text-[8px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] uppercase tech-font">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse"></span>
            System Online
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-[7rem] lg:text-[8rem] font-black heading-font leading-[0.9] md:leading-[0.8] tracking-tighter mb-8 md:mb-12 uppercase italic">
            {(settings.heroTitle || "BRAND NAME").split(' ').map((word, i) => (
              <span key={i} className={i === 0 ? "gradient-text block" : "text-white block"}>{word}</span>
            ))}
          </h1>

          <p className="text-gray-400 text-sm sm:text-lg md:text-xl max-w-xl mb-10 md:mb-16 mx-auto lg:mx-0 font-medium leading-relaxed border-l-2 lg:border-l-4 border-blue-600/50 pl-4 md:pl-8 py-1 md:py-2 text-center lg:text-left">
            {settings.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center lg:justify-start items-center">
            <button onClick={onShopNow} className="w-full sm:w-auto relative overflow-hidden bg-white text-black px-10 md:px-16 py-5 md:py-7 rounded-2xl font-black text-[10px] md:text-xs tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 md:hover:-translate-y-2 uppercase tech-font group">
              <div className="scanline"></div>
              Explore Collection
            </button>
          </div>
        </div>

        <div className="relative flex justify-center items-center reveal min-h-[300px] md:min-h-[500px] order-1 lg:order-2">
            {settings.heroImage ? (
              <div className="relative z-20 group px-8 sm:px-0">
                  <div className="absolute -inset-4 sm:-inset-10 bg-blue-600/5 rounded-full blur-[60px] md:blur-[100px]"></div>
                  <img src={settings.heroImage} alt="Hero" className="w-full max-w-[280px] sm:max-w-md md:max-w-2xl lg:max-w-3xl animate-float shoe-shadow object-contain h-auto relative z-20" />
              </div>
            ) : (
              <div className="w-full h-[250px] md:h-[400px] rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-gray-700">
                <i className="fas fa-image text-3xl md:text-5xl mb-4"></i>
                <p className="tech-font text-[8px] md:text-[10px] uppercase tracking-widest">No Image</p>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default Hero;