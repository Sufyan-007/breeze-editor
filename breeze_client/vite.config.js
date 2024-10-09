import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

export default defineConfig(({ mode }) => {
  // Load the environment variables from the appropriate .env file
  const env = dotenv.config({ path: `.env.${mode}` }).parsed;
  const host = env.VITE_HOST || '0.0.0.0';
  const port = env.VITE_PORT || 5173;
  return {
    define: {
      'process.env': env,
    },
    server: {
      host: host,
      port: port,
    },
    plugins: [react()],
  };
});
