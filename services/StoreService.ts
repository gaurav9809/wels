
export interface Variant {
  color: string;
  sizes: { size: string | number; stock: number }[];
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string; 
  images: string[]; 
  category: string;
  type: 'shoe' | 'tshirt';
  description: string;
  variants: Variant[];
  isFeatured?: boolean;
  isHidden?: boolean;
  orderWeight: number;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface Order {
  id: string;
  items: { product: Product; qty: number }[];
  shipping: ShippingInfo;
  paymentMethod: string;
  total: number;
  date: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  accentColor: string;
  productsPerRow: number;
  showTshirts: boolean;
  showFeatures: boolean;
  showAbout: boolean;
  showGallery: boolean;
  showReviews: boolean;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  features: any[];
  galleryImages: string[];
}

// Your current keys
const JSONBIN_API_KEY = "$2a$10$jmG7xPMPb1lDiSyvegedZub4NhML/ljucLQgoxSthRz98jYHAr2te";
const JSONBIN_BIN_ID = "696d2ba843b1c97be9393952";

// FALLBACK DATA: Site hamesha dikhegi chahe cloud empty ho
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "ZENITH X-1",
    price: 12999,
    compareAtPrice: 15999,
    image: "https://api.a0.dev/assets/image?text=futuristic%20blue%20neon%20running%20shoe%20isolated&seed=1",
    images: ["https://api.a0.dev/assets/image?text=futuristic%20blue%20neon%20running%20shoe%20isolated&seed=1"],
    category: "Running",
    type: "shoe",
    description: "The ultimate futurist performance shoe.",
    variants: [],
    isFeatured: true,
    orderWeight: 1
  },
  {
    id: "2",
    name: "CYBER OVERSIZE",
    price: 2499,
    image: "https://api.a0.dev/assets/image?text=black%20oversized%20tshirt%20cyberpunk%20graphic&seed=2",
    images: ["https://api.a0.dev/assets/image?text=black%20oversized%20tshirt%20cyberpunk%20graphic&seed=2"],
    category: "Oversized",
    type: "tshirt",
    description: "Premium aesthetic comfort.",
    variants: [],
    orderWeight: 2
  }
];

const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "WELS ZENITH",
  heroSubtitle: "High-performance structural evolution for the modern nomad. Designed to move faster.",
  heroImage: "https://api.a0.dev/assets/image?text=floating%20ultra%20futuristic%20sneaker%20neon%20blue%20glow&seed=99",
  accentColor: '#3b82f6',
  productsPerRow: 3,
  showTshirts: true,
  showFeatures: true,
  showAbout: true,
  showGallery: true,
  showReviews: true,
  aboutTitle: "STRUCTURAL EVOLUTION",
  aboutText: "WELS isn't just a brand; it's a technical response to urban mobility. We merge aerospace materials with street aesthetics.",
  aboutImage: "https://api.a0.dev/assets/image?text=modern%20industrial%20design%20studio%20aesthetic&seed=44",
  features: [
    { title: "Aerodynamic", desc: "Wind-tested silhouette for maximum speed.", icon: "fa-wind", stat: "99%" },
    { title: "Smart-Grip", desc: "Adaptive traction matrix for urban terrain.", icon: "fa-bolt", stat: "Active" },
    { title: "Cloud-Core", desc: "Proprietary zero-gravity cushioning.", icon: "fa-cloud", stat: "Soft" },
    { title: "Eco-Fuse", desc: "Constructed from 100% ocean plastic.", icon: "fa-leaf", stat: "Green" }
  ],
  galleryImages: [
    "https://api.a0.dev/assets/image?text=futuristic%20sneaker%20neon&seed=11",
    "https://api.a0.dev/assets/image?text=model%20wearing%20techwear&seed=22",
    "https://api.a0.dev/assets/image?text=cyberpunk%20fashion%20details&seed=33",
    "https://api.a0.dev/assets/image?text=minimalist%20shoe%20design&seed=44"
  ]
};

export const StoreService = {
  notifyChange: () => {
    window.dispatchEvent(new Event('store_updated'));
  },

  fetchAllData: async () => {
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
        headers: { 
          'X-Master-Key': JSONBIN_API_KEY,
          'X-Bin-Meta': 'false' 
        }
      });
      
      if (!response.ok) return null;
      const data = await response.json();
      
      // Agar cloud par products hain tabhi save karein, warna defaults chalne dein
      if (data.products && data.products.length > 0) localStorage.setItem('wels_global_products', JSON.stringify(data.products));
      if (data.settings) localStorage.setItem('wels_global_settings', JSON.stringify(data.settings));
      
      StoreService.notifyChange();
      return data;
    } catch (error) {
      console.warn("Cloud offline, using local data.");
      return null;
    }
  },

  syncToCloud: async () => {
    const products = StoreService.getProducts();
    const settings = StoreService.getSettings();
    const orders = StoreService.getOrders();
    
    try {
      await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY
        },
        body: JSON.stringify({ products, settings, orders })
      });
      StoreService.notifyChange();
    } catch (error) {
      console.error("Cloud Sync Error:", error);
    }
  },

  getProducts: (): Product[] => {
    const data = localStorage.getItem('wels_global_products');
    const parsed = data ? JSON.parse(data) : [];
    return parsed.length > 0 ? parsed : DEFAULT_PRODUCTS;
  },

  getOrders: (): Order[] => {
    const data = localStorage.getItem('wels_global_orders');
    return data ? JSON.parse(data) : [];
  },

  saveProduct: async (product: Product) => {
    const products = StoreService.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) products[index] = product;
    else products.push({ ...product, id: Date.now().toString() });
    
    localStorage.setItem('wels_global_products', JSON.stringify(products));
    await StoreService.syncToCloud();
  },

  deleteProduct: async (id: string) => {
    const products = StoreService.getProducts().filter(p => p.id !== id);
    localStorage.setItem('wels_global_products', JSON.stringify(products));
    await StoreService.syncToCloud();
  },

  getSettings: (): SiteSettings => {
    const data = localStorage.getItem('wels_global_settings');
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },

  saveSettings: async (settings: SiteSettings) => {
    localStorage.setItem('wels_global_settings', JSON.stringify(settings));
    await StoreService.syncToCloud();
  }
};
