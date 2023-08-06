const path = require('path');
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';


export default defineConfig({
  plugins: [
    createVuePlugin(),
  ],
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  
});