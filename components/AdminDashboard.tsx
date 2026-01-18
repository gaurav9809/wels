
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

  const handleCommit = () => {
    if (!editing?.name) return alert("Please enter a product name.");
    
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
    refreshData();
  };

  const handleSaveSettings = () => {
    StoreService.saveSettings(settings);
    alert('Settings Saved Locally.');
    refreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative pb-32 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-8">
        <div>
          <h1 className="text-4xl font-black heading-font tracking-tighter uppercase text-white italic">
            WELS <span className="text-blue-500">Master_Control</span>
          </h1>
          <p className="text-[10px] tech-font text-gray-600 uppercase tracking-[0.5em] mt-2">Local Mode Architect</p>
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
        <div className="space-y-8">
          <div className="flex justify-between items-center glass-card p-10 rounded-[3rem] border-white/10">
            <div>
               <h2 className="text-2xl font-black uppercase text-white tracking-tighter italic">Collection Grid</h2>
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
                  <th className="p-8">Price</th>
                  <th className="p-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-8 flex items-center gap-6">
                      <div className="w-20 h-20 bg-white/5 rounded-2xl p-2 border border-white/10 shrink-0">
                        <img src={p.image} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <span className="font-black block uppercase text-white text-lg">{p.name}</span>
                        <span className="text-[8px] font-black text-gray-500 uppercase">{p.type}</span>
                      </div>
                    </td>
                    <td className="p-8"><span className="text-blue-500 font-black text-xl italic">₹{p.price}</span></td>
                    <td className="p-8 text-right">
                      <button onClick={() => setEditing(p)} className="text-blue-400 text-[10px] font-black uppercase tracking-widest mr-8">Edit</button>
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
        <div className="glass-card p-12 rounded-[3.5rem] border-white/10 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black uppercase text-blue-500 tracking-tighter mb-10 italic">Site Branding</h2>
          <div className="space-y-6">
            <input value={settings.heroTitle} onChange={e => setSettings({...settings, heroTitle: e.target.value})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-blue-500" placeholder="Hero Title" />
            <input value={settings.heroImage} onChange={e => setSettings({...settings, heroImage: e.target.value})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-blue-500" placeholder="Hero Image URL" />
            <button onClick={handleSaveSettings} className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] hover:bg-blue-600 hover:text-white transition-all">Save Changes</button>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[250] bg-black/95 flex items-center justify-center p-8">
          <div className="glass-card w-full max-w-2xl p-12 rounded-[4rem] border-white/10 text-white space-y-8">
            <h2 className="text-3xl font-black uppercase italic">Edit_Entity</h2>
            <div className="space-y-6">
              <input value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none" placeholder="Name" />
              <input type="number" value={editing.price} onChange={e => setEditing({...editing, price: Number(e.target.value)})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none" placeholder="Price" />
              <input value={editing.images?.[0] || ''} onChange={e => setEditing({...editing, images: [e.target.value]})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none" placeholder="Image URL" />
            </div>
            <div className="flex gap-6">
               <button onClick={handleCommit} className="flex-1 bg-white text-black py-6 rounded-3xl font-black uppercase text-[10px]">Save</button>
               <button onClick={() => setEditing(null)} className="px-12 bg-white/5 text-white py-6 rounded-3xl font-black uppercase text-[10px]">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
