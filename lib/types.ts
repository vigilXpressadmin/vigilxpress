export type Role = 'customer' | 'merchant' | 'rider' | 'support' | 'admin';

export interface MerchantSummary {
  id: string;
  slug: string;
  name: string;
  category: string;
  rating: number;
  deliveryEta: string;
  image?: string;
  area?: string;
  description?: string;
  isOpen?: boolean;
  minOrderKobo?: number;
  tags?: string[];
}

export interface ProductSummary {
  id: string;
  slug: string;
  merchantId: string;
  merchantName: string;
  name: string;
  priceKobo: number;
  image?: string;
  available?: boolean;
  category?: string;
  description?: string;
}

export interface CartItem {
  productId: string;
  merchantId: string;
  merchantName: string;
  name: string;
  priceKobo: number;
  qty: number;
  image?: string;
}
