
import React from 'react';

interface Props {
  onCategoryClick: (category: string) => void;
}

const Footer: React.FC<Props> = ({ onCategoryClick }) => {
  return (
    <footer className="py-24 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-8 group cursor-default">
            <img 
              src="https://api.a0.dev/assets/image?text=WELS%20shoe%20brand%20logo%20modern%20minimalist&seed=123" 
              alt="WELS Logo" 
              className="h-14 object-contain filter brightness-0 invert transition-transform group-hover:scale-105" 
            />
            <div className="flex flex-col">
              <span className="text-4xl font-black heading-font tracking-tighter gradient-text uppercase leading-none">WELS</span>
              <span className="text-[9px] font-black tracking-[0.4em] text-gray-500 uppercase mt-1">Step into future</span>
            </div>
          </div>
          <p className="text-gray-500 max-w-sm mb-10 text-sm leading-relaxed">
            The next generation of athletic footwear. Built for the bold, designed for the dreamers. Experience pure WELS performance in every stride.
          </p>
          <div className="flex gap-4">
            {['instagram', 'facebook-f', 'twitter', 'whatsapp'].map(icon => (
              <a key={icon} href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all border border-white/5 hover:border-blue-500 shadow-xl">
                <i className={`fab fa-${icon}`}></i>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black mb-8 text-white uppercase tracking-[0.3em] border-l-2 border-blue-600 pl-4">Collection</h4>
          <ul className="space-y-4 text-gray-500">
            {['Running', 'Casual', 'Training', 'All'].map(cat => (
              <li key={cat}>
                <button onClick={() => onCategoryClick(cat)} className="hover:text-blue-500 transition-all text-[11px] font-black uppercase tracking-widest">{cat} Shoes</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black mb-8 text-white uppercase tracking-[0.3em] border-l-2 border-purple-600 pl-4">Customer Care</h4>
          <ul className="space-y-4 text-gray-500">
            {['Order Tracking', 'Sizing Guide', 'Returns Policy', 'Contact Support'].map(link => (
              <li key={link}>
                <a href="#" className="hover:text-purple-500 transition-all text-[11px] font-black uppercase tracking-widest">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-gray-600 text-[10px] font-black tracking-widest uppercase">
        <p>© 2024 WELS FOOTWEAR. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-10 mt-6 md:mt-0">
          <a href="#" className="hover:text-white transition-all">Privacy</a>
          <a href="#" className="hover:text-white transition-all">Terms</a>
          <a href="#" className="hover:text-white transition-all">Accessibility</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
