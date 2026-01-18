import React, { useState, useEffect } from 'react';
import { StoreService, Product, Order, SiteSettings } from '../services/StoreService';

const AdminDashboard: React.FC<{onClose: () => void}> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'layout' | 'orders'>('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(StoreService.getSettings());
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setProducts(StoreService.getProducts());
    setOrders(StoreService.getOrders());
    setSettings(StoreService.getSettings());
  };

  const handleCommit = async () => {
    if (!editing?.name) return alert("NAME_REQUIRED");
    const payload: Product = {
      id: editing.id || Date.now().toString(),
      name: editing.name,
      price: Number(editing.price) || 0,
      compareAtPrice: editing.compareAtPrice ? Number(editing.compareAtPrice) : undefined,
      category: editing.category || "Casual",
      type: editing.type || 'shoe',
      description: editing.description || "",
      images: editing.images || [],
      image: editing.images?.[0] || "",
      isFeatured: !!editing.isFeatured,
      isHidden: !!editing.isHidden,
      variants: editing.variants || [],
      orderWeight: editing.orderWeight !== undefined ? editing.orderWeight : products.length
    };
    StoreService.saveProduct(payload);
    setEditing(null);
    refreshData();
  };

  const handleSaveSettings = () => {
    StoreService.saveSettings(settings);
    alert('Core parameters updated.');
    refreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black heading-font tracking-tighter uppercase text-white">System <span className="text-blue-500">Kernel</span></h1>
          <p className="text-[10px] tech-font text-gray-600 uppercase tracking-[0.5em] mt-2">v4.0.0 Global Administration</p>
        </div>
        <div className="flex gap-2">
          {['inventory', 'layout', 'orders'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`text-[9px] font-black px-6 py-4 rounded-2xl transition-all uppercase tracking-widest border ${activeTab === tab ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}>{tab}</button>
          ))}
          <button onClick={onClose} className="bg-red-500 text-white px-6 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-red-600">Disconnect</button>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center bg-white/5 p-10 rounded-[3rem] border border-white/10">
            <h2 className="text-xl font-black uppercase text-white tracking-tighter">Inventory Matrix</h2>
            <div className="flex gap-4">
               <button onClick={() => setEditing({ type: 'shoe', name: '', price: 0, category: 'Casual', images: [] })} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">Add_Shoe</button>
               <button onClick={() => setEditing({ type: 'tshirt', name: '', price: 0, category: 'Oversized', images: [] })} className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">Add_TShirt</button>
            </div>
          </div>
          <div className="glass-card rounded-[3.5rem] overflow-hidden border-white/10">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/5"><tr className="text-[9px] uppercase text-gray-500 font-black tracking-widest"><th className="p-8">Entity</th><th className="p-8">Parameters</th><th className="p-8 text-right">Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-8 flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl p-2 border border-white/10"><img src={p.image} className="w-full h-full object-contain" /></div>
                      <div>
                        <span className="font-black block uppercase tracking-tight text-white">{p.name}</span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${p.type === 'shoe' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>{p.type}</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <span className="text-blue-500 tech-font font-black">₹{p.price}</span>
                        {p.compareAtPrice && <span className="text-gray-600 line-through tech-font text-[10px]">₹{p.compareAtPrice}</span>}
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <button onClick={() => setEditing(p)} className="text-blue-400 text-[10px] font-black uppercase tracking-widest mr-6">Edit</button>
                      <button onClick={() => { if(confirm('Delete?')) StoreService.deleteProduct(p.id); refreshData(); }} className="text-red-500 text-[10px] font-black uppercase tracking-widest">Wipe</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'layout' && (
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="glass-card p-12 rounded-[3.5rem] border-white/10 space-y-8 bg-white/[0.01]">
            <h2 className="text-xl font-black uppercase text-blue-500 tracking-tighter italic">Visibility Protocol</h2>
            <div className="space-y-4">
              {[
                { key: 'showFeatures', label: 'Feature Matrix' },
                { key: 'showAbout', label: 'Brand Lore' },
                { key: 'showGallery', label: 'Visual Archive' },
                { key: 'showTshirts', label: 'T-Shirt Section' },
                { key: 'showReviews', label: 'User Transmission' }
              ].map(item => (
                <div key={item.key} className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{item.label}</span>
                  <button onClick={() => setSettings({...settings, [item.key]: !settings[item.key as keyof SiteSettings] as any})} className={`w-14 h-8 rounded-full relative transition-all ${settings[item.key as keyof SiteSettings] ? 'bg-blue-600' : 'bg-white/10'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings[item.key as keyof SiteSettings] ? 'left-7' : 'left-1'}`}></div></button>
                </div>
              ))}
            </div>
            <button onClick={handleSaveSettings} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase tracking-[0.5em] text-[10px] shadow-2xl">Execute_Update</button>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[250] bg-black/98 flex items-center justify-center p-6 overflow-y-auto">
          <div className="glass-card w-full max-w-4xl p-12 rounded-[4rem] border-blue-500/20 text-white space-y-8">
            <h2 className="text-3xl font-black uppercase italic"><span className="text-blue-500">Entity</span> Configuration</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                   <label className="text-[9px] font-black uppercase text-gray-500 block mb-2">Entity Type</label>
                   <div className="flex gap-2">
                      <button onClick={() => setEditing({...editing, type: 'shoe'})} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase border transition-all ${editing.type === 'shoe' ? 'bg-blue-600 border-blue-600' : 'bg-white/5 border-white/10'}`}>Shoe</button>
                      <button onClick={() => setEditing({...editing, type: 'tshirt'})} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase border transition-all ${editing.type === 'tshirt' ? 'bg-purple-600 border-purple-600' : 'bg-white/5 border-white/10'}`}>T-Shirt</button>
                   </div>
                </div>
                <div><label className="text-[9px] font-black uppercase text-gray-500 block mb-2">Label</label><input value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-blue-500" /></div>
                <div className="grid grid-cols-2 gap-4">
                   <div><label className="text-[9px] font-black uppercase text-gray-500 block mb-2">Retail ₹</label><input type="number" value={editing.price} onChange={e => setEditing({...editing, price: Number(e.target.value)})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10" /></div>
                   <div><label className="text-[9px] font-black uppercase text-gray-500 block mb-2">Market ₹</label><input type="number" value={editing.compareAtPrice || ''} onChange={e => setEditing({...editing, compareAtPrice: e.target.value ? Number(e.target.value) : undefined})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10" placeholder="Original" /></div>
                </div>
              </div>
              <div className="space-y-6">
                 <div>
                    <label className="text-[9px] font-black uppercase text-gray-500 block mb-2">Visual Source (URL)</label>
                    <input placeholder="Image URL" value={editing.images?.[0] || ''} onChange={e => setEditing({...editing, images: [e.target.value]})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10" />
                 </div>
                 <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                    <label className="text-[9px] font-black uppercase text-gray-500 block mb-4">Flags</label>
                    <div className="flex gap-6">
                       <label className="flex items-center gap-3"><input type="checkbox" checked={editing.isFeatured} onChange={e => setEditing({...editing, isFeatured: e.target.checked})} className="w-5 h-5 accent-blue-600" /> <span className="text-[9px] font-black uppercase">Elite</span></label>
                       <label className="flex items-center gap-3"><input type="checkbox" checked={editing.isHidden} onChange={e => setEditing({...editing, isHidden: e.target.checked})} className="w-5 h-5 accent-red-600" /> <span className="text-[9px] font-black uppercase">Stealth</span></label>
                    </div>
                 </div>
              </div>
            </div>
            <div className="flex gap-4 pt-8 border-t border-white/5">
               <button onClick={handleCommit} className="flex-1 bg-white text-black py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-all">Authorize_Commit</button>
               <button onClick={() => setEditing(null)} className="px-12 bg-white/5 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] border border-white/10">Abort</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;