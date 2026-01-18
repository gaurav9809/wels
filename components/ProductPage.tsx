import React, { useState, useEffect } from 'react';
import { Product, Variant } from '../services/StoreService';

interface Props {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBack: () => void;
}

const ProductPage: React.FC<Props> = ({ product, onAddToCart, onBack }) => {
  const productImages = (product.images && product.images.length > 0) ? product.images : [product.image];
  const [selectedSize, setSelectedSize] = useState<string | number | null>(null);
  const [activeImg, setActiveImg] = useState(productImages[0]);

  useEffect(() => {
    setActiveImg(productImages[0]);
    setSelectedSize(null);
    window.scrollTo(0, 0);
  }, [product]);

  const shoeSizes = [6, 7, 8, 9, 10, 11];
  const tshirtSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const sizesToDisplay = product.type === 'shoe' ? shoeSizes : tshirtSizes;

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <button onClick={onBack} className="flex items-center gap-3 text-gray-500 hover:text-blue-500 mb-12 group transition-all tech-font text-[10px] font-black uppercase tracking-widest">
        <i className="fas fa-arrow-left group-hover:-translate-x-2 transition-transform"></i> Return_to_Archive
      </button>

      <div className="grid lg:grid-cols-2 gap-20">
        <div className="space-y-8">
          <div className="glass-card rounded-[4rem] p-16 flex items-center justify-center bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 min-h-[600px] border-white/5 group relative">
            <div className="absolute top-10 left-10 text-[9px] tech-font text-blue-500 opacity-40 uppercase tracking-[0.5em]">High_Resolution_Scan</div>
            <img 
              src={activeImg} 
              alt={product.name} 
              className={`w-full h-auto object-contain transition-all duration-1000 transform group-hover:scale-110 ${product.type === 'shoe' ? 'rotate-[-10deg] drop-shadow-[0_40px_40px_rgba(0,0,0,0.6)]' : 'drop-shadow-2xl'}`} 
            />
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
            {productImages.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(img)} className={`w-28 h-28 rounded-[2rem] overflow-hidden glass-card p-4 border-2 transition-all flex-shrink-0 ${activeImg === img ? 'border-blue-500 bg-blue-500/10' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                <img src={img} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-10">
            <span className="text-blue-500 font-black tracking-[0.4em] uppercase text-[10px] bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">{product.category} // {product.type}</span>
            <h1 className="text-6xl md:text-8xl font-black heading-font mt-8 mb-8 tracking-tighter italic uppercase text-white leading-tight">{product.name}</h1>
            <div className="flex items-center gap-8">
               <span className="text-6xl font-black gradient-text tracking-tighter italic">₹{product.price}</span>
               {hasDiscount && <span className="text-3xl text-gray-700 font-black line-through decoration-red-600/40">₹{product.compareAtPrice}</span>}
            </div>
          </div>

          <p className="text-gray-400 text-xl mb-12 leading-relaxed font-light border-l-4 border-blue-600/30 pl-10 max-w-xl">
            {product.description || "Synthesizing high-performance engineering with street-level aesthetics. Every fiber is optimized for peak operational capacity."}
          </p>

          <div className="mb-14">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-8 tech-font italic">Select_Dimensions</p>
            <div className="flex flex-wrap gap-4">
               {sizesToDisplay.map(size => (
                 <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)} 
                  className={`h-16 px-8 rounded-2xl border-2 font-black transition-all tech-font text-xs flex items-center justify-center ${selectedSize === size ? 'border-blue-500 bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'border-white/10 bg-white/5 text-gray-500 hover:border-blue-500/50'}`}
                 >
                   {size} {product.type === 'shoe' ? 'UK' : ''}
                 </button>
               ))}
            </div>
          </div>

          <div className="flex gap-6">
             <button 
              disabled={!selectedSize} 
              onClick={() => { onAddToCart(product); alert(`AUTHORIZED: ${product.name} locked into payload.`); }} 
              className={`flex-1 py-7 rounded-3xl font-black text-[11px] uppercase tracking-[0.6em] transition-all transform shadow-2xl tech-font ${selectedSize ? 'bg-white text-black hover:bg-blue-600 hover:text-white hover:-translate-y-2' : 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5'}`}
             >
               {selectedSize ? 'Initiate_Purchase_Protocol' : 'Selection_Required'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;