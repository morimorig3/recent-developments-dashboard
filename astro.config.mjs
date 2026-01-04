// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel/serverless';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://recent-developments-dashboard.vercel.app',
  adapter: vercel({}),
  output: 'server',
  integrations: [
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  experimental: {
    svg: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
