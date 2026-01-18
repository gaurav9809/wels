import React, { useState, useEffect, useRef } from 'react';
import { Product, Variant } from '../services/StoreService';

interface Props {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBack: () => void;
}

const ProductPage: React.FC<Props> = ({ product, onAddToCart, onBack }) => {
  const productImages = (product.images && product.images.length > 0) ? product.images : [product.image];
  const [selectedSize, setSelectedSize] = useState<string | number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveIndex(0);
    setSelectedSize(null);
    window.scrollTo(0, 0);
    if (carouselRef.current) carouselRef.current.scrollLeft = 0;
  }, [product]);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  const scrollToImage = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * carouselRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

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
          {/* Kinetic Carousel Container */}
          <div className="relative group overflow-hidden glass-card rounded-[4rem] border-white/5 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5">
            <div className="absolute top-10 left-10 z-30 text-[9px] tech-font text-blue-500 opacity-40 uppercase tracking-[0.5em]">
              Visual_Stream: Frame_0{activeIndex + 1}
            </div>
            
            {/* Scanline Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-40">
              <div 
                className="h-full bg-blue-500 transition-all duration-500 shadow-[0_0_10px_#3b82f6]"
                style={{ width: `${((activeIndex + 1) / productImages.length) * 100}%` }}
              ></div>
            </div>

            <div 
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar min-h-[500px] md:min-h-[600px] items-center"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {productImages.map((img, i) => (
                <div key={i} className="min-w-full h-full flex items-center justify-center p-12 md:p-24 snap-center relative">
                  <div className="absolute w-[80%] h-[80%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                  <img 
                    src={img} 
                    alt={`${product.name} perspective ${i}`} 
                    className={`w-full max-h-[500px] object-contain transition-all duration-700 transform ${product.type === 'shoe' ? 'rotate-[-10deg] drop-shadow-[0_40px_40px_rgba(0,0,0,0.6)]' : 'drop-shadow-2xl'}`} 
                  />
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
              {productImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToImage(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${activeIndex === i ? 'w-8 bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>

            {/* Side Controls (Desktop) */}
            <div className="absolute inset-y-0 left-4 items-center hidden lg:flex">
              <button 
                onClick={() => scrollToImage(Math.max(0, activeIndex - 1))}
                className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-all text-white opacity-0 group-hover:opacity-100"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </div>
            <div className="absolute inset-y-0 right-4 items-center hidden lg:flex">
              <button 
                onClick={() => scrollToImage(Math.min(productImages.length - 1, activeIndex + 1))}
                className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-all text-white opacity-0 group-hover:opacity-100"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          {/* Thumbnail Track for quick jump */}
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {productImages.map((img, i) => (
              <button 
                key={i} 
                onClick={() => scrollToImage(i)} 
                className={`w-24 h-24 rounded-[1.5rem] overflow-hidden glass-card p-3 border-2 transition-all flex-shrink-0 ${activeIndex === i ? 'border-blue-500 bg-blue-500/10 scale-105' : 'border-transparent opacity-40 hover:opacity-100'}`}
              >
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
            {product.description || "Synthesizing high-performance engineering with street-level aesthetics. Every fiber is optimized for peak operational capacity and maximum structural integrity."}
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
             <button className="w-20 h-20 rounded-3xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all group">
                <i className="far fa-heart text-xl group-hover:scale-125 transition-transform"></i>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;