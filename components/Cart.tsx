
import React from 'react';
import { Product } from '../services/StoreService';

interface CartProps {
  items: { product: Product; qty: number }[];
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQty, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <i className="fas fa-shopping-bag text-6xl text-white/10 mb-6"></i>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500">Go grab some WELS style!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-black mb-12 heading-font">SHOPPING <span className="text-blue-500">CART</span></h2>
      
      <div className="space-y-6 mb-12">
        {items.map(item => (
          <div key={item.product.id} className="glass-card p-6 rounded-2xl flex items-center gap-6">
            <img src={item.product.image} className="w-24 h-24 object-contain bg-white/5 rounded-xl" />
            <div className="flex-1">
              <h3 className="text-xl font-bold">{item.product.name}</h3>
              <p className="text-blue-400 font-bold">${item.product.price}</p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 rounded-full px-4 py-2">
              <button onClick={() => onUpdateQty(item.product.id, -1)}><i className="fas fa-minus text-xs"></i></button>
              <span className="font-bold w-4 text-center">{item.qty}</span>
              <button onClick={() => onUpdateQty(item.product.id, 1)}><i className="fas fa-plus text-xs"></i></button>
            </div>
            <p className="font-black text-xl w-24 text-right">${item.product.price * item.qty}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-8 rounded-3xl">
        <div className="flex justify-between text-2xl font-black mb-8">
          <span>TOTAL</span>
          <span className="gradient-text">${total}</span>
        </div>
        <button 
          onClick={onCheckout}
          className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-blue-600/20"
        >
          SECURE CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default Cart;
