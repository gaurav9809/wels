
import React from 'react';
import { StoreService } from '../services/StoreService';

interface Props {
  isAdmin?: boolean;
  onEditClick?: () => void;
}

const About: React.FC<Props> = ({ isAdmin, onEditClick }) => {
  const settings = StoreService.getSettings();

  return (
    <section id="about" className="py-24 relative">
      {isAdmin && (
        <button 
          onClick={onEditClick}
          className="absolute top-10 right-10 z-[80] bg-purple-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2"
        >
          <i className="fas fa-edit"></i> Edit_Brand_Story
        </button>
      )}

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 reveal">
          {settings.aboutImage ? (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <img src={settings.aboutImage} className="relative rounded-3xl w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Brand Story" />
            </div>
          ) : (
            <div className="w-full h-[500px] bg-white/5 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center text-gray-700 italic text-sm">
              Upload About Image in Admin
            </div>
          )}
        </div>
        <div className="flex-1 reveal">
          <h2 className="text-4xl md:text-5xl font-black heading-font mb-6 uppercase">
            {settings.aboutTitle}
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {settings.aboutText}
          </p>
          <button className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all tech-font uppercase">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
