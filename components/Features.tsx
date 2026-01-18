
import React from 'react';
import { StoreService } from '../services/StoreService';

interface Props {
  isAdmin?: boolean;
  onEditClick?: () => void;
}

const Features: React.FC<Props> = ({ isAdmin, onEditClick }) => {
  const settings = StoreService.getSettings();
  
  return (
    <section className="py-32 relative">
      {isAdmin && (
        <button 
          onClick={onEditClick}
          className="absolute top-10 left-1/2 -translate-x-1/2 z-[80] bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2"
        >
          <i className="fas fa-edit"></i> Edit_Features_Matrix
        </button>
      )}

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {settings.features.map((f, i) => (
          <div key={i} className="glass-card p-12 rounded-[3rem] group transition-all duration-700 reveal neon-border">
            <div className="scanline opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="flex justify-between items-start mb-10">
               <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500 border border-blue-500/20">
                 <i className={`fas ${f.icon} text-3xl text-blue-500 group-hover:text-white`}></i>
               </div>
               <span className="hud-data opacity-50">{f.stat}</span>
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter heading-font group-hover:gradient-text transition-all duration-500">{f.title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed group-hover:text-gray-300 transition-colors text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
