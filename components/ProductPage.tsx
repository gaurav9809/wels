
import React, { useState, useEffect } from 'react';
import { Product, Variant } from '../services/StoreService';

interface Props {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBack: () => void;
}

const ProductPage: React.FC<Props> = ({ product, onAddToCart, onBack }) => {
  // Use product.images or fallback to single product.image
  const productImages = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.image];

  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants?.[0] || { color: 'Default', images: productImages, sizes: [] }
  );
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [activeImg, setActiveImg] = useState(productImages[0]);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    // If variant has its own images, use them, otherwise use the product gallery
    const variantImages = (selectedVariant.images && selectedVariant.images.length > 0) 
      ? selectedVariant.images 
      : productImages;
    setActiveImg(variantImages[0]);
    setSelectedSize(null);
    window.scrollTo(0, 0);
  }, [selectedVariant, product]);

  const sizeMatrix = [
    { uk_india: 6, us: 7, cm: 24.5 },
    { uk_india: 7, us: 8, cm: 25.4 },
    { uk_india: 8, us: 9, cm: 26.2 },
    { uk_india: 9, us: 10, cm: 27.1 },
    { uk_india: 10, us: 11, cm: 27.9 },
    { uk_india: 11, us: 12, cm: 28.8 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-12 group transition-all">
        <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> 
        <span className="font-bold tracking-widest text-xs uppercase tech-font">Exit_Product_View</span>
      </button>

      <div className="grid lg:grid-cols-2 gap-16 mb-32">
        <div className="space-y-6">
          <div className="glass-card rounded-[3rem] p-12 flex items-center justify-center bg-gradient-to-br from-blue-600/10 to-purple-600/10 min-h-[500px] group overflow-hidden relative border-blue-500/20">
            <div className="absolute top-8 left-8 text-[10px] tech-font text-blue-500 opacity-50 uppercase tracking-[0.5em]">Vision_Scan_V1</div>
            <img 
              src={activeImg} 
              alt={product.name} 
              className="w-full h-auto object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-3"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {productImages.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImg(img)}
                className={`w-24 h-24 rounded-2xl overflow-hidden glass-card flex-shrink-0 border-2 transition-all p-2 bg-white/5 ${activeImg === img ? 'border-blue-500 scale-105 shadow-lg shadow-blue-600/20' : 'border-transparent opacity-40 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-blue-500 font-black tracking-[0.2em] uppercase text-[10px] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">{product.category}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black heading-font mt-2 mb-6 tracking-tighter italic uppercase">{product.name}</h1>
            <div className="flex items-center gap-6">
              <span className="text-4xl font-black gradient-text">${product.price}</span>
            </div>
          </div>

          <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light border-l-2 border-blue-600/30 pl-6">
            {product.description || "Experience next-level comfort and performance with our signature WELS technology. Built for those who demand excellence in every step."}
          </p>

          <div className="space-y-10 mb-12">
            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest tech-font">Select_Size (INDIA/UK)</p>
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-all flex items-center gap-2 border-b border-blue-500/30 pb-1"
                >
                  <i className="fas fa-ruler-combined"></i> Ruler_Tool
                </button>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {sizeMatrix.map(m => (
                    <button 
                      key={m.uk_india} 
                      onClick={() => setSelectedSize(m.uk_india)}
                      className={`h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-black transition-all relative ${
                        selectedSize === m.uk_india 
                        ? 'border-blue-500 bg-blue-500 text-white shadow-xl shadow-blue-500/30' 
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-blue-500 hover:text-blue-500'
                      }`}
                    >
                      <span className="text-sm">{m.uk_india}</span>
                      <span className="text-[8px] opacity-50 tech-font">UK/IND</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              disabled={!selectedSize}
              onClick={() => { onAddToCart(product); alert(`Added ${product.name} to cart!`); }}
              className={`flex-1 py-6 rounded-2xl font-black text-xs tracking-[0.4em] transition-all transform shadow-2xl tech-font ${
                selectedSize 
                ? 'bg-white text-black hover:bg-blue-600 hover:text-white hover:-translate-y-1' 
                : 'bg-white/5 text-gray-600 cursor-not-allowed'
              }`}
            >
              {selectedSize ? 'INITIALIZE_ORDER' : 'SELECT_DIMENSIONS'}
            </button>
          </div>
        </div>
      </div>

      {/* Size Guide Modal omitted for brevity, same as original */}
    </div>
  );
};

export default ProductPage;
