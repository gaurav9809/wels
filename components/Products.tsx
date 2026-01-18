import React, { useState, useEffect } from 'react';
import { Product, StoreService } from '../services/StoreService';

interface Props {
  onAddToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
  filter: string;
  onFilterChange: (f: string) => void;
  productsPerRow: number;
  isAdmin?: boolean;
  onEditClick?: () => void;
}

const Products: React.FC<Props> = ({ onAddToCart, onProductClick, filter, onFilterChange, productsPerRow, isAdmin, onEditClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const categories = ['All', 'Running', 'Casual', 'Training'];

  useEffect(() => {
    setProducts(StoreService.getProducts());
  }, []);

  const filteredProducts = products
    .filter(p => !p.isHidden || isAdmin)
    .filter(p => filter === 'All' || p.category === filter)
    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[productsPerRow] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section id="products" className="py-32 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto px-6 text-center mb-20 reveal">
        {isAdmin && (
          <button onClick={onEditClick} className="mb-8 bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto">
            <i className="fas fa-edit"></i> Edit_Store_Inventory
          </button>
        )}
        <div className="inline-block mb-4">
           <span className="text-blue-500 font-black tracking-[0.5em] uppercase text-[10px]">Premium Selection</span>
           <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-1"></div>
        </div>
        <h2 className="text-5xl md:text-7xl font-black heading-font mb-6 uppercase tracking-tighter italic">WELS <span className="gradient-text">EDITIONS</span></h2>
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {categories.map(cat => (
            <button key={cat} onClick={() => onFilterChange(cat)} className={`px-10 py-3.5 rounded-2xl font-black tracking-widest text-[10px] uppercase transition-all duration-500 transform ${filter === cat ? 'bg-blue-600 text-white shadow-xl scale-105 border-transparent' : 'bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white border border-white/5'}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className={`max-w-7xl mx-auto px-6 grid ${gridCols} gap-10 lg:gap-14`}>
        {filteredProducts.map((p) => {
          const hasDiscount = p.compareAtPrice && p.compareAtPrice > p.price;
          const discountPercent = hasDiscount ? Math.round(((p.compareAtPrice! - p.price) / p.compareAtPrice!) * 100) : 0;

          return (
            <div key={p.id} onClick={() => onProductClick(p)} className={`reveal group glass-card rounded-[3rem] overflow-hidden cursor-pointer hover-shine relative flex flex-col transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] ${p.isFeatured ? 'border-blue-500/20 bg-blue-500/[0.03]' : ''}`}>
              {p.isFeatured && (
                <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-blue-600 text-[9px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg animate-pulse"><i className="fas fa-bolt text-[8px]"></i> ELITE</div>
              )}
              {hasDiscount && (
                <div className="absolute top-16 left-6 z-20 bg-red-600 text-white text-[9px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg">-{discountPercent}%</div>
              )}
              <div className="relative h-96 flex items-center justify-center p-12 bg-gradient-to-b from-white/[0.02] to-transparent overflow-hidden">
                <div className="absolute w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] group-hover:bg-blue-600/20 transition-all duration-1000"></div>
                <img src={p.image} className="w-full h-full object-contain rotate-[-12deg] group-hover:rotate-[-5deg] group-hover:scale-115 transition-all duration-1000 shoe-shadow z-10" alt={p.name} />
              </div>
              <div className="p-10 pt-4 relative z-20 flex-1 flex flex-col">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em] mb-2">{p.category}</p>
                    <h3 className="text-3xl font-black heading-font tracking-tighter uppercase leading-tight group-hover:gradient-text transition-all duration-500">{p.name}</h3>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Pricing Protocol</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-black text-3xl tracking-tighter">₹{p.price}</span>
                      {hasDiscount && <span className="text-gray-600 font-black text-lg tracking-tighter line-through decoration-red-600/50 decoration-2">₹{p.compareAtPrice}</span>}
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); onAddToCart(p); }} className="h-14 px-8 bg-white text-black font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all uppercase tracking-[0.2em] text-[10px] shadow-xl active:scale-95 flex items-center gap-2"><i className="fas fa-plus text-[8px]"></i> Add</button>
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