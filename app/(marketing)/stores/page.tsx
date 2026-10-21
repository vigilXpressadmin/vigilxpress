import { getApprovedMerchants } from '@/lib/data/demo-catalogue';
import { StoresDirectory } from './stores-directory';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stores & Local Kitchens in Ogun State',
  description: 'Order food, groceries and everyday essentials from verified local restaurants, hot amala kitchens, grills, and stores across active Ogun State delivery communities.',
};

export const dynamic = 'force-dynamic';

export default async function StoresPage() {
  const merchants = await getApprovedMerchants();

  return (
    <div className="container-x pt-28 pb-16">
      <div className="mb-8">
        <span className="eb">Ogun State Marketplace</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Browse Verified Stores &amp; Kitchens
        </h1>
        <p className="mt-2 text-base text-neutral-600 max-w-2xl">
          Order food, groceries, and everyday essentials from trusted local kitchens and stores across active delivery areas in Ogun State. Combine items in one cart, track every step live, and confirm delivery with your PIN.
        </p>
      </div>

      <StoresDirectory initialMerchants={merchants} />
    </div>
  );
}
