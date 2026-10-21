import type { MerchantSummary, ProductSummary } from '@/lib/types';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const demoMerchants: MerchantSummary[] = [
  {
    id: 'demo-mama-risikat',
    slug: 'mama-risikats-kitchen',
    name: "Mama Risikat's Kitchen",
    category: 'Food',
    rating: 4.9,
    deliveryEta: '20–35 min',
    area: 'Oke-Ilewo',
    description: 'Authentic Abeokuta amala, hot goat meat ewedu, and gbegiri cooked with firewood tradition.',
    isOpen: true,
    minOrderKobo: 200000,
    tags: ['Amala', 'Swallow', 'Traditional', 'Local'],
  },
  {
    id: 'demo-suya-spot',
    slug: 'suya-spot-oke-ilewo',
    name: 'Suya Spot Oke-Ilewo',
    category: 'Food',
    rating: 4.8,
    deliveryEta: '25–40 min',
    area: 'Oke-Ilewo',
    description: 'Fresh spiced beef suya, chicken suya, roasted ram, and sliced onions with artisanal yaji spice.',
    isOpen: true,
    minOrderKobo: 150000,
    tags: ['Suya', 'Grill', 'Late Night', 'Spicy'],
  },
  {
    id: 'demo-sunrise-kitchen',
    slug: 'sunrise-kitchen',
    name: 'Sunrise Kitchen & Grill',
    category: 'Food',
    rating: 4.8,
    deliveryEta: '25–40 min',
    area: 'Ibara',
    description: 'Smoky party jollof rice, fried rice, crispy chicken, and hearty catfish pepper soup.',
    isOpen: true,
    minOrderKobo: 250000,
    tags: ['Jollof', 'Fast Food', 'Pepper Soup', 'Rice'],
  },
  {
    id: 'demo-green-basket',
    slug: 'green-basket-groceries',
    name: 'Green Basket Groceries',
    category: 'Grocery',
    rating: 4.7,
    deliveryEta: '30–50 min',
    area: 'Kuto',
    description: 'Farm-fresh tomatoes, peppers, plantains, grains, cooking oils, and household essentials.',
    isOpen: true,
    minOrderKobo: 300000,
    tags: ['Fresh Produce', 'Pantry', 'Groceries', 'Vegetables'],
  },
  {
    id: 'demo-sweet-tooth',
    slug: 'sweet-tooth-bakery',
    name: 'Sweet Tooth Cafe & Bakery',
    category: 'Drinks',
    rating: 4.9,
    deliveryEta: '15–30 min',
    area: 'Adigbe',
    description: 'Oven-fresh bread, meat pies, gourmet cakes, chilled fruit smoothies, and iced coffees.',
    isOpen: true,
    minOrderKobo: 150000,
    tags: ['Bakery', 'Pastries', 'Smoothies', 'Coffee'],
  },
  {
    id: 'demo-campus-bites',
    slug: 'campus-bites-funaab',
    name: 'Campus Bites & Fast Food',
    category: 'Food',
    rating: 4.6,
    deliveryEta: '20–35 min',
    area: 'Camp / FUNAAB',
    description: 'Quick student combos, burgers, loaded shawarma, noodles, and cold beverages delivered fast.',
    isOpen: true,
    minOrderKobo: 120000,
    tags: ['Shawarma', 'Burgers', 'Students', 'Fast Delivery'],
  },
];

const demoProducts: ProductSummary[] = [
  // Mama Risikat's
  {
    id: 'p-mr-1',
    slug: 'amala-ewedu-goat',
    merchantId: 'demo-mama-risikat',
    merchantName: "Mama Risikat's Kitchen",
    name: 'Fluffy Amala with Goat Meat & Ewedu',
    priceKobo: 420000,
    category: 'Swallows & Soups',
    description: '2 wraps of piping hot Abeokuta black amala served with assorted goat meat and fresh gbegiri.',
    available: true,
  },
  {
    id: 'p-mr-2',
    slug: 'ofada-rice-deluxe',
    merchantId: 'demo-mama-risikat',
    merchantName: "Mama Risikat's Kitchen",
    name: 'Local Ofada Rice with Ayamase Sauce',
    priceKobo: 480000,
    category: 'Rice Dishes',
    description: 'Aromatic unpolished ofada rice wrapped in broad leaves with spicy designer palm oil sauce and boiled egg.',
    available: true,
  },
  {
    id: 'p-mr-3',
    slug: 'assorted-meat-pepper-soup',
    merchantId: 'demo-mama-risikat',
    merchantName: "Mama Risikat's Kitchen",
    name: 'Fiery Assorted Meat Pepper Soup',
    priceKobo: 350000,
    category: 'Soups & Extras',
    description: 'Hot herb-infused soup with tripe, cow foot, and liver.',
    available: true,
  },

  // Suya Spot Oke-Ilewo
  {
    id: 'p-ss-1',
    slug: 'special-beef-suya',
    merchantId: 'demo-suya-spot',
    merchantName: 'Suya Spot Oke-Ilewo',
    name: 'Special Boneless Beef Suya (Large)',
    priceKobo: 350000,
    category: 'Suya & Grills',
    description: 'Tender grilled steak cuts seasoned with ginger, peanut powder, and hot yaji pepper, served with onions and cabbage.',
    available: true,
  },
  {
    id: 'p-ss-2',
    slug: 'whole-grilled-chicken-suya',
    merchantId: 'demo-suya-spot',
    merchantName: 'Suya Spot Oke-Ilewo',
    name: 'Smoked Chicken Suya Quarter',
    priceKobo: 420000,
    category: 'Suya & Grills',
    description: 'Succulent chicken leg quarter slow-roasted over charcoal flames.',
    available: true,
  },
  {
    id: 'p-ss-3',
    slug: 'masa-with-suya',
    merchantId: 'demo-suya-spot',
    merchantName: 'Suya Spot Oke-Ilewo',
    name: 'Golden Masa Cakes (4 pcs)',
    priceKobo: 120000,
    category: 'Sides',
    description: 'Fermented puffed rice cakes perfect for dipping in spiced suya gravy.',
    available: true,
  },

  // Sunrise Kitchen
  {
    id: 'p-sk-1',
    slug: 'smoky-jollof-combo',
    merchantId: 'demo-sunrise-kitchen',
    merchantName: 'Sunrise Kitchen & Grill',
    name: 'Smoky Firewood Jollof Combo',
    priceKobo: 550000,
    category: 'Combos',
    description: 'Generous party jollof served with fried sweet plantains (dodo), creamy coleslaw, and spicy grilled chicken.',
    available: true,
  },
  {
    id: 'p-sk-2',
    slug: 'catfish-pepper-soup',
    merchantId: 'demo-sunrise-kitchen',
    merchantName: 'Sunrise Kitchen & Grill',
    name: 'Fresh Point & Kill Catfish Pepper Soup',
    priceKobo: 780000,
    category: 'Fish & Soups',
    description: 'Whole cut fresh catfish boiled with utazi leaves, scent leaves, and aromatic spices.',
    available: true,
  },
  {
    id: 'p-sk-3',
    slug: 'fried-rice-beef',
    merchantId: 'demo-sunrise-kitchen',
    merchantName: 'Sunrise Kitchen & Grill',
    name: 'Special Fried Rice with Beef Kebab',
    priceKobo: 520000,
    category: 'Rice Dishes',
    description: 'Stir-fried rice with sweet corn, carrots, liver cubes, and seasoned beef chunks.',
    available: true,
  },

  // Green Basket Groceries
  {
    id: 'p-gb-1',
    slug: 'fresh-produce-box',
    merchantId: 'demo-green-basket',
    merchantName: 'Green Basket Groceries',
    name: 'Fresh Farm Produce Market Box',
    priceKobo: 1250000,
    category: 'Fresh Produce',
    description: 'Crate containing fresh tomatoes, rodo peppers, tatase, red onions, ginger, garlic, and sweet potatoes.',
    available: true,
  },
  {
    id: 'p-gb-2',
    slug: 'pantry-starter-pack',
    merchantId: 'demo-green-basket',
    merchantName: 'Green Basket Groceries',
    name: 'Pantry Essentials Value Pack',
    priceKobo: 2100000,
    category: 'Pantry',
    description: '5kg local rice, 2L pure vegetable cooking oil, salt, seasoning cubes, and tomato paste pack.',
    available: true,
  },
  {
    id: 'p-gb-3',
    slug: 'ripe-plantain-bunch',
    merchantId: 'demo-green-basket',
    merchantName: 'Green Basket Groceries',
    name: 'Farm Fresh Plantain Bunch (5 fingers)',
    priceKobo: 300000,
    category: 'Fresh Produce',
    description: 'Naturally ripened sweet yellow plantains for frying dodo or roasting bole.',
    available: true,
  },

  // Sweet Tooth Cafe
  {
    id: 'p-st-1',
    slug: 'fluffy-meat-pie',
    merchantId: 'demo-sweet-tooth',
    merchantName: 'Sweet Tooth Cafe & Bakery',
    name: 'Gourmet Beef Meat Pie (2 pcs)',
    priceKobo: 220000,
    category: 'Pastries',
    description: 'Buttery flaky pastry filled with minced beef, potatoes, carrots, and sweet spices.',
    available: true,
  },
  {
    id: 'p-st-2',
    slug: 'iced-caramel-latte',
    merchantId: 'demo-sweet-tooth',
    merchantName: 'Sweet Tooth Cafe & Bakery',
    name: 'Chilled Caramel Cold Brew (500ml)',
    priceKobo: 280000,
    category: 'Drinks',
    description: 'Freshly brewed Arabica espresso with whole milk, crushed ice, and sweet salted caramel drizzle.',
    available: true,
  },

  // Campus Bites
  {
    id: 'p-cb-1',
    slug: 'double-sausage-shawarma',
    merchantId: 'demo-campus-bites',
    merchantName: 'Campus Bites & Fast Food',
    name: 'Loaded Chicken & Sausage Shawarma',
    priceKobo: 320000,
    category: 'Fast Food',
    description: 'Toasted pita wrap packed with shredded chicken, beef frank, creamy garlic sauce, and crunchy veggies.',
    available: true,
  },
  {
    id: 'p-cb-2',
    slug: 'cheeseburger-fries-combo',
    merchantId: 'demo-campus-bites',
    merchantName: 'Campus Bites & Fast Food',
    name: 'Mega Beef Cheeseburger with Fries',
    priceKobo: 450000,
    category: 'Fast Food',
    description: 'Grilled beef patty, melted cheddar cheese, caramelized onions, pickles, and crispy salted fries.',
    available: true,
  },
];

export async function getApprovedMerchants(): Promise<MerchantSummary[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    const { data: dbStores } = await supabase
      .from('stores')
      .select('id, slug, name, category, description, is_open, is_approved, merchant_id')
      .eq('is_approved', true);

    if (dbStores && dbStores.length > 0) {
      return dbStores.map((store) => {
        const demoMatch = demoMerchants.find((m) => m.slug === store.slug);
        return {
          id: store.id,
          slug: store.slug,
          name: store.name,
          category: store.category || 'Food',
          rating: demoMatch?.rating || 4.8,
          deliveryEta: demoMatch?.deliveryEta || '25–40 min',
          area: demoMatch?.area || 'Abeokuta',
          description: store.description || demoMatch?.description || '',
          isOpen: store.is_open ?? true,
          minOrderKobo: demoMatch?.minOrderKobo || 150000,
          tags: demoMatch?.tags || ['Verified'],
        };
      });
    }
  } catch (err) {
    console.warn('getApprovedMerchants: Supabase fetch error, using demo catalogue', err);
  }

  return demoMerchants;
}

export async function getMerchantBySlug(slug: string): Promise<MerchantSummary | null> {
  const merchants = await getApprovedMerchants();
  return merchants.find((m) => m.slug === slug) || null;
}

export async function getProductsByMerchant(merchantId: string): Promise<ProductSummary[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    const { data: dbProducts } = await supabase
      .from('products')
      .select('id, name, price_kobo, description, is_available, merchant_id')
      .eq('merchant_id', merchantId);

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        slug: p.name.toLowerCase().replace(/\s+/g, '-'),
        merchantId: p.merchant_id,
        merchantName: 'Verified Kitchen',
        name: p.name,
        priceKobo: p.price_kobo,
        available: p.is_available,
        description: p.description || '',
      }));
    }
  } catch (err) {
    console.warn('getProductsByMerchant: Supabase fetch error, using demo catalogue', err);
  }

  return demoProducts.filter((p) => p.merchantId === merchantId);
}

export async function getAllProducts(): Promise<ProductSummary[]> {
  return demoProducts;
}
