import path from 'path';
import { fileURLToPath } from 'url';
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

/**
 * @type {import('next').NextConfig}
 **/
export default withNextIntl({
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>rule.test?.test?.('.svg'))
    config.module.rules.push(
      { ...fileLoaderRule, test: /\.svg$/i, resourceQuery: /url/ },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      },
    )
    fileLoaderRule.exclude = /\.svg$/i
    return config
  },
  async rewrites() {
    return [
      {
        source: '/wp-content/:path*',
        destination: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/:path*`,
      },
    ]
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, './src/styles')],
    prependData: `@import "src/styles/_prelude.scss";`
  },
  trailingSlash: true,
});
