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

const Products: React.FC<Props> = ({ 
  type, 
  title, 
  onAddToCart, 
  onProductClick, 
  filter, 
  onFilterChange, 
  productsPerRow, 
  isAdmin, 
  onEditClick 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const shoeCats = ['All', 'Running', 'Casual', 'Training'];
  const tshirtCats = ['All', 'Oversized', 'Premium Cotton', 'Aesthetic'];
  const activeCats = type === 'shoe' ? shoeCats : tshirtCats;

  const loadProducts = () => {
    const stored = StoreService.getProducts();
    setProducts(stored);
  };

  useEffect(() => {
    loadProducts();
    window.addEventListener('store_updated', loadProducts);
    return () => window.removeEventListener('store_updated', loadProducts);
  }, []);

  const filteredProducts = products
    .filter(p => p.type === type)
    .filter(p => !p.isHidden || isAdmin)
    .filter(p => filter === 'All' || p.category === filter);

  const getGridCols = () => {
    if (productsPerRow === 2) return 'grid-cols-1 sm:grid-cols-2';
    if (productsPerRow === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <section id={type === 'shoe' ? 'products' : 'tshirts'} className="py-20 md:py-32 relative bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-12 md:mb-20 reveal">
        <div className="inline-block mb-4">
           <span className="text-blue-500 font-black tracking-[0.3em] md:tracking-[0.5em] uppercase text-[8px] md:text-[10px] bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
             {type === 'shoe' ? 'Footwear' : 'Apparel'} Division
           </span>
        </div>
        <h2 className="text-4xl md:text-7xl font-black heading-font uppercase mb-8 md:mb-12 italic tracking-tighter text-white">
          {title.split(' ')[0]} <span className="text-blue-500">{title.split(' ')[1] || ''}</span>
        </h2>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16">
          {activeCats.map(cat => (
            <button 
              key={cat} 
              onClick={() => onFilterChange(cat)}
              className={`px-6 py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all border ${
                filter === cat 
                ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid ${getGridCols()} gap-6 md:gap-10`}>
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group relative glass-card p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] border-white/5 hover:border-blue-500/30 transition-all duration-700 reveal"
              >
                <div className="scanline opacity-0 group-hover:opacity-10"></div>
                
                {/* Product Image Area */}
                <div 
                  onClick={() => onProductClick(product)}
                  className="relative aspect-square mb-8 cursor-pointer overflow-hidden rounded-[2rem] bg-white/[0.02] flex items-center justify-center p-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-700 transform ${
                      type === 'shoe' ? 'group-hover:rotate-[-12deg] group-hover:scale-110' : 'group-hover:scale-105'
                    }`}
                  />
                  {product.isFeatured && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-[7px] md:text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg z-20">
                      Elite_Unit
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="text-left space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[8px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg md:text-xl font-black tech-font text-white italic">
                        ₹{product.price}
                      </p>
                      {product.compareAtPrice && (
                        <p className="text-[10px] text-gray-700 line-through font-black">
                          ₹{product.compareAtPrice}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 flex gap-3">
                    <button 
                      onClick={() => onAddToCart(product)}
                      className="flex-1 bg-white text-black py-4 rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all transform active:scale-95"
                    >
                      Lock_Payload
                    </button>
                    <button 
                      onClick={() => onProductClick(product)}
                      className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-white"
                    >
                      <i className="fas fa-expand-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 glass-card rounded-[3rem] border-dashed border-white/10 flex flex-col items-center justify-center opacity-40">
            <i className="fas fa-box-open text-5xl mb-6"></i>
            <p className="tech-font text-xs uppercase tracking-[0.5em]">No_Inventory_Detected</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;