
import React from 'react';

const FloatingWhatsApp: React.FC = () => {
  return (
    <a 
      href="https://wa.me/1234567890" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[60] group"
    >
      <div className="absolute -inset-2 bg-green-500 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
      <div className="relative w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center text-3xl shadow-2xl transition-all group-hover:scale-110 group-active:scale-95">
        <i className="fab fa-whatsapp"></i>
        <span className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all translate-x-4 group-hover:translate-x-0">
          Chat with us!
        </span>
      </div>
    </a>
  );
};

export default FloatingWhatsApp;
