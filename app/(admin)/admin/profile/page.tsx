import React from 'react';
import { ProfileForm } from '@/components/dashboard/profile-form';

export const metadata = {
  title: 'Admin Profile',
};

export default function AdminProfilePage() {
  return <ProfileForm role="admin" />;
}
