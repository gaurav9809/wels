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
    try {
      setProducts(StoreService.getProducts());
      setOrders(StoreService.getOrders());
      setSettings(StoreService.getSettings());
    } catch (err) {
      console.error("Dashboard refresh failed:", err);
    }
  };

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(base64Str);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => resolve(base64Str);
    });
  };

  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const readers = files.map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(async (newImages: string[]) => {
      const compressedImages = await Promise.all(newImages.map(img => compressImage(img)));
      if (editing) {
        const currentImages = editing.images || [];
        setEditing({ ...editing, images: [...currentImages, ...compressedImages] });
      }
    });
  };

  const removeImage = (index: number) => {
    if (!editing || !editing.images) return;
    const updated = [...editing.images];
    updated.splice(index, 1);
    setEditing({ ...editing, images: updated });
  };

  const handleCommit = async () => {
    if (!editing || !editing.name || editing.name.trim() === '') {
      alert("FIELD_ERROR: Shoe Name is required.");
      return;
    }
    try {
      const finalImages = editing.images || [];
      const primaryImage = finalImages.length > 0 ? finalImages[0] : (editing.image || "");
      if (!primaryImage) {
        alert("MEDIA_ERROR: At least one visual asset is required.");
        return;
      }
      const payload: Product = {
        id: editing.id || Date.now().toString(),
        name: editing.name.trim(),
        price: Number(editing.price) || 0,
        compareAtPrice: editing.compareAtPrice ? Number(editing.compareAtPrice) : undefined,
        category: editing.category || "Casual",
        description: editing.description || "Premium performance unit.",
        images: finalImages,
        image: primaryImage,
        isFeatured: Boolean(editing.isFeatured),
        isHidden: Boolean(editing.isHidden),
        variants: editing.variants || [],
        orderWeight: editing.orderWeight !== undefined ? editing.orderWeight : products.length
      };
      StoreService.saveProduct(payload);
      setEditing(null);
      refreshData();
      alert("SUCCESS: Database record committed.");
    } catch (err: any) {
      alert("FATAL_ERROR: Record commit rejected.");
    }
  };

  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const newProducts = [...products];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProducts.length) return;
    [newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]];
    const orderedIds = newProducts.map(p => p.id);
    StoreService.updateProductOrder(orderedIds);
    refreshData();
  };

  const handleSaveSettings = () => {
    StoreService.saveSettings(settings);
    alert('System settings synced successfully.');
    refreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black heading-font tracking-tighter uppercase text-white">Command <span className="text-blue-500">Center</span></h1>
          <p className="text-[10px] tech-font text-gray-600 uppercase tracking-widest mt-2">Manage your digital storefront universe</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {['inventory', 'layout', 'orders'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)} 
              className={`text-[9px] font-black px-5 py-3 rounded-xl transition-all uppercase tracking-widest border ${activeTab === tab ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'}`}
            >
              {tab}
            </button>
          ))}
          <button onClick={onClose} className="ml-4 bg-red-500/10 text-red-500 border border-red-500/20 px-5 py-3 rounded-xl font-black text-[9px] uppercase hover:bg-red-500 hover:text-white transition-all">Exit_Console</button>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-white/5 p-8 rounded-[2rem] border border-white/10">
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Product Alignment</h2>
            <button onClick={() => setEditing({ name: '', price: 0, image: '', images: [], category: 'Casual', variants: [], isFeatured: false, isHidden: false })} className="bg-white text-black px-8 py-4 rounded-xl font-black text-xs uppercase hover:bg-blue-600 hover:text-white transition-all">Add_New_Shoe</button>
          </div>
          <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/10">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/5">
                <tr className="text-[10px] uppercase text-gray-500 font-black tracking-widest">
                  <th className="p-8 text-white">Visual_Index</th>
                  <th className="p-8 text-white">Entity_Data</th>
                  <th className="p-8 text-right text-white">Sequence_Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => (
                  <tr key={p.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-8">
                      <div className="flex gap-2">
                        <button onClick={() => moveProduct(idx, 'up')} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white hover:bg-blue-600"><i className="fas fa-chevron-up text-[10px]"></i></button>
                        <button onClick={() => moveProduct(idx, 'down')} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white hover:bg-blue-600"><i className="fas fa-chevron-down text-[10px]"></i></button>
                      </div>
                    </td>
                    <td className="p-8 flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl p-2 border border-white/10"><img src={p.image} className="w-full h-full object-contain" /></div>
                      <div>
                        <span className="font-black block uppercase tracking-tight text-white">{p.name}</span>
                        <div className="flex gap-2">
                           <span className="text-[10px] text-blue-500 tech-font">₹{p.price}</span>
                           {p.compareAtPrice && <span className="text-[10px] text-gray-600 line-through tech-font">₹{p.compareAtPrice}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <button onClick={() => setEditing(p)} className="text-blue-500 mr-6 font-black text-[10px] uppercase tracking-widest">Edit</button>
                      <button onClick={() => { if(confirm('Erase this entity?')) { StoreService.deleteProduct(p.id); refreshData(); } }} className="text-red-500 font-black text-[10px] uppercase tracking-widest">Erase</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'layout' && (
        <div className="grid lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass-card p-10 rounded-[3rem] space-y-8 border-white/10 bg-white/[0.02]">
            <h2 className="text-xl font-black uppercase text-blue-500 flex items-center gap-3 tracking-tighter">
               <i className="fas fa-layer-group"></i> Component Visibility
            </h2>
            <div className="space-y-4">
              {[
                { key: 'showFeatures', label: 'Feature Highlights' },
                { key: 'showAbout', label: 'Brand Story / Mission' },
                { key: 'showGallery', label: 'Visual Lookbook' },
                { key: 'showReviews', label: 'User Testimonials' }
              ].map(item => (
                <div key={item.key} className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/5">
                  <span className="font-bold text-sm text-gray-300 uppercase tracking-widest text-[10px]">{item.label}</span>
                  <button 
                    onClick={() => setSettings({...settings, [item.key]: !settings[item.key as keyof SiteSettings] as any})}
                    className={`w-14 h-8 rounded-full relative transition-all ${settings[item.key as keyof SiteSettings] ? 'bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings[item.key as keyof SiteSettings] ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem] space-y-8 border-white/10 bg-white/[0.02]">
             <h2 className="text-xl font-black uppercase text-green-500 flex items-center gap-3 tracking-tighter">
                <i className="fas fa-palette"></i> Style & Theme
             </h2>
             <div className="p-8 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black uppercase text-gray-500 mb-6 tracking-widest">Accent Core Color</p>
                <div className="flex flex-wrap gap-4">
                   {['#3b82f6', '#a855f7', '#10b981', '#ef4444', '#f59e0b', '#ec4899'].map(color => (
                     <button 
                       key={color}
                       onClick={() => setSettings({...settings, accentColor: color})}
                       className={`w-12 h-12 rounded-2xl transition-all border-4 ${settings.accentColor === color ? 'border-white scale-110 shadow-2xl' : 'border-transparent opacity-50 hover:opacity-100'}`}
                       style={{ backgroundColor: color }}
                     ></button>
                   ))}
                </div>
             </div>
             
             <div className="p-8 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black uppercase text-gray-500 mb-6 tracking-widest">Inventory Grid Density</p>
                <div className="flex gap-4">
                  {[2, 3, 4].map(num => (
                    <button 
                      key={num}
                      onClick={() => setSettings({...settings, productsPerRow: num})}
                      className={`flex-1 py-4 rounded-xl border font-black tech-font text-xs transition-all ${settings.productsPerRow === num ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/10'}`}
                    >
                      {num} COL
                    </button>
                  ))}
                </div>
             </div>

             <button onClick={handleSaveSettings} className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:bg-white hover:text-black transition-all tech-font shadow-2xl">
               Execute_Layout_Save
             </button>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="glass-card p-10 rounded-[3rem] border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white/[0.02]">
          <h2 className="text-xl font-black uppercase mb-10 text-purple-500 tracking-tighter italic">Global Sales Pipeline</h2>
          {orders.length === 0 ? <div className="text-center py-20 text-gray-500 tech-font uppercase tracking-widest text-[10px]">No transaction history found</div> : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="p-8 bg-white/5 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-6 hover:border-blue-500/30 transition-all">
                  <div className="flex-1">
                    <p className="text-[10px] tech-font text-blue-500 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 inline-block mb-4 tracking-tighter">{order.id}</p>
                    <p className="font-black uppercase text-xl mb-2 text-white">{order.shippingInfo?.fullName || order.userName}</p>
                    <div className="p-4 bg-black/40 rounded-2xl text-[11px] text-gray-400 font-medium leading-relaxed">
                      <p className="text-blue-500 font-black uppercase text-[8px] mb-2">Delivery Target:</p>
                      {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.state} - {order.shippingInfo?.pinCode}
                    </div>
                  </div>
                  <div className="md:w-64 text-right flex flex-col justify-center">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">{order.paymentMethod || 'SECURE_PAY'}</p>
                    <p className="font-black text-3xl gradient-text mb-4">₹{order.total}</p>
                    <div className="text-[9px] font-black px-4 py-2 rounded-xl bg-orange-500/20 text-orange-400 uppercase tracking-widest border border-orange-500/20 inline-block ml-auto">
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center p-6 animate-in fade-in duration-300 overflow-y-auto">
          <div className="glass-card w-full max-w-4xl p-12 rounded-[4rem] space-y-8 border-blue-500/20 shadow-2xl text-white">
            <h2 className="text-4xl font-black uppercase heading-font tracking-tighter italic">Entity <span className="text-blue-500">Mod_Tool</span></h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest">Product Identity</label>
                  <input placeholder="Shoe Name" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-blue-500 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest">Selling Price (₹)</label>
                    <input type="number" value={editing.price} onChange={e => setEditing({...editing, price: Number(e.target.value)})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-blue-500 text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest">Original Price (₹)</label>
                    <input type="number" value={editing.compareAtPrice || ''} onChange={e => setEditing({...editing, compareAtPrice: e.target.value ? Number(e.target.value) : undefined})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-blue-500 text-white" placeholder="Original price" />
                  </div>
                </div>
                <div>
                   <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest">Category</label>
                   <select value={editing.category} onChange={e => setEditing({...editing, category: e.target.value})} className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-blue-500 text-white">
                      <option className="bg-black" value="Running">Running</option><option className="bg-black" value="Casual">Casual</option><option className="bg-black" value="Training">Training</option>
                   </select>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Media Gallery</label>
                    <label className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase cursor-pointer"><i className="fas fa-plus mr-2"></i> Add_Photos<input type="file" multiple onChange={handleMultipleFiles} className="hidden" accept="image/*" /></label>
                  </div>
                  <div className="grid grid-cols-3 gap-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {editing.images?.map((img, i) => (
                      <div key={i} className="relative aspect-square bg-black/40 rounded-xl overflow-hidden border border-white/5"><img src={img} className="w-full h-full object-contain p-1" /><button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded flex items-center justify-center text-[8px]"><i className="fas fa-times"></i></button></div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-3"><input type="checkbox" checked={editing.isFeatured} onChange={e => setEditing({...editing, isFeatured: e.target.checked})} className="w-5 h-5 accent-blue-600" id="feat" /><label htmlFor="feat" className="text-[10px] font-black uppercase tracking-widest text-blue-500">Featured</label></div>
                   <div className="flex items-center gap-3"><input type="checkbox" checked={editing.isHidden} onChange={e => setEditing({...editing, isHidden: e.target.checked})} className="w-5 h-5 accent-red-600" id="hide" /><label htmlFor="hide" className="text-[10px] font-black uppercase tracking-widest text-red-500">Hidden</label></div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-4 border-t border-white/5">
              <button onClick={handleCommit} className="flex-1 bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-xl">Commit_Entry</button>
              <button onClick={() => setEditing(null)} className="px-10 bg-white/5 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] border border-white/10 text-white">Abort</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;