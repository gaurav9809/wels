import React, { useState, useEffect } from 'react';
import { Product, StoreService } from '../services/StoreService';

interface Props {
  type: 'shoe' | 'tshirt';
  title: string;
  onAddToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
  filter: string;
  onFilterChange: (f: string) => void;
  productsPerRow: number;
  isAdmin?: boolean;
  onEditClick?: () => void;
}

const Products: React.FC<Props> = ({ type, title, onAddToCart, onProductClick, filter, onFilterChange, productsPerRow, isAdmin, onEditClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const shoeCats = ['All', 'Running', 'Casual', 'Training'];
  const tshirtCats = ['All', 'Oversized', 'Premium Cotton', 'Aesthetic'];
  const activeCats = type === 'shoe' ? shoeCats : tshirtCats;

  useEffect(() => {
    setProducts(StoreService.getProducts());
  }, []);

  const filteredProducts = products
    .filter(p => p.type === type)
    .filter(p => !p.isHidden || isAdmin)
    .filter(p => filter === 'All' || p.category === filter || !activeCats.includes(filter))
    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[productsPerRow] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  if (filteredProducts.length === 0 && !isAdmin) return null;

  return (
    <section id={type === 'shoe' ? 'products' : 'tshirts'} className="py-32 relative bg-black">
      <div className="max-w-7xl mx-auto px-6 text-center mb-20 reveal">
        <div className="inline-block mb-4">
           <span className="text-blue-500 font-black tracking-[0.5em] uppercase text-[10px]">{type} collection</span>
           <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-1"></div>
        </div>
        <h2 className="text-5xl md:text-8xl font-black heading-font mb-6 uppercase tracking-tighter italic text-white">{title.split(' ')[0]} <span className="gradient-text">{title.split(' ')[1]}</span></h2>
        
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {activeCats.map(cat => (
            <button 
              key={cat} 
              onClick={() => onFilterChange(cat)} 
              className={`px-10 py-4 rounded-2xl font-black tracking-widest text-[9px] uppercase transition-all duration-500 transform ${filter === cat ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105 border-transparent' : 'bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white border border-white/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={`max-w-7xl mx-auto px-6 grid ${gridCols} gap-12`}>
        {filteredProducts.map((p) => {
          const hasDiscount = p.compareAtPrice && p.compareAtPrice > p.price;
          const discountPercent = hasDiscount ? Math.round(((p.compareAtPrice! - p.price) / p.compareAtPrice!) * 100) : 0;

          return (
            <div key={p.id} onClick={() => onProductClick(p)} className={`reveal group glass-card rounded-[3.5rem] overflow-hidden cursor-pointer relative flex flex-col transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_100px_rgba(59,130,246,0.15)] ${p.isFeatured ? 'border-blue-500/40 bg-blue-500/[0.05]' : 'border-white/5'}`}>
              <div className="scanline"></div>
              {p.isFeatured && (
                <div className="absolute top-8 left-8 z-30 flex items-center gap-2 bg-blue-600 text-[8px] font-black uppercase px-4 py-2 rounded-full shadow-2xl animate-pulse"><i className="fas fa-bolt"></i> ULTRA_EDITION</div>
              )}
              {hasDiscount && (
                <div className="absolute top-8 right-8 z-30 bg-red-600 text-white text-[8px] font-black uppercase px-4 py-2 rounded-full shadow-2xl">-{discountPercent}% OFF</div>
              )}
              
              <div className="relative h-[400px] flex items-center justify-center p-14 group-hover:p-10 transition-all duration-700">
                <div className="absolute w-72 h-72 bg-blue-500/10 rounded-full blur-[120px] group-hover:bg-blue-500/25 transition-all duration-1000"></div>
                <img 
                  src={p.image} 
                  className={`w-full h-full object-contain transition-all duration-1000 z-10 ${type === 'shoe' ? 'rotate-[-15deg] group-hover:rotate-[-5deg] shoe-shadow' : 'group-hover:scale-110'}`} 
                  alt={p.name} 
                />
              </div>

              <div className="p-12 pt-0 relative z-20 flex-1 flex flex-col">
                <div className="mb-8">
                   <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.4em] mb-3">{p.category}</p>
                   <h3 className="text-3xl font-black heading-font tracking-tighter uppercase group-hover:text-blue-400 transition-all duration-500">{p.name}</h3>
                </div>
                
                <div className="mt-auto flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Price Protocol</span>
                    <div className="flex items-center gap-4">
                       <span className="text-white font-black text-4xl tracking-tighter">₹{p.price}</span>
                       {hasDiscount && <span className="text-gray-600 font-black text-xl tracking-tighter line-through opacity-50 decoration-red-600 decoration-2">₹{p.compareAtPrice}</span>}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onAddToCart(p); }} 
                    className="h-16 w-16 bg-white text-black flex items-center justify-center rounded-3xl hover:bg-blue-600 hover:text-white transition-all transform hover:rotate-12 active:scale-90"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Products;