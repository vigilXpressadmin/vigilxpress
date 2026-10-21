import React from 'react';
import { RiderDeliveryCard } from '@/components/rider/rider-delivery-card';
import { Bike } from 'lucide-react';

export const metadata = {
  title: 'Delivery Jobs',
};

export default function RiderJobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Active Delivery Jobs
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Accept new assignments, navigate stops, and verify customer delivery PINs.
        </p>
      </div>

      <div className="grid gap-4">
        <RiderDeliveryCard jobId="job-demo" status="offered" />
      </div>
    </div>
  );
}
