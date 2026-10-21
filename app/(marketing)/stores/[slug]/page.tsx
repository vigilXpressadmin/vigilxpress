import { notFound } from 'next/navigation';
import { getMerchantBySlug, getProductsByMerchant } from '@/lib/data/demo-catalogue';
import { StoreClientView } from './store-client-view';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const merchant = await getMerchantBySlug(slug);
  if (!merchant) return { title: 'Store Not Found' };
  return {
    title: `${merchant.name} — Order Delivery in Abeokuta`,
    description: merchant.description || `Order from ${merchant.name} in Abeokuta with live tracker and delivery PIN.`,
  };
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const merchant = await getMerchantBySlug(slug);
  if (!merchant) notFound();

  const products = await getProductsByMerchant(merchant.id);

  return (
    <div className="container-x pt-28 pb-16">
      <StoreClientView merchant={merchant} products={products} />
    </div>
  );
}
