
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pb-20 pt-32">
      {isAdmin && (
        <button 
          onClick={onEditClick}
          className="absolute top-32 right-10 z-[80] bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2"
        >
          <i className="fas fa-edit"></i> Edit_Hero_Section
        </button>
      )}
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none opacity-20">
         <div className="absolute w-[800px] h-[800px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
         <div className="absolute w-[600px] h-[600px] border border-blue-500/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
        <div className="text-center lg:text-left reveal">
          <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full glass-card border-blue-500/30 text-blue-400 font-black mb-10 text-[10px] tracking-[0.6em] uppercase tech-font">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse"></span>
            System Online
          </div>
          
          <h1 className="text-7xl md:text-[8rem] font-black heading-font leading-[0.8] tracking-tighter mb-12 uppercase italic">
            {(settings.heroTitle || "BRAND NAME").split(' ').map((word, i) => (
              <span key={i} className={i === 0 ? "gradient-text block" : "text-white block"}>{word}</span>
            ))}
          </h1>

          <p className="text-gray-400 text-xl max-w-xl mb-16 mx-auto lg:mx-0 font-medium leading-relaxed border-l-4 border-blue-600/50 pl-8 py-2">
            {settings.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start items-center">
            <button onClick={onShopNow} className="relative overflow-hidden bg-white text-black px-16 py-7 rounded-2xl font-black text-xs tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-2 uppercase tech-font group">
              <div className="scanline"></div>
              Explore Collection
            </button>
          </div>
        </div>

        <div className="relative flex justify-center items-center reveal min-h-[500px]">
            {settings.heroImage ? (
              <div className="relative z-20 group">
                  <div className="absolute -inset-10 bg-blue-600/5 rounded-full blur-[100px]"></div>
                  <img src={settings.heroImage} alt="Hero" className="w-full max-w-3xl animate-float shoe-shadow object-contain h-[500px] md:h-[700px] relative z-20" />
              </div>
            ) : (
              <div className="w-full h-[400px] rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-gray-700">
                <i className="fas fa-image text-5xl mb-4"></i>
                <p className="tech-font text-[10px] uppercase tracking-widest">No Hero Image Uploaded</p>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
