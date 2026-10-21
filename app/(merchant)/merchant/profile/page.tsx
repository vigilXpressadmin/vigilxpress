import React from 'react';
import { ProfileForm } from '@/components/dashboard/profile-form';

export const metadata = {
  title: 'Merchant Profile',
};

export default function MerchantProfilePage() {
  return <ProfileForm role="merchant" />;
}
