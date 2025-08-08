import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // server: {
  //   // 👇 this is the fix
  //   historyApiFallback: true,
  // },
});
