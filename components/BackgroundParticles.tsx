'use client';

import dynamic from 'next/dynamic';

export const BackgroundParticles = dynamic(
  () => import('@/components/animations/golden-dust').then((m) => m.GoldenDustCanvas),
  { ssr: false }
);

export default BackgroundParticles;
