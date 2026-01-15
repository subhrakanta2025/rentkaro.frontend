import { writeFileSync } from 'fs';
import { resolve } from 'path';

const baseUrl = 'https://rentkaro.online';
const today = new Date().toISOString().split('T')[0];

// Keep this list in sync with React Router static routes (no dynamic params)
const routes: Array<{ path: string; changefreq?: string; priority?: number }> = [
  { path: '/', changefreq: 'daily', priority: 1.0 },
  { path: '/vehicles', changefreq: 'daily', priority: 0.9 },
  { path: '/agencies', changefreq: 'weekly', priority: 0.9 },
  { path: '/how-it-works', changefreq: 'monthly', priority: 0.8 },
  { path: '/blog', changefreq: 'weekly', priority: 0.7 },
  { path: '/login', changefreq: 'monthly', priority: 0.4 },
  { path: '/register', changefreq: 'monthly', priority: 0.5 },
  { path: '/about', changefreq: 'yearly', priority: 0.6 },
  { path: '/contact', changefreq: 'yearly', priority: 0.5 },
  { path: '/terms', changefreq: 'yearly', priority: 0.3 },
  { path: '/privacy', changefreq: 'yearly', priority: 0.3 },
  { path: '/refund', changefreq: 'yearly', priority: 0.3 },
  { path: '/safety', changefreq: 'yearly', priority: 0.3 },
  { path: '/help', changefreq: 'monthly', priority: 0.5 },
  { path: '/favorites', changefreq: 'weekly', priority: 0.4 },
  { path: '/agency/register', changefreq: 'monthly', priority: 0.6 },
];

function buildUrlEntry(path: string, changefreq?: string, priority?: number) {
  return `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <lastmod>${today}</lastmod>\n    ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}\n    ${priority !== undefined ? `<priority>${priority.toFixed(1)}</priority>` : ''}\n  </url>`;
}

const urlEntries = routes.map(({ path, changefreq, priority }) => buildUrlEntry(path, changefreq, priority)).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

const outPath = resolve(process.cwd(), 'public', 'sitemap.xml');
writeFileSync(outPath, xml);

console.log(`Sitemap written to ${outPath}`);
