// next.config.js
const withPWA = require('next-pwa')({
    dest: 'public', // Directorio donde se generará el Service Worker
    register: true, // Registra automáticamente el Service Worker
    skipWaiting: true, // Activa el nuevo Service Worker inmediatamente
    disable: process.env.NODE_ENV === 'development', // Desactiva PWA en desarrollo
  })
  
  /** @type {import('next').NextConfig} */
  const nextConfig = withPWA({
    reactStrictMode: true,
    // Otras configuraciones de Next.js si es necesario
  })
  
  module.exports = nextConfig
  