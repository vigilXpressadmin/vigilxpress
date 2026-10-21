import React from 'react';
import { ProfileForm } from '@/components/dashboard/profile-form';

export const metadata = {
  title: 'Rider Profile',
};

export default function RiderProfilePage() {
  return <ProfileForm role="rider" />;
}
