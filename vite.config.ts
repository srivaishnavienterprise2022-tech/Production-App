
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // ఇది బ్రౌజర్‌లోని కోడ్‌లో 'process.env.API_KEY' ని రియల్ వాల్యూతో రీప్లేస్ చేస్తుంది
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
