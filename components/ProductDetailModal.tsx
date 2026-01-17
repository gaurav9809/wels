
import React from 'react';
import { Product } from '../services/StoreService';

interface Props {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

const ProductDetailModal: React.FC<Props> = ({ product, onClose, onAddToCart }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-5xl rounded-[2rem] overflow-hidden grid md:grid-cols-2 relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
          <i className="fas fa-times"></i>
        </button>

        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-12 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto object-contain drop-shadow-2xl rotate-[-10deg] hover:rotate-0 transition-transform duration-700"
          />
        </div>

        <div className="p-8 md:p-16 flex flex-col justify-center">
          <span className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-4">{product.category}</span>
          <h2 className="text-4xl md:text-5xl font-black heading-font mb-6">{product.name}</h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {product.description || "Experience next-level comfort and performance with our signature WELS technology. Built for those who demand excellence in every step."}
          </p>

          <div className="flex items-center gap-4 mb-10">
            <span className="text-3xl font-black">${product.price}</span>
            <span className="text-gray-600 line-through text-xl">${Math.round(product.price * 1.2)}</span>
            <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-bold">IN STOCK</span>
          </div>

          <div className="mb-10">
            <p className="text-sm font-bold mb-4 uppercase text-gray-500 tracking-wider">Select Size (US)</p>
            <div className="flex flex-wrap gap-3">
              {[7, 8, 9, 10, 11, 12].map(size => (
                <button key={size} className="w-12 h-12 border border-white/10 rounded-xl flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all font-bold">
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-white text-black py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"
            >
              ADD TO CART
            </button>
            <button className="w-16 h-16 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-all">
              <i className="far fa-heart text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
