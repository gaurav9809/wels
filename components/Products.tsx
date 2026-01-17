
import React, { useState, useEffect } from 'react';
import { Product, StoreService } from '../services/StoreService';

interface Props {
  onAddToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
  filter: string;
  onFilterChange: (f: string) => void;
  productsPerRow: number;
}

const Products: React.FC<Props> = ({ onAddToCart, onProductClick, filter, onFilterChange, productsPerRow }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const categories = ['All', 'Running', 'Casual', 'Training'];

  useEffect(() => {
    setProducts(StoreService.getProducts());
  }, []);

  const filteredProducts = products
    .filter(p => !p.isHidden) // Don't show hidden shoes
    .filter(p => filter === 'All' || p.category === filter)
    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)); // Featured first

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[productsPerRow] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section id="products" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black heading-font mb-4 uppercase tracking-tighter">
          WELS <span className="text-blue-500">COLLECTION</span>
        </h2>
        <div className="w-20 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => onFilterChange(cat)}
              className={`px-8 py-3 rounded-full font-bold transition-all duration-300 transform ${
                filter === cat 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105' 
                : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={`max-w-7xl mx-auto px-6 grid ${gridCols} gap-10`}>
        {filteredProducts.map((p) => (
          <div 
            key={p.id} 
            onClick={() => onProductClick(p)}
            className={`group glass-card rounded-[2.5rem] overflow-hidden cursor-pointer hover-shine relative ${p.isFeatured ? 'border-blue-500/30 bg-blue-500/5' : ''}`}
          >
            {p.isFeatured && (
              <div className="absolute top-4 left-4 z-20 bg-blue-600 text-[8px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                FEATURED
              </div>
            )}
            <div 
              className={`relative h-80 flex items-center justify-center p-8 bg-gradient-to-b from-blue-600/5 to-transparent group-hover:from-blue-600/15 transition-colors duration-500`}
            >
              <div className="absolute w-48 h-48 bg-blue-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <img 
                src={p.image} 
                className="w-full h-full object-contain rotate-[-15deg] group-hover:rotate-0 group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-700 ease-out z-10 drop-shadow-2xl" 
                alt={p.name} 
              />
            </div>

            <div className="p-8 relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">{p.name}</h3>
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{p.category}</p>
                </div>
                <span className="text-blue-400 font-black text-2xl tracking-tighter group-hover:scale-110 transition-transform">${p.price}</span>
              </div>
              
              <div className="flex gap-3 mt-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <button 
                  onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}
                  className="flex-1 py-4 bg-white text-black font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest text-xs shadow-xl active:scale-95"
                >
                  Quick Add
                </button>
                <button 
                  className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-blue-600/20 border border-transparent transition-all"
                >
                  <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
