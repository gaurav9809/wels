
import React from 'react';

const features = [
  { icon: 'fa-gem', title: 'Premium Quality', desc: 'Crafted from the finest materials for longevity.' },
  { icon: 'fa-truck-fast', title: 'Fast Delivery', desc: 'Global shipping within 3-5 business days.' },
  { icon: 'fa-rotate-left', title: 'Easy Returns', desc: '30-day no questions asked return policy.' },
  { icon: 'fa-tag', title: 'Best Price', desc: 'Unbeatable value for pro-level performance.' },
];

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div key={i} className="glass-card p-8 rounded-2xl group hover:border-blue-500/50 transition-all duration-300 reveal">
            <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all">
              <i className={`fas ${f.icon} text-2xl text-blue-500 group-hover:text-white`}></i>
            </div>
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
