import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // బిల్డ్ టైమ్ లో process.env.API_KEY ని స్ట్రింగ్ లాగా రీప్లేస్ చేస్తుంది
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
