
import React, { useState, useEffect } from 'react';
import { Product, Variant } from '../services/StoreService';

interface Props {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBack: () => void;
}

const ProductPage: React.FC<Props> = ({ product, onAddToCart, onBack }) => {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants?.[0] || { color: 'Default', images: [product.image], sizes: [] }
  );
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [activeImg, setActiveImg] = useState(selectedVariant.images?.[0] || product.image);

  useEffect(() => {
    setActiveImg(selectedVariant.images?.[0] || product.image);
    setSelectedSize(null);
  }, [selectedVariant]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-12 group transition-all">
        <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> 
        <span className="font-bold tracking-widest text-xs uppercase">Back to Collection</span>
      </button>

      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-6">
          <div className="glass-card rounded-[3rem] p-12 flex items-center justify-center bg-gradient-to-br from-blue-600/10 to-purple-600/10 min-h-[500px] group overflow-hidden">
            <img 
              src={activeImg} 
              alt={product.name} 
              className="w-full h-auto object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-3"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {(selectedVariant.images || [product.image]).map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImg(img)}
                className={`w-24 h-24 rounded-2xl overflow-hidden glass-card flex-shrink-0 border-2 transition-all p-2 bg-white/5 ${activeImg === img ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-blue-500 font-black tracking-[0.2em] uppercase text-[10px] bg-blue-500/10 px-3 py-1 rounded-full">{product.category}</span>
              {selectedVariant.sizes.reduce((acc, s) => acc + s.stock, 0) === 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Sold Out</span>
              )}
            </div>
            <h1 className="text-5xl md:text-7xl font-black heading-font mt-2 mb-6 tracking-tighter">{product.name}</h1>
            <div className="flex items-center gap-6">
              <span className="text-4xl font-black gradient-text">${product.price}</span>
              <div className="h-8 w-[1px] bg-white/10"></div>
              <div className="flex text-yellow-500 text-xs gap-1">
                {[1,2,3,4,5].map(s => <i key={s} className="fas fa-star"></i>)}
                <span className="ml-2 text-gray-500 font-bold tracking-widest">(4.9/5)</span>
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
            {product.description}
          </p>

          <div className="space-y-10 mb-12">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Available Colors</p>
              <div className="flex flex-wrap gap-4">
                {product.variants?.map((v, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedVariant(v)}
                    className={`px-6 py-3 rounded-2xl border-2 transition-all font-bold text-sm ${selectedVariant.color === v.color ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/20'}`}
                  >
                    {v.color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Select US Size</p>
              <div className="flex flex-wrap gap-3">
                {[7, 8, 9, 10, 11, 12].map(s => {
                  const stockInfo = selectedVariant.sizes.find(sz => sz.size === s);
                  const isOutOfStock = !stockInfo || stockInfo.stock <= 0;
                  return (
                    <button 
                      key={s} 
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSize(s)}
                      className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-bold transition-all relative ${
                        selectedSize === s 
                        ? 'border-blue-500 bg-blue-500 text-white shadow-xl shadow-blue-500/30' 
                        : isOutOfStock 
                          ? 'border-white/5 bg-black/40 text-gray-700 cursor-not-allowed'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-blue-500 hover:text-blue-500'
                      }`}
                    >
                      {s}
                      {isOutOfStock && <div className="absolute w-[80%] h-[2px] bg-red-500/50 rotate-45"></div>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              disabled={!selectedSize}
              onClick={() => { onAddToCart(product); alert(`Added ${product.name} (${selectedVariant.color}, Size ${selectedSize}) to cart!`); }}
              className={`flex-1 py-5 rounded-2xl font-black text-lg transition-all transform shadow-2xl ${
                selectedSize 
                ? 'bg-white text-black hover:bg-blue-600 hover:text-white hover:-translate-y-1 shadow-white/5' 
                : 'bg-white/5 text-gray-600 cursor-not-allowed'
              }`}
            >
              {selectedSize ? 'ADD TO CART' : 'SELECT SIZE'}
            </button>
            <button className="w-20 h-20 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-gray-500 hover:text-red-500">
              <i className="far fa-heart text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
