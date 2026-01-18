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
  type: 'shoe' | 'tshirt'; // Distinguisher
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
  showTshirts: boolean;
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
  heroTitle: "WELS ZENITH",
  heroSubtitle: "Futurist Footwear & Apparel. Engineered for those who move at light speed.",
  heroImage: "https://api.a0.dev/assets/image?text=premium%20futuristic%20sneaker%20floating%20blue%20neon&seed=99",
  aboutTitle: "THE VISION",
  aboutText: "WELS isn't just a brand; it's a structural evolution of style. We combine aerospace-grade aesthetics with ergonomic perfection.",
  aboutImage: "https://api.a0.dev/assets/image?text=modern%20streetwear%20lifestyle%20neon&seed=44",
  features: [
    { icon: 'fa-bolt', title: 'Power Surge', desc: 'Energy recovery in every step.', stat: '98%' },
    { icon: 'fa-wind', title: 'Air Flow', desc: 'Precision thermal management.', stat: 'MAX' },
    { icon: 'fa-shield-heart', title: 'Aegis Core', desc: 'Industrial durability.', stat: 'SAFE' },
    { icon: 'fa-microchip', title: 'Logic Fit', desc: 'Smart adaptive contours.', stat: 'LIVE' },
  ],
  galleryImages: [],
  productsPerRow: 3,
  accentColor: '#3b82f6',
  showFeatures: true,
  showAbout: true,
  showGallery: true,
  showReviews: true,
  showTshirts: true
};

export const StoreService = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem('wels_products');
    const prods: Product[] = data ? JSON.parse(data) : [];
    return prods.map(p => ({
      ...p,
      type: p.type || 'shoe',
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