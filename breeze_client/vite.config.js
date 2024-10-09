import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

export default defineConfig(({ mode }) => {
  // Load the environment variables from the appropriate .env file
  const env = dotenv.config({ path: `.env.${mode}` }).parsed;
  return {
    define: {
      'process.env': env,
    },
    plugins: [react()],
  };
});
