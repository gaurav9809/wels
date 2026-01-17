
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
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  productsPerRow: number;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string; // Added field
  items: any[];
  total: number;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
}

const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "STEP INTO STYLE",
  heroSubtitle: "WELS blends cutting-edge performance with futuristic aesthetics. Engineered for the bold, designed for the dreamers.",
  heroImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
  productsPerRow: 3
};

const INITIAL_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'WELS Alpha G1', 
    price: 189, 
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600',
    category: 'Running', 
    description: 'Engineered for elite performance. The Alpha G1 features a responsive carbon plate and high-traction outsole.',
    variants: [
      {
        color: 'Racing Green',
        images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600'],
        sizes: [{ size: 8, stock: 10 }, { size: 9, stock: 5 }, { size: 10, stock: 0 }]
      }
    ],
    isFeatured: true
  }
];

export const StoreService = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem('wels_products');
    if (!data) {
      localStorage.setItem('wels_products', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  },
  saveProduct: (product: Product) => {
    const products = StoreService.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) products[index] = product;
    else products.push({ ...product, id: Date.now().toString() });
    localStorage.setItem('wels_products', JSON.stringify(products));
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
