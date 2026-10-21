import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/stores',
    '/how-it-works',
    '/about',
    '/faq',
    '/contact',
    '/terms',
    '/privacy',
    '/refunds',
    '/cookies',
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : route === '/stores' ? 'daily' : 'monthly',
    priority: route === '' ? 1.0 : route === '/stores' ? 0.9 : 0.6,
  }));
}
