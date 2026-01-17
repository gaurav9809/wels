
import React from 'react';
import { SiteSettings } from '../services/StoreService';

interface Props {
  settings: SiteSettings;
  onShopNow: () => void;
  onStoryClick: () => void;
}

const Hero: React.FC<Props> = ({ settings, onShopNow, onStoryClick }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden px-6">
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10 w-full">
        <div className="text-center md:text-left">
          <span className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 font-bold mb-6 text-xs tracking-widest uppercase">
            EST. 2024 • PREMIUM FOOTWEAR
          </span>
          <h1 className="text-5xl md:text-8xl font-black heading-font leading-none tracking-tight mb-6 uppercase">
            {settings.heroTitle.split(' ').map((word, i) => (
              <React.Fragment key={i}>
                {i === settings.heroTitle.split(' ').length - 1 ? <span className="gradient-text">{word}</span> : word + ' '}
                {i === 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-lg mb-10 mx-auto md:mx-0 font-light leading-relaxed">
            {settings.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={onShopNow}
              className="bg-white text-black px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-2xl"
            >
              SHOP COLLECTION
            </button>
            <button 
              onClick={onStoryClick}
              className="glass-card px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              OUR STORY
            </button>
          </div>
        </div>

        <div className="relative flex justify-center items-center">
            <div className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-white/5 rounded-full animate-[spin_30s_linear_infinite]"></div>
            <img 
                src={settings.heroImage} 
                alt="WELS Hero Shoe" 
                className="relative z-20 w-full max-w-lg animate-float shoe-shadow object-contain h-[400px]"
            />
        </div>
      </div>
    </section>
  );
};

export default Hero;
