import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isDev = mode === 'development';

  return {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$assets: '${env.VITE_ASSETS_PATH}';`,
        },
      },
    },
    server: {
      proxy: isDev ? {
        '/api': {
          target: env.VITE_SITE_URL,
          changeOrigin: true,
          secure: false,
        }
      } : {}
    }
  };
});
