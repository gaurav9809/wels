
import React, { useState, useEffect } from 'react';
import { Product, Variant } from '../services/StoreService';

interface Props {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBack: () => void;
}

const galleryImages = [
  'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=400',
];

const ProductPage: React.FC<Props> = ({ product, onAddToCart, onBack }) => {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants?.[0] || { color: 'Default', images: [product.image], sizes: [] }
  );
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [activeImg, setActiveImg] = useState(selectedVariant.images?.[0] || product.image);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    setActiveImg(selectedVariant.images?.[0] || product.image);
    setSelectedSize(null);
    window.scrollTo(0, 0);
  }, [selectedVariant]);

  const sizeMatrix = [
    { uk_india: 6, us: 7, cm: 24.5 },
    { uk_india: 7, us: 8, cm: 25.4 },
    { uk_india: 8, us: 9, cm: 26.2 },
    { uk_india: 9, us: 10, cm: 27.1 },
    { uk_india: 10, us: 11, cm: 27.9 },
    { uk_india: 11, us: 12, cm: 28.8 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-12 group transition-all">
        <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> 
        <span className="font-bold tracking-widest text-xs uppercase tech-font">Exit_Product_View</span>
      </button>

      <div className="grid lg:grid-cols-2 gap-16 mb-32">
        <div className="space-y-6">
          <div className="glass-card rounded-[3rem] p-12 flex items-center justify-center bg-gradient-to-br from-blue-600/10 to-purple-600/10 min-h-[500px] group overflow-hidden relative border-blue-500/20">
            <div className="absolute top-8 left-8 text-[10px] tech-font text-blue-500 opacity-50 uppercase tracking-[0.5em]">Vision_Scan_V1</div>
            <img 
              src={activeImg} 
              alt={product.name} 
              className="w-full h-auto object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-3"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {(selectedVariant.images || [product.image]).map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImg(img)}
                className={`w-24 h-24 rounded-2xl overflow-hidden glass-card flex-shrink-0 border-2 transition-all p-2 bg-white/5 ${activeImg === img ? 'border-blue-500 scale-105 shadow-lg shadow-blue-600/20' : 'border-transparent opacity-40 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-blue-500 font-black tracking-[0.2em] uppercase text-[10px] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">{product.category}</span>
              {selectedVariant.sizes.reduce((acc, s) => acc + s.stock, 0) === 0 && (
                <span className="bg-red-500/20 text-red-500 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-red-500/30">Stock_Depleted</span>
              )}
            </div>
            <h1 className="text-5xl md:text-7xl font-black heading-font mt-2 mb-6 tracking-tighter italic uppercase">{product.name}</h1>
            <div className="flex items-center gap-6">
              <span className="text-4xl font-black gradient-text">${product.price}</span>
              <div className="h-8 w-[1px] bg-white/10"></div>
              <div className="flex text-yellow-500 text-xs gap-1">
                {[1,2,3,4,5].map(s => <i key={s} className="fas fa-star"></i>)}
                <span className="ml-2 text-gray-500 font-bold tracking-widest tech-font">(4.9)</span>
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light border-l-2 border-blue-600/30 pl-6">
            {product.description}
          </p>

          <div className="space-y-10 mb-12">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 tech-font">Available_Color_Matrix</p>
              <div className="flex flex-wrap gap-4">
                {product.variants?.map((v, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedVariant(v)}
                    className={`px-8 py-3.5 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest ${selectedVariant.color === v.color ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/20'}`}
                  >
                    {v.color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest tech-font">Select_Size (INDIA/UK)</p>
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-all flex items-center gap-2 border-b border-blue-500/30 pb-1"
                >
                  <i className="fas fa-ruler-combined"></i> Ruler_Tool
                </button>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {sizeMatrix.map(m => {
                  const stockInfo = selectedVariant.sizes.find(sz => sz.size === m.us);
                  const isOutOfStock = !stockInfo || stockInfo.stock <= 0;
                  return (
                    <button 
                      key={m.uk_india} 
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSize(m.uk_india)}
                      className={`h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-black transition-all relative ${
                        selectedSize === m.uk_india 
                        ? 'border-blue-500 bg-blue-500 text-white shadow-xl shadow-blue-500/30' 
                        : isOutOfStock 
                          ? 'border-white/5 bg-black/40 text-gray-700 cursor-not-allowed'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-blue-500 hover:text-blue-500'
                      }`}
                    >
                      <span className="text-sm">{m.uk_india}</span>
                      <span className="text-[8px] opacity-50 tech-font">UK/IND</span>
                      {isOutOfStock && <div className="absolute inset-0 bg-red-500/5 rotate-45 pointer-events-none"></div>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              disabled={!selectedSize}
              onClick={() => { onAddToCart(product); alert(`Added ${product.name} (UK/INDIA Size ${selectedSize}) to cart!`); }}
              className={`flex-1 py-6 rounded-2xl font-black text-xs tracking-[0.4em] transition-all transform shadow-2xl tech-font ${
                selectedSize 
                ? 'bg-white text-black hover:bg-blue-600 hover:text-white hover:-translate-y-1' 
                : 'bg-white/5 text-gray-600 cursor-not-allowed'
              }`}
            >
              {selectedSize ? 'INITIALIZE_ORDER' : 'SELECT_DIMENSIONS'}
            </button>
            <button className="w-20 h-20 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-gray-500 hover:text-red-500 neon-border">
              <i className="far fa-heart text-2xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Integrated Vision Gallery Section */}
      <section className="mt-32 border-t border-white/5 pt-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div>
            <span className="text-blue-500 font-black tracking-[0.4em] uppercase text-[10px] tech-font">Visual_Archive</span>
            <h2 className="text-4xl font-black heading-font mt-2 uppercase italic tracking-tighter">Velocity_In_Motion</h2>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500/30 to-transparent mx-10 hidden lg:block"></div>
          <p className="text-gray-500 tech-font text-[10px] font-black uppercase tracking-widest">Protocol: Lookbook_Visuals</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryImages.map((img, i) => (
            <div key={i} className={`group relative overflow-hidden rounded-[2rem] border border-white/5 transition-all duration-700 hover:border-blue-500/30 ${i === 1 ? 'md:row-span-2' : ''} ${i === 4 ? 'md:col-span-2' : ''}`}>
              <div className="scanline opacity-0 group-hover:opacity-10"></div>
              <img 
                src={img} 
                alt="Gallery" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 aspect-square" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                <span className="text-blue-500 tech-font text-[8px] font-black mb-1 uppercase">Field_Test_Record</span>
                <span className="text-sm font-black tracking-widest uppercase heading-font italic">ZENITH_EDITION</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="glass-card w-full max-w-2xl p-10 rounded-[3rem] border-white/10 shadow-2xl relative overflow-hidden">
            <div className="scanline opacity-10"></div>
            <button 
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-8 right-8 text-gray-500 hover:text-white transition-all w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10"
            >
              <i className="fas fa-times"></i>
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-black heading-font tracking-tighter uppercase italic gradient-text">Dimension Matrix</h2>
              <p className="text-[10px] tech-font text-gray-500 uppercase tracking-[0.3em] mt-2">UK / INDIA / US Conversion Protocol</p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
              <table className="w-full text-center">
                <thead className="bg-white/5">
                  <tr>
                    <th className="py-5 text-[10px] tech-font font-black text-blue-500 uppercase tracking-widest border-b border-white/5">UK / INDIA</th>
                    <th className="py-5 text-[10px] tech-font font-black text-purple-500 uppercase tracking-widest border-b border-white/5">US (MEN)</th>
                    <th className="py-5 text-[10px] tech-font font-black text-gray-500 uppercase tracking-widest border-b border-white/5">LENGTH (CM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sizeMatrix.map((m, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors group">
                      <td className="py-5 font-black text-xl group-hover:text-blue-400 transition-colors">{m.uk_india}</td>
                      <td className="py-5 font-black text-xl group-hover:text-purple-400 transition-colors">{m.us}</td>
                      <td className="py-5 font-medium text-gray-400 tech-font">{m.cm} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start gap-4">
               <i className="fas fa-info-circle text-blue-500 mt-1"></i>
               <p className="text-xs text-gray-400 leading-relaxed italic">
                 WELS shoes are engineered with adaptive fit technology. If you are between sizes, we recommend selecting the larger size for the most dynamic movement experience.
               </p>
            </div>

            <button 
              onClick={() => setShowSizeGuide(false)}
              className="w-full mt-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all tech-font uppercase"
            >
              Acknowledged
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
