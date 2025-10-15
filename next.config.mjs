/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/work.html', destination: '/work', permanent: true },
      { source: '/studio.html', destination: '/studio', permanent: true },
      { source: '/careers.html', destination: '/careers', permanent: true },
      { source: '/directors.html', destination: '/directors', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/projects/:slug.html', destination: '/projects/:slug', permanent: true },
    ]
  }
};

export default nextConfig;
