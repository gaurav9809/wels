import React, { useState } from 'react';
import { Product, ShippingInfo } from '../services/StoreService';

interface CartProps {
  items: { product: Product; qty: number }[];
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: (shipping: ShippingInfo, paymentMethod: string) => void;
  user: any;
  onAuthRequired: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQty, onCheckout, user, onAuthRequired }) => {
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment'>('cart');
  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onAuthRequired();
      return;
    }
    setStep('payment');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <i className="fas fa-shopping-bag text-6xl text-white/10 mb-6"></i>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 font-medium">Step into style, add some WELS units!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <div className={`h-1 flex-1 rounded-full ${step === 'cart' ? 'bg-blue-600' : 'bg-white/10'}`}></div>
        <div className={`h-1 flex-1 rounded-full ${step === 'shipping' ? 'bg-blue-600' : 'bg-white/10'}`}></div>
        <div className={`h-1 flex-1 rounded-full ${step === 'payment' ? 'bg-blue-600' : 'bg-white/10'}`}></div>
      </div>

      {step === 'cart' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-4xl font-black mb-12 heading-font uppercase">Current <span className="text-blue-500">Payload</span></h2>
          <div className="space-y-6 mb-12">
            {items.map(item => (
              <div key={item.product.id} className="glass-card p-6 rounded-3xl flex items-center gap-6 group">
                <div className="w-24 h-24 bg-white/5 rounded-2xl p-2 border border-white/5 group-hover:border-blue-500/30 transition-all overflow-hidden">
                  <img src={item.product.image} className="w-full h-full object-contain drop-shadow-lg scale-125 group-hover:rotate-6 transition-transform" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black uppercase tracking-tight">{item.product.name}</h3>
                  <p className="text-blue-500 tech-font text-xs font-black">₹{item.product.price}</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-5 py-3 border border-white/5">
                  <button onClick={() => onUpdateQty(item.product.id, -1)} className="hover:text-blue-500 transition-colors"><i className="fas fa-minus text-[10px]"></i></button>
                  <span className="font-black w-4 text-center text-sm">{item.qty}</span>
                  <button onClick={() => onUpdateQty(item.product.id, 1)} className="hover:text-blue-500 transition-colors"><i className="fas fa-plus text-[10px]"></i></button>
                </div>
                <p className="font-black text-lg w-24 text-right">₹{item.product.price * item.qty}</p>
              </div>
            ))}
          </div>
          <div className="glass-card p-10 rounded-[3rem] border-white/10">
            <div className="flex justify-between items-center text-3xl font-black mb-8 italic">
              <span className="uppercase">Grand Total</span>
              <span className="gradient-text">₹{total}</span>
            </div>
            <button 
              onClick={() => setStep('shipping')}
              className="w-full py-6 bg-white text-black font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl tech-font uppercase tracking-widest text-xs"
            >
              Initialize Delivery_Module
            </button>
          </div>
        </div>
      )}

      {step === 'shipping' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button onClick={() => setStep('cart')} className="mb-8 text-[10px] font-black uppercase text-gray-500 hover:text-white flex items-center gap-2 transition-all">
            <i className="fas fa-arrow-left"></i> Return_to_Payload
          </button>
          <h2 className="text-4xl font-black mb-12 heading-font uppercase">Logistics <span className="text-blue-500">Entry</span></h2>
          <form onSubmit={handleShippingSubmit} className="glass-card p-10 rounded-[3rem] border-white/10 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Recipient_Name</label>
                <input required value={shipping.fullName} onChange={e => setShipping({...shipping, fullName: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-blue-500 outline-none transition-all" placeholder="Enter Full Name" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Primary_Contact</label>
                <input required type="tel" pattern="[0-9]{10}" value={shipping.phone} onChange={e => setShipping({...shipping, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-blue-500 outline-none transition-all" placeholder="10-digit Phone" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Dispatch_Address</label>
              <textarea required value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-blue-500 outline-none transition-all h-32" placeholder="Street, Apartment, Landmark"></textarea>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">District</label>
                <input required value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-blue-500 outline-none transition-all" placeholder="City" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Province</label>
                <input required value={shipping.state} onChange={e => setShipping({...shipping, state: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-blue-500 outline-none transition-all" placeholder="State" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Zip_Protocol</label>
                <input required pattern="[0-9]{6}" value={shipping.pinCode} onChange={e => setShipping({...shipping, pinCode: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-blue-500 outline-none transition-all" placeholder="PIN Code" />
              </div>
            </div>
            <button className="w-full py-6 bg-white text-black font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all tech-font uppercase tracking-widest text-xs">
              Confirm_Delivery_Data
            </button>
          </form>
        </div>
      )}

      {step === 'payment' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button onClick={() => setStep('shipping')} className="mb-8 text-[10px] font-black uppercase text-gray-500 hover:text-white flex items-center gap-2 transition-all">
            <i className="fas fa-arrow-left"></i> Update_Address
          </button>
          <h2 className="text-4xl font-black mb-12 heading-font uppercase">Transaction <span className="text-blue-500">Layer</span></h2>
          <div className="glass-card p-10 rounded-[3rem] border-white/10 space-y-10">
            <div className="grid gap-4">
              {[
                { id: 'UPI', label: 'UPI / Google Pay / PhonePe', icon: 'fa-qrcode' },
                { id: 'CARD', label: 'Credit / Debit Card', icon: 'fa-credit-card' },
                { id: 'COD', label: 'Cash on Delivery', icon: 'fa-truck-ramp-box' }
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`w-full p-8 rounded-3xl border-2 flex items-center gap-6 transition-all ${paymentMethod === opt.id ? 'border-blue-600 bg-blue-600/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${paymentMethod === opt.id ? 'bg-blue-600' : 'bg-white/10'}`}>
                    <i className={`fas ${opt.icon}`}></i>
                  </div>
                  <span className="font-black uppercase tracking-widest text-sm">{opt.label}</span>
                  {paymentMethod === opt.id && <i className="fas fa-check-circle ml-auto text-blue-500 text-xl"></i>}
                </button>
              ))}
            </div>

            <div className="p-8 bg-blue-600/5 rounded-3xl border border-blue-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Subtotal</span>
                <span className="font-black">₹{total}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Delivery_Fee</span>
                <span className="text-green-500 font-black uppercase text-[10px]">FREE_ACCESS</span>
              </div>
              <div className="h-[1px] bg-white/10 mb-6"></div>
              <div className="flex justify-between items-center italic">
                <span className="text-xl font-black uppercase">Final Valuation</span>
                <span className="text-3xl font-black text-blue-500">₹{total}</span>
              </div>
            </div>

            <button 
              onClick={() => onCheckout(shipping, paymentMethod)}
              className="w-full py-7 bg-white text-black font-black rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-2xl tech-font uppercase tracking-widest text-xs"
            >
              Finalize_Purchase_Intent
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;