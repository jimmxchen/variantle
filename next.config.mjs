/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages (project page served at /variantle/).
  output: "export",
  basePath: "/variantle",
  images: { unoptimized: true },
};

export default nextConfig;
