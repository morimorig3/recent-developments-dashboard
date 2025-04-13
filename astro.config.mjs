// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://morimorig3.github.io',
  base: '/recent-developments-dashboard',
  experimental: {
    svg: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
