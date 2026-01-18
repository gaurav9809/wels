
import React from 'react';
import { StoreService } from '../services/StoreService';

interface Props {
  isAdmin?: boolean;
  onEditClick?: () => void;
}

const Gallery: React.FC<Props> = ({ isAdmin, onEditClick }) => {
  const settings = StoreService.getSettings();
  const images = settings.galleryImages.length > 0 ? settings.galleryImages : [];

  if (images.length === 0 && !isAdmin) return null;

  return (
    <section className="py-24 bg-[#0d0d0d] relative">
      {isAdmin && (
        <button 
          onClick={onEditClick}
          className="absolute top-10 left-1/2 -translate-x-1/2 z-[80] bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
        >
          <i className="fas fa-edit"></i> Edit_Gallery
        </button>
      )}

      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-end gap-6 reveal">
        <div>
          <h2 className="text-4xl font-black heading-font uppercase">Visual Archive</h2>
          <p className="text-gray-400">Your brand story in frames.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto px-6">
        {images.length > 0 ? images.map((img, i) => (
          <div key={i} className={`group relative overflow-hidden rounded-2xl reveal ${i === 1 ? 'md:row-span-2' : ''} ${i === 4 ? 'md:col-span-2' : ''}`}>
            <img src={img} alt="Gallery" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 aspect-square" />
          </div>
        )) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 text-gray-700 font-black uppercase text-[10px] tracking-widest">
            Empty Archive // Upload in CMS
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
