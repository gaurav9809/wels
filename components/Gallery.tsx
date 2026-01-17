
import React from 'react';

const images = [
  'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=400',
];

const Gallery: React.FC = () => {
  return (
    <section className="py-24 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-end gap-6 reveal">
        <div>
          <h2 className="text-4xl font-black heading-font">THE GALLERY</h2>
          <p className="text-gray-400">Capturing movement in every frame.</p>
        </div>
        <button className="text-blue-500 font-bold border-b border-blue-500 hover:text-blue-400 transition-all">VIEW ALL FOOTAGE</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto px-6">
        {images.map((img, i) => (
          <div key={i} className={`group relative overflow-hidden rounded-2xl reveal ${i === 1 ? 'md:row-span-2' : ''} ${i === 4 ? 'md:col-span-2' : ''}`}>
            <img 
              src={img} 
              alt="Gallery" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 aspect-square" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <span className="text-sm font-bold tracking-widest uppercase">Velocity Lifestyle</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
