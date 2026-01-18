
import React, { useState, useEffect } from 'react';
import { StoreService, Product, Order, SiteSettings } from '../services/StoreService';

const AdminDashboard: React.FC<{onClose: () => void}> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'layout' | 'orders'>('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(StoreService.getSettings());
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setProducts(StoreService.getProducts());
    setOrders(StoreService.getOrders());
    setSettings(StoreService.getSettings());
  };

  const handleCommit = async () => {
    if (!editing?.name) return alert("Please enter a product name.");
    setIsSyncing(true);
    
    // Simulate network delay for "Server Save"
    setTimeout(() => {
      const payload: Product = {
        id: editing.id || Date.now().toString(),
        name: editing.name!,
        price: Number(editing.price) || 0,
        compareAtPrice: editing.compareAtPrice ? Number(editing.compareAtPrice) : undefined,
        category: editing.category || "Casual",
        type: editing.type as any || 'shoe',
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
      setIsSyncing(false);
      refreshData();
    }, 800);
  };

  const handleSaveSettings = () => {
    setIsSyncing(true);
    setTimeout(() => {
      StoreService.saveSettings(settings);
      setIsSyncing(false);
      alert('Global Brand Parameters Updated.');
      refreshData();
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative pb-32">
      {isSyncing && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="tech-font text-xs uppercase tracking-[0.5em] animate-pulse">Synchronizing_With_WELS_Cloud</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-8">
        <div>
          <h1 className="text-4xl font-black heading-font tracking-tighter uppercase text-white italic">
            WELS <span className="text-blue-500">Master_Control</span>
          </h1>
          <p className="text-[10px] tech-font text-gray-600 uppercase tracking-[0.5em] mt-2">Remote Site Architect Mode</p>
        </div>
        <div className="flex gap-4">
          {['inventory', 'layout', 'orders'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)} 
              className={`text-[10px] font-black px-8 py-4 rounded-2xl transition-all uppercase tracking-widest border ${activeTab === tab ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}
            >
              {tab}
            </button>
          ))}
          <button onClick={onClose} className="bg-red-500/20 text-red-500 border border-red-500/30 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Exit</button>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center glass-card p-10 rounded-[3rem] border-white/10">
            <div>
               <h2 className="text-2xl font-black uppercase text-white tracking-tighter italic">Collection Grid</h2>
               <p className="text-[10px] text-gray-500 uppercase mt-1">Manage global shoe and apparel inventory</p>
            </div>
            <div className="flex gap-4">
               <button onClick={() => setEditing({ type: 'shoe', name: '', price: 0, category: 'Running', images: [] })} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">New_Shoe</button>
               <button onClick={() => setEditing({ type: 'tshirt', name: '', price: 0, category: 'Oversized', images: [] })} className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">New_Apparel</button>
            </div>
          </div>
          
          <div className="glass-card rounded-[3.5rem] overflow-hidden border-white/10">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/5">
                <tr className="text-[10px] uppercase text-gray-500 font-black tracking-widest">
                  <th className="p-8">Entity</th>
                  <th className="p-8">Valuation</th>
                  <th className="p-8 text-right">Command</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-8 flex items-center gap-6">
                      <div className="w-20 h-20 bg-white/5 rounded-2xl p-2 border border-white/10 shrink-0 group-hover:scale-110 transition-transform">
                        <img src={p.image} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <span className="font-black block uppercase tracking-tight text-white text-lg">{p.name}</span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${p.type === 'shoe' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>{p.type}</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="text-blue-500 tech-font font-black text-xl italic">₹{p.price}</span>
                    </td>
                    <td className="p-8 text-right">
                      <button onClick={() => setEditing(p)} className="text-blue-400 text-[10px] font-black uppercase tracking-widest mr-8 hover:text-white transition-colors">Edit</button>
                      <button onClick={() => { if(confirm('WIPE_ENTITY_FROM_DATABASE?')) StoreService.deleteProduct(p.id); refreshData(); }} className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Wipe</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'layout' && (
        <div className="glass-card p-12 rounded-[3.5rem] border-white/10 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black uppercase text-blue-500 tracking-tighter mb-10 italic">Core UI Parameters</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Brand_Display_Name</label>
              <input value={settings.heroTitle} onChange={e => setSettings({...settings, heroTitle: e.target.value})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Main_Hero_Asset_URL</label>
              <input value={settings.heroImage} onChange={e => setSettings({...settings, heroImage: e.target.value})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-blue-500" />
            </div>
            <button onClick={handleSaveSettings} className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] hover:bg-blue-600 hover:text-white transition-all shadow-2xl mt-6">Authorize_Global_Sync</button>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[250] bg-black/98 flex items-center justify-center p-8 overflow-y-auto">
          <div className="glass-card w-full max-w-4xl p-12 rounded-[4rem] border-blue-500/20 text-white space-y-8 animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black uppercase italic"><span className="text-blue-500">Configure</span>_Object</h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black uppercase text-gray-500 block mb-3 tracking-widest">Target_Sector</label>
                   <div className="flex gap-4">
                      <button onClick={() => setEditing({...editing, type: 'shoe'})} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase border transition-all ${editing.type === 'shoe' ? 'bg-blue-600 border-blue-600' : 'bg-white/5 border-white/10 text-gray-600'}`}>Footwear</button>
                      <button onClick={() => setEditing({...editing, type: 'tshirt'})} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase border transition-all ${editing.type === 'tshirt' ? 'bg-purple-600 border-purple-600' : 'bg-white/5 border-white/10 text-gray-600'}`}>Apparel</button>
                   </div>
                </div>
                <div><label className="text-[10px] font-black uppercase text-gray-500 block mb-3 tracking-widest">Identifier</label><input value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-blue-500" placeholder="Product Name" /></div>
                <div><label className="text-[10px] font-black uppercase text-gray-500 block mb-3 tracking-widest">Retail_Valuation (₹)</label><input type="number" value={editing.price} onChange={e => setEditing({...editing, price: Number(e.target.value)})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-blue-500" /></div>
              </div>
              <div className="space-y-6">
                <div><label className="text-[10px] font-black uppercase text-gray-500 block mb-3 tracking-widest">Asset_Source_URL</label><input value={editing.images?.[0] || ''} onChange={e => setEditing({...editing, images: [e.target.value]})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-blue-500" placeholder="https://..." /></div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                   <p className="text-[10px] font-black uppercase text-gray-500 mb-6 tracking-widest">Status_Flags</p>
                   <div className="flex gap-8">
                      <label className="flex items-center gap-3 cursor-pointer group"><input type="checkbox" checked={editing.isFeatured} onChange={e => setEditing({...editing, isFeatured: e.target.checked})} className="w-6 h-6 rounded-lg bg-white/5 border-white/10 checked:bg-blue-500 transition-all" /> <span className="text-[10px] font-black uppercase group-hover:text-blue-500 transition-colors">Featured</span></label>
                      <label className="flex items-center gap-3 cursor-pointer group"><input type="checkbox" checked={editing.isHidden} onChange={e => setEditing({...editing, isHidden: e.target.checked})} className="w-6 h-6 rounded-lg bg-white/5 border-white/10 checked:bg-red-500 transition-all" /> <span className="text-[10px] font-black uppercase group-hover:text-red-500 transition-colors">Stealth_Mode</span></label>
                   </div>
                </div>
              </div>
            </div>
            <div className="flex gap-6 pt-10 border-t border-white/5">
               <button onClick={handleCommit} className="flex-1 bg-white text-black py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] hover:bg-blue-600 hover:text-white transition-all shadow-2xl">Execute_Commit</button>
               <button onClick={() => setEditing(null)} className="px-12 bg-white/5 text-white py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] border border-white/10 hover:bg-red-500 transition-all">Abort</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
