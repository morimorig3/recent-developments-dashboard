// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  adapter: vercel({}),
  output: 'server',
  experimental: {
    svg: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
