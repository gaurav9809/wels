export interface Variant {
  color: string;
  sizes: { size: number; stock: number }[];
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
  description: string;
  variants: Variant[];
  isFeatured?: boolean;
  isHidden?: boolean;
  orderWeight: number;
}

export interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
  stat: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  features: FeatureItem[];
  productsPerRow: number;
  galleryImages: string[];
  accentColor: string;
  showFeatures: boolean;
  showAbout: boolean;
  showGallery: boolean;
  showReviews: boolean;
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
  userId: string;
  userName?: string;
  shippingInfo?: ShippingInfo;
  paymentMethod?: string;
  items: any[];
  total: number;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
}

const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "WELS FOOTWEAR",
  heroSubtitle: "Experience the next generation of athletic excellence. Built for the bold.",
  heroImage: "https://api.a0.dev/assets/image?text=premium%20futuristic%20sneaker%20floating%20blue%20neon&seed=99",
  aboutTitle: "OUR MISSION",
  aboutText: "We blend high-performance engineering with street-ready aesthetics to create footwear that moves at the speed of your life.",
  aboutImage: "https://api.a0.dev/assets/image?text=aesthetic%20shoe%20manufacturing%20process%20neon&seed=44",
  features: [
    { icon: 'fa-bolt', title: 'Energy Return', desc: 'Dual-density foam for max bounce.', stat: '98%' },
    { icon: 'fa-wind', title: 'Breathable', desc: 'Precision engineered mesh tech.', stat: 'MAX' },
    { icon: 'fa-shield-heart', title: 'Durability', desc: 'Reinforced stress points.', stat: 'SAFE' },
    { icon: 'fa-microchip', title: 'Smart Fit', desc: 'Adaptive lacing system.', stat: 'LIVE' },
  ],
  galleryImages: [],
  productsPerRow: 3,
  accentColor: '#3b82f6',
  showFeatures: true,
  showAbout: true,
  showGallery: true,
  showReviews: true
};

export const StoreService = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem('wels_products');
    const prods: Product[] = data ? JSON.parse(data) : [];
    return prods.map(p => ({
      ...p,
      images: p.images || (p.image ? [p.image] : [])
    })).sort((a, b) => (a.orderWeight || 0) - (b.orderWeight || 0));
  },
  saveProduct: (product: Product) => {
    const products = StoreService.getProducts();
    if (product.images && product.images.length > 0) {
      product.image = product.images[0];
    }
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) products[index] = product;
    else products.push({ ...product, id: Date.now().toString(), orderWeight: products.length });
    localStorage.setItem('wels_products', JSON.stringify(products));
  },
  updateProductOrder: (orderedIds: string[]) => {
    const products = StoreService.getProducts();
    const updated = products.map(p => ({
      ...p,
      orderWeight: orderedIds.indexOf(p.id)
    }));
    localStorage.setItem('wels_products', JSON.stringify(updated));
  },
  deleteProduct: (id: string) => {
    const products = StoreService.getProducts().filter(p => p.id !== id);
    localStorage.setItem('wels_products', JSON.stringify(products));
  },
  getSettings: (): SiteSettings => {
    const data = localStorage.getItem('wels_settings');
    if (!data) return DEFAULT_SETTINGS;
    try {
      const parsed = JSON.parse(data);
      // Merge with defaults to ensure all required arrays/keys exist
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },
  saveSettings: (settings: SiteSettings) => {
    localStorage.setItem('wels_settings', JSON.stringify(settings));
    document.documentElement.style.setProperty('--accent', settings.accentColor);
  },
  getOrders: (): Order[] => {
    const data = localStorage.getItem('wels_orders');
    return data ? JSON.parse(data) : [];
  },
  createOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => {
    const orders = StoreService.getOrders();
    const newOrder: Order = {
      ...order,
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toLocaleString('en-IN'),
      status: 'Pending'
    };
    orders.push(newOrder);
    localStorage.setItem('wels_orders', JSON.stringify(orders));
    return newOrder;
  }
};