import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'ggulmuse',
  brand: {
    displayName: '껄무세',
    primaryColor: '#3182F6',
    icon: '',
  },
  web: {
    host: 'localhost',
    port: 3000,
    commands: {
      dev: 'rsbuild dev',
      build: 'rsbuild build',
    },
  },
  permissions: [],
  outdir: 'dist',
  webViewProps: {
    type: 'partner',
  },
});
