type MetaParams = {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  robots?: string;
};

const upsertMeta = (key: 'name' | 'property', identifier: string, content: string) => {
  if (typeof document === 'undefined') return;
  let tag = document.querySelector(`meta[${key}="${identifier}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(key, identifier);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const upsertLink = (rel: string, href: string) => {
  if (typeof document === 'undefined') return;
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

export const setPageSEO = ({ title, description, keywords = [], canonicalUrl, robots = 'index,follow' }: MetaParams) => {
  if (typeof document === 'undefined') return;
  document.title = title;
  upsertMeta('name', 'description', description);
  if (keywords.length) {
    upsertMeta('name', 'keywords', keywords.join(', '));
  }
  upsertMeta('name', 'robots', robots);
  upsertMeta('name', 'googlebot', robots);
  if (canonicalUrl) {
    upsertLink('canonical', canonicalUrl);
    upsertMeta('property', 'og:url', canonicalUrl);
  }
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
};

export const setStructuredData = (id: string, data: Record<string, unknown>) => {
  if (typeof document === 'undefined') return;
  const scriptId = `ld-${id}`;
  const existing = document.getElementById(scriptId);
  if (existing?.parentNode) {
    existing.parentNode.removeChild(existing);
  }
  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.id = scriptId;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};
