// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
// https://astro.build/config
export default defineConfig({
  site: 'https://realtipcalculator.com',

  integrations: [
    sitemap({
      // Exclude error pages and any internal/noindex pages
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/500'),

      // Per-page customisation
      customPages: [],
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),

      // Fine-tune priority per route
      // @ts-ignore
      serialize(item) {
        // Homepage gets top priority
        if (item.url === 'https://realtipcalculator.com/') {
          // @ts-ignore
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }
        // Legal pages change rarely
        if (
          item.url.includes('/privacy-policy') ||
          item.url.includes('/terms')
        ) {
          // @ts-ignore
          return { ...item, priority: 0.3, changefreq: 'yearly' };
        }
        // About + Contact — moderate priority
        if (item.url.includes('/about') || item.url.includes('/contact')) {
          // @ts-ignore
          return { ...item, priority: 0.5, changefreq: 'monthly' };
        }
        return item;
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
