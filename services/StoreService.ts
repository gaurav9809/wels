
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

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "ZENITH X-CORE",
    price: 12999,
    compareAtPrice: 15999,
    image: "https://api.a0.dev/assets/image?text=futuristic%20blue%20neon%20sneaker%20side%20view&seed=1",
    images: ["https://api.a0.dev/assets/image?text=futuristic%20blue%20neon%20sneaker%20side%20view&seed=1"],
    category: "Running",
    type: "shoe",
    description: "Aerodynamic structural evolution for maximum velocity.",
    variants: [],
    isFeatured: true,
    orderWeight: 1
  },
  {
    id: "p2",
    name: "V-PRO STEALTH",
    price: 9499,
    image: "https://api.a0.dev/assets/image?text=minimalist%20black%20techwear%20shoe&seed=2",
    images: ["https://api.a0.dev/assets/image?text=minimalist%20black%20techwear%20shoe&seed=2"],
    category: "Casual",
    type: "shoe",
    description: "Stealth aesthetics with high-impact cushioning.",
    variants: [],
    orderWeight: 2
  },
  {
    id: "p3",
    name: "CYBER OVERSIZE TEE",
    price: 1999,
    image: "https://api.a0.dev/assets/image?text=oversized%20black%20tshirt%20cyberpunk%20graphic&seed=3",
    images: ["https://api.a0.dev/assets/image?text=oversized%20black%20tshirt%20cyberpunk%20graphic&seed=3"],
    category: "Oversized",
    type: "tshirt",
    description: "Heavyweight cotton with neon graphic print.",
    variants: [],
    orderWeight: 3
  }
];

const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "WELS ZENITH",
  heroSubtitle: "Structural Evolution of Footwear. Experience the next generation of performance.",
  heroImage: "https://api.a0.dev/assets/image?text=floating%20futuristic%20neon%20shoe%20blue%20glow&seed=99",
  accentColor: '#3b82f6',
  productsPerRow: 3,
  showTshirts: true,
  showFeatures: true,
  showAbout: true,
  showGallery: true,
  showReviews: true,
  aboutTitle: "OUR VISION",
  aboutText: "WELS is a technical response to urban mobility. We merge industrial design with street aesthetics.",
  aboutImage: "https://api.a0.dev/assets/image?text=modern%20industrial%20studio%20aesthetic&seed=44",
  features: [
    { title: "Aerodynamic", desc: "Wind-tested silhouette.", icon: "fa-wind", stat: "99%" },
    { title: "Smart-Grip", desc: "Adaptive traction matrix.", icon: "fa-bolt", stat: "Active" },
    { title: "Cloud-Core", desc: "Zero-gravity cushioning.", icon: "fa-cloud", stat: "Soft" },
    { title: "Eco-Fuse", desc: "Recycled materials.", icon: "fa-leaf", stat: "Green" }
  ],
  galleryImages: [
    "https://api.a0.dev/assets/image?text=techwear%20aesthetic%20neon&seed=10",
    "https://api.a0.dev/assets/image?text=futuristic%20shoe%20close%20up&seed=20",
    "https://api.a0.dev/assets/image?text=cyberpunk%20streetwear&seed=30",
    "https://api.a0.dev/assets/image?text=minimalist%20product%20photography&seed=40"
  ]
};

export const StoreService = {
  notifyChange: () => {
    window.dispatchEvent(new Event('store_updated'));
  },

  getProducts: (): Product[] => {
    const data = localStorage.getItem('wels_products');
    const products = data ? JSON.parse(data) : [];
    return products.length > 0 ? products : DEFAULT_PRODUCTS;
  },

  getOrders: (): Order[] => {
    const data = localStorage.getItem('wels_orders');
    return data ? JSON.parse(data) : [];
  },

  getSettings: (): SiteSettings => {
    const data = localStorage.getItem('wels_settings');
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },

  saveProduct: (product: Product) => {
    const products = StoreService.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) {
      products[index] = product;
    } else {
      products.push({ ...product, id: Date.now().toString() });
    }
    localStorage.setItem('wels_products', JSON.stringify(products));
    StoreService.notifyChange();
  },

  deleteProduct: (id: string) => {
    const products = StoreService.getProducts().filter(p => p.id !== id);
    localStorage.setItem('wels_products', JSON.stringify(products));
    StoreService.notifyChange();
  },

  saveSettings: (settings: SiteSettings) => {
    localStorage.setItem('wels_settings', JSON.stringify(settings));
    StoreService.notifyChange();
  }
};
