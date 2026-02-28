/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cecsvrwibdvncrxbbctr.supabase.co'],
    unoptimized: true, // Required for static export
  },
  output: 'export',
  trailingSlash: true,
}

module.exports = nextConfig