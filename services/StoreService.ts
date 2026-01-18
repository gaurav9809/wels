
export interface Variant {
  color: string;
  sizes: { size: number; stock: number }[];
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  variants: Variant[];
  isFeatured?: boolean;
  isHidden?: boolean;
  orderWeight: number; // For manual positioning
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
  // Visibility Toggles
  showFeatures: boolean;
  showAbout: boolean;
  showGallery: boolean;
  showReviews: boolean;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  items: any[];
  total: number;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
}

const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "BRAND_NAME_HERE",
  heroSubtitle: "Your vision, your brand. Upload assets in Admin.",
  heroImage: "",
  aboutTitle: "OUR MISSION",
  aboutText: "Edit this text in the admin panel to tell your brand's unique story.",
  aboutImage: "",
  features: [
    { icon: 'fa-bolt', title: 'Feature 1', desc: 'Description here', stat: '99%' },
    { icon: 'fa-wind', title: 'Feature 2', desc: 'Description here', stat: 'MAX' },
    { icon: 'fa-shield-heart', title: 'Feature 3', desc: 'Description here', stat: 'SAFE' },
    { icon: 'fa-microchip', title: 'Feature 4', desc: 'Description here', stat: 'LIVE' },
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
    return prods.sort((a, b) => (a.orderWeight || 0) - (b.orderWeight || 0));
  },
  saveProduct: (product: Product) => {
    const products = StoreService.getProducts();
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
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
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
      date: new Date().toLocaleDateString(),
      status: 'Pending'
    };
    orders.push(newOrder);
    localStorage.setItem('wels_orders', JSON.stringify(orders));
    return newOrder;
  }
};
