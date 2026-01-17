
import React from 'react';

interface Props {
  onCategoryClick: (category: string) => void;
}

const Footer: React.FC<Props> = ({ onCategoryClick }) => {
  return (
    <footer className="py-20 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <a href="#" className="text-3xl font-black heading-font flex items-center gap-3 mb-6 group">
            <img 
              src="https://raw.githubusercontent.com/vibe-stream/cdn/main/WELS-logo.png" 
              alt="WELS Logo" 
              className="h-10 object-contain filter brightness-0 invert" 
            />
            <span className="gradient-text tracking-widest">WELS</span>
          </a>
          <p className="text-gray-500 max-w-sm mb-8">
            The next generation of athletic footwear. Built for the bold, designed for the dreamers. Join the movement today.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-white uppercase tracking-widest">Shop</h4>
          <ul className="space-y-4 text-gray-500">
            <li><button onClick={() => onCategoryClick('Running')} className="hover:text-white transition-all text-xs font-bold uppercase">Running Shoes</button></li>
            <li><button onClick={() => onCategoryClick('Casual')} className="hover:text-white transition-all text-xs font-bold uppercase">Casual Style</button></li>
            <li><button onClick={() => onCategoryClick('Training')} className="hover:text-white transition-all text-xs font-bold uppercase">Training Pro</button></li>
            <li><button onClick={() => onCategoryClick('All')} className="hover:text-white transition-all text-xs font-bold uppercase">All Collections</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-white uppercase tracking-widest">Support</h4>
          <ul className="space-y-4 text-gray-500">
            <li><a href="#" className="hover:text-white transition-all text-xs font-bold uppercase">Order Tracking</a></li>
            <li><a href="#" className="hover:text-white transition-all text-xs font-bold uppercase">Sizing Guide</a></li>
            <li><a href="#" className="hover:text-white transition-all text-xs font-bold uppercase">Returns Policy</a></li>
            <li><a href="#" className="hover:text-white transition-all text-xs font-bold uppercase">Contact Us</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-gray-600 text-[10px] font-black tracking-widest">
        <p>@ 2024 WELS SHOES. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8 mt-4 md:mt-0 uppercase">
          <a href="#" className="hover:text-white transition-all">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-all">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
