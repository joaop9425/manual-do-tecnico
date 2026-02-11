import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://joaop9425.github.io',
  base: '/manual-do-tecnico',
  integrations: [react(), tailwind()]
});
