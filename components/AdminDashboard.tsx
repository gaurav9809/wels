
import React, { useState, useEffect } from 'react';
import { StoreService, Product, Order, Variant, SiteSettings } from '../services/StoreService';

const AdminDashboard: React.FC<{onClose: () => void}> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'settings' | 'orders'>('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(StoreService.getSettings());
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    setProducts(StoreService.getProducts());
    setOrders(StoreService.getOrders());
  }, []);

  const handleSaveProduct = () => {
    if (editing) {
      const finalVariants = (editing.variants || []).map(v => ({
        ...v,
        images: Array.isArray(v.images) 
          ? v.images 
          : (v.images as any).split(',').map((s: string) => s.trim()).filter(Boolean)
      }));
      StoreService.saveProduct({ ...editing, variants: finalVariants } as Product);
      setProducts(StoreService.getProducts());
      setEditing(null);
    }
  };

  const handleSaveSettings = () => {
    StoreService.saveSettings(settings);
    alert('Site design updated successfully!');
  };

  const toggleFeatured = (p: Product) => {
    const updated = { ...p, isFeatured: !p.isFeatured };
    StoreService.saveProduct(updated);
    setProducts(StoreService.getProducts());
  };

  const toggleHidden = (p: Product) => {
    const updated = { ...p, isHidden: !p.isHidden };
    StoreService.saveProduct(updated);
    setProducts(StoreService.getProducts());
  };

  const addVariant = () => {
    const newVariant: Variant = { 
      color: 'New Color', 
      images: [], 
      sizes: [7, 8, 9, 10, 11, 12].map(s => ({ size: s, stock: 10 })) 
    };
    setEditing({ ...editing, variants: [...(editing.variants || []), newVariant] });
  };

  const updateVariant = (vIndex: number, field: keyof Variant, value: any) => {
    const newVariants = [...(editing?.variants || [])];
    newVariants[vIndex] = { ...newVariants[vIndex], [field]: value };
    setEditing({ ...editing, variants: newVariants });
  };

  const updateStock = (vIndex: number, sizeNum: number, stock: number) => {
    const newVariants = [...(editing?.variants || [])];
    const newSizes = [...newVariants[vIndex].sizes];
    const sIdx = newSizes.findIndex(s => s.size === sizeNum);
    if (sIdx > -1) newSizes[sIdx].stock = stock;
    else newSizes.push({ size: sizeNum, stock });
    newVariants[vIndex].sizes = newSizes;
    setEditing({ ...editing, variants: newVariants });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black heading-font tracking-tighter uppercase">Admin <span className="text-blue-500">Panel</span></h1>
          <div className="flex gap-2 mt-4">
            {[
              { id: 'inventory', label: 'INVENTORY', icon: 'fa-boxes-stacked' },
              { id: 'settings', label: 'SITE DESIGN', icon: 'fa-palette' },
              { id: 'orders', label: 'ORDERS', icon: 'fa-receipt' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-[10px] font-black px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-gray-500 hover:text-white'}`}
              >
                <i className={`fas ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white flex items-center gap-2 group transition-all">
          <i className="fas fa-times group-hover:rotate-90 transition-transform"></i> Exit Dashboard
        </button>
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400">Manage Products</h2>
            <button onClick={() => setEditing({ name: '', price: 0, image: '', category: 'Casual', description: '', variants: [] })} className="bg-blue-600 px-6 py-3 rounded-xl text-xs font-black shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all">
              ADD NEW SHOE
            </button>
          </div>
          <div className="glass-card rounded-[2rem] overflow-hidden border-white/5">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Shoe</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Featured</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Stock</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Price</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map(p => {
                  const totalStock = p.variants?.reduce((acc, v) => acc + v.sizes.reduce((sAcc, s) => sAcc + s.stock, 0), 0) || 0;
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6 flex items-center gap-4">
                        <img src={p.image} className="w-12 h-12 rounded-xl object-contain bg-white/5 p-1 border border-white/10" />
                        <div>
                          <p className="font-bold text-sm">{p.name}</p>
                          <p className="text-[9px] text-blue-500 uppercase font-black">{p.category}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <button onClick={() => toggleFeatured(p)} className={`w-8 h-8 rounded-lg transition-all ${p.isFeatured ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-gray-600 hover:text-white'}`}>
                          <i className="fas fa-star text-[10px]"></i>
                        </button>
                      </td>
                      <td className="p-6">
                        <button onClick={() => toggleHidden(p)} className={`text-[9px] font-black px-3 py-1 rounded-full border transition-all ${!p.isHidden ? 'border-green-500/30 text-green-500 bg-green-500/5' : 'border-red-500/30 text-red-500 bg-red-500/5'}`}>
                          {p.isHidden ? 'HIDDEN' : 'LIVE'}
                        </button>
                      </td>
                      <td className="p-6">
                        <span className={`text-[10px] font-bold ${totalStock < 10 ? 'text-red-400' : 'text-gray-400'}`}>
                          {totalStock} units
                        </span>
                      </td>
                      <td className="p-6 font-bold text-sm">${p.price}</td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <button onClick={() => setEditing(p)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-blue-600 transition-all text-[10px]"><i className="fas fa-edit"></i></button>
                          <button onClick={() => { if(confirm('Delete this product?')) { StoreService.deleteProduct(p.id); setProducts(StoreService.getProducts()); } }} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-600 transition-all text-[10px]"><i className="fas fa-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400">Home Screen Customization</h2>
          <div className="glass-card p-10 rounded-[2.5rem] space-y-8 border-white/5">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest">Hero Section</h3>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Headline</label>
                <input value={settings.heroTitle} onChange={e => setSettings({...settings, heroTitle: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 font-bold text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Sub-headline</label>
                <textarea value={settings.heroSubtitle} onChange={e => setSettings({...settings, heroSubtitle: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 min-h-[100px] text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Star Shoe Image URL</label>
                <input value={settings.heroImage} onChange={e => setSettings({...settings, heroImage: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-xs" />
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
              <h3 className="text-xs font-black text-purple-500 uppercase tracking-widest">Store Layout</h3>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">Grid Columns (on Desktop)</label>
                <div className="flex gap-3">
                  {[2, 3, 4].map(num => (
                    <button 
                      key={num}
                      onClick={() => setSettings({...settings, productsPerRow: num})}
                      className={`flex-1 py-4 rounded-xl font-black text-xs transition-all border ${settings.productsPerRow === num ? 'bg-purple-600 border-purple-600 shadow-lg shadow-purple-600/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    >
                      {num} COLS
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleSaveSettings} className="w-full bg-white text-black py-5 rounded-2xl font-black text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95">
              SAVE SITE DESIGN
            </button>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
           <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400">Sales History</h2>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {orders.length === 0 ? (
               <div className="col-span-full p-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                 <i className="fas fa-receipt text-4xl mb-4 opacity-10"></i>
                 <p className="text-gray-500 italic uppercase text-[10px] font-black tracking-widest">No orders recorded yet</p>
               </div>
             ) : orders.map(o => (
               <div key={o.id} className="glass-card p-8 rounded-[2rem] border-l-4 border-green-500 hover:translate-y-[-4px] transition-all">
                 <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{o.id}</span>
                    <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-bold uppercase border border-green-500/20">{o.status}</span>
                 </div>
                 <p className="text-3xl font-black mb-1">${o.total}</p>
                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{o.date}</p>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Deep Product Editor Modal */}
      {editing && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-4xl p-10 rounded-[3rem] my-auto border-white/20 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-3xl font-black heading-font tracking-tighter uppercase">{editing.id ? 'Modify Product' : 'Add New Style'}</h3>
                <p className="text-[9px] font-black text-blue-500 tracking-[0.2em] uppercase mt-1">Product Details & Variants</p>
              </div>
              <button onClick={() => setEditing(null)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-gray-500"><i className="fas fa-times"></i></button>
            </div>
            
            <div className="space-y-8 overflow-y-auto pr-4 custom-scrollbar mb-8">
               <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Model Name</label>
                   <input value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 font-bold text-sm" placeholder="e.g. WELS Phantom v2" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Base Price ($)</label>
                   <input type="number" value={editing.price} onChange={e => setEditing({...editing, price: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 font-bold text-sm" />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Primary Display Image URL</label>
                 <input value={editing.image} onChange={e => setEditing({...editing, image: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-xs" placeholder="https://..." />
               </div>

               <div className="space-y-2">
                 <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Story / Description</label>
                 <textarea value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 min-h-[80px] text-sm" placeholder="Tell the story of this design..." />
               </div>

               <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                 <button onClick={() => setEditing({...editing, isFeatured: !editing.isFeatured})} className={`flex-1 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all ${editing.isFeatured ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-500'}`}>
                    {editing.isFeatured ? '★ FEATURED' : 'MARK AS FEATURED'}
                 </button>
                 <button onClick={() => setEditing({...editing, isHidden: !editing.isHidden})} className={`flex-1 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all ${editing.isHidden ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-500'}`}>
                    {editing.isHidden ? '👁 HIDDEN' : 'SHOW ON STORE'}
                 </button>
               </div>

               <div className="space-y-6 pt-6 border-t border-white/10">
                 <div className="flex justify-between items-center">
                    <h4 className="text-lg font-black uppercase tracking-tighter">Color Variants & Stock</h4>
                    <button onClick={addVariant} className="text-[9px] font-black bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg uppercase tracking-widest transition-all">Add Colorway</button>
                 </div>
                 
                 {editing.variants?.map((v, vIdx) => (
                   <div key={vIdx} className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6 relative group/var">
                     <button onClick={() => {
                       const newV = [...(editing.variants || [])];
                       newV.splice(vIdx, 1);
                       setEditing({...editing, variants: newV});
                     }} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover/var:opacity-100 transition-opacity"><i className="fas fa-trash-alt"></i></button>
                     
                     <div className="grid md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Color Name</label>
                         <input value={v.color} onChange={e => updateVariant(vIdx, 'color', e.target.value)} className="w-full bg-black/40 border border-white/5 p-3 rounded-xl text-xs font-bold" placeholder="e.g. Midnight Blue" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Gallery URLs (Comma separated)</label>
                         <input value={Array.isArray(v.images) ? v.images.join(', ') : v.images as any} onChange={e => updateVariant(vIdx, 'images', e.target.value)} className="w-full bg-black/40 border border-white/5 p-3 rounded-xl text-[10px]" placeholder="url1, url2..." />
                       </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Size Availability (Stock)</label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                          {[7, 8, 9, 10, 11, 12].map(size => {
                            const sizeObj = v.sizes.find(s => s.size === size) || { size, stock: 0 };
                            return (
                              <div key={size} className="bg-black/40 p-2 rounded-xl border border-white/5 flex flex-col items-center">
                                <span className="text-[9px] font-bold text-gray-500">US {size}</span>
                                <input type="number" value={sizeObj.stock} onChange={e => updateStock(vIdx, size, Number(e.target.value))} className="w-full bg-transparent text-center font-black text-blue-400 outline-none text-sm" />
                              </div>
                            );
                          })}
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={handleSaveProduct} className="flex-1 bg-white text-black py-5 rounded-2xl font-black text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-blue-600/10">SAVE CHANGES</button>
              <button onClick={() => setEditing(null)} className="px-10 bg-white/5 py-5 rounded-2xl font-black text-xs tracking-widest hover:bg-white/10 transition-all uppercase">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
