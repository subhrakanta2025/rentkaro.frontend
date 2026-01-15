import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ShieldCheck, Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { setPageSEO, setStructuredData } from '@/lib/seo';
import { cn } from '@/lib/utils';

const cities = [
  { slug: 'hyderabad', name: 'Hyderabad', state: 'Telangana' },
  { slug: 'bangalore', name: 'Bangalore', state: 'Karnataka' },
  { slug: 'chennai', name: 'Chennai', state: 'Tamil Nadu' },
  { slug: 'pune', name: 'Pune', state: 'Maharashtra' },
  { slug: 'mumbai', name: 'Mumbai', state: 'Maharashtra' },
  { slug: 'delhi', name: 'Delhi', state: 'Delhi' },
  { slug: 'noida', name: 'Noida', state: 'Uttar Pradesh' },
  { slug: 'gurgaon', name: 'Gurgaon', state: 'Haryana' },
  { slug: 'kolkata', name: 'Kolkata', state: 'West Bengal' },
  { slug: 'kochi', name: 'Kochi', state: 'Kerala' },
  { slug: 'trivandrum', name: 'Trivandrum', state: 'Kerala' },
  { slug: 'vizag', name: 'Vizag', state: 'Andhra Pradesh' },
  { slug: 'vijayawada', name: 'Vijayawada', state: 'Andhra Pradesh' },
  { slug: 'tirupati', name: 'Tirupati', state: 'Andhra Pradesh' },
];

const categoryConfig = {
  'bike-rental': { label: 'Bike Rental', vehicle: 'bike', primaryKeyword: 'bike rental near me' },
  'car-rental': { label: 'Car Rental', vehicle: 'car', primaryKeyword: 'car rental near me' },
  'self-drive-car-rental': { label: 'Self Drive Car Rental', vehicle: 'car', primaryKeyword: 'self drive car rental' },
  'rent-bike': { label: 'Rent Bike', vehicle: 'bike', primaryKeyword: 'rent bike online' },
  'rent-car': { label: 'Rent Car', vehicle: 'car', primaryKeyword: 'rent car online' },
  'two-wheeler-rental': { label: 'Two Wheeler Rental', vehicle: 'bike', primaryKeyword: 'two wheeler rental near me' },
  'affordable-bike-rental': { label: 'Affordable Bike Rental', vehicle: 'bike', primaryKeyword: 'affordable bike rental' },
} as const;

type CategoryKey = keyof typeof categoryConfig;

type Props = {
  category: CategoryKey;
};

const trustPoints = [
  'Government ID and vehicle verification',
  'Fraud-free, verified rental agencies',
  'Assured refund and transparent pricing',
  'Doorstep delivery in select areas',
  '24x7 chat and phone support',
  'No hidden charges, easy cancellations',
];

const b2bBullets = [
  'Bike rental agency registration',
  'Car rental agency partner onboarding',
  'List my vehicle for rent',
  'Rental agency software for India',
];

const toTitle = (slug: string) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const buildCanonical = (category: CategoryKey, citySlug: string) => `https://rentkaro.online/${category}-in-${citySlug}`;

export default function CityLandingPage({ category }: Props) {
  const { citySlug = '' } = useParams();
  const normalizedCity = citySlug.toLowerCase();
  const city = useMemo(() => cities.find((c) => c.slug === normalizedCity), [normalizedCity]);
  const categoryMeta = categoryConfig[category];

  useEffect(() => {
    if (!city) return;
    const title = `${categoryMeta.label} in ${city.name} | Near You | RentKaro`;
    const description = `Book ${categoryMeta.vehicle === 'car' ? 'self drive cars' : 'bikes'} in ${city.name} from verified agencies. Government-approved verification, doorstep delivery, 24x7 support, and assured refunds.`;
    const canonicalUrl = buildCanonical(category, city.slug);

    setPageSEO({
      title,
      description,
      canonicalUrl,
      keywords: [
        `${categoryMeta.label.toLowerCase()} in ${city.name}`,
        `${categoryMeta.primaryKeyword}`,
        `${categoryMeta.vehicle} rental near me`,
        `rent ${categoryMeta.vehicle} in ${city.name}`,
        `self drive car rental in ${city.name}`,
        `two wheeler rental in ${city.name}`,
        `affordable bike rental in ${city.name}`,
        `verified rental agencies ${city.name}`,
        'assured refund vehicle rental',
        '24x7 customer support rental platform',
      ],
    });

    setStructuredData(`city-${category}-${city.slug}`, {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: `RentKaro ${categoryMeta.label} ${city.name}`,
      url: canonicalUrl,
      image: 'https://rentkaro.online/logo.png',
      areaServed: city.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: city.name,
        addressRegion: city.state,
        addressCountry: 'IN',
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
      sameAs: [],
      makesOffer: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
      },
      serviceArea: {
        '@type': 'Place',
        name: city.name,
      },
      serviceType: categoryMeta.label,
      brand: {
        '@type': 'Brand',
        name: 'RentKaro',
      },
    });

    setStructuredData(`service-${category}-${city.slug}`, {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${categoryMeta.label} in ${city.name}`,
      provider: {
        '@type': 'Organization',
        name: 'RentKaro',
        url: canonicalUrl,
      },
      areaServed: {
        '@type': 'Place',
        name: city.name,
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${categoryMeta.label} options in ${city.name}`,
        itemListElement: trustPoints.map((point) => ({ '@type': 'ListItem', name: point })),
      },
    });
  }, [category, categoryMeta.label, categoryMeta.primaryKeyword, categoryMeta.vehicle, city]);

  if (!city) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16">
          <div className="mx-auto max-w-2xl text-center space-y-3">
            <h1 className="text-2xl font-bold text-foreground">City coming soon</h1>
            <p className="text-sm text-muted-foreground">We are adding more city pages. Meanwhile, browse all vehicles.</p>
            <div className="flex items-center justify-center gap-2">
              <Link to="/">
                <Button variant="outline" size="sm">Back to Home</Button>
              </Link>
              <Link to="/vehicles">
                <Button size="sm">View Vehicles</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const cityTitle = `${categoryMeta.label} in ${city.name}`;
  const canonicalUrl = buildCanonical(category, city.slug);
  const crossLinks = cities.filter((c) => c.slug !== city.slug);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-hero border-b border-border/40">
          <div className="container py-10 md:py-14 lg:py-16">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                Verified {categoryMeta.vehicle === 'car' ? 'car' : 'bike'} rental agencies in {city.name}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {cityTitle} near you
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                RentKaro brings verified {categoryMeta.vehicle === 'car' ? 'self drive cars' : 'bikes and two wheelers'} in {city.name}, {city.state}. Book online with government verification, doorstep delivery, 24x7 support, and assured refunds.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-[11px]">{categoryMeta.primaryKeyword}</Badge>
                <Badge variant="secondary" className="text-[11px]">rent {categoryMeta.vehicle} in {city.name}</Badge>
                <Badge variant="secondary" className="text-[11px]">affordable {categoryMeta.vehicle} rental</Badge>
                <Badge variant="secondary" className="text-[11px]">trusted rental platform</Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link to={`/vehicles?city=${encodeURIComponent(city.name)}`}>
                  <Button size="lg" className="gap-2">
                    Search vehicles in {city.name}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/agency/register">
                  <Button size="lg" variant="outline" className="gap-2">
                    List my vehicle for rent
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Government verified platform
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-primary" />
                  24x7 customer support
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  Service area: {city.name}, {city.state}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-12">
          <div className="container grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Why choose RentKaro in {city.name}?</h2>
              <p className="text-sm text-muted-foreground">
                Built for safety and convenience: verified documents, clear pricing, refunds when plans change, and doorstep delivery where available.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {trustPoints.map((point) => (
                  <div key={point} className="flex items-start gap-2 rounded-lg border border-border/60 bg-card/40 p-3">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <p className="text-sm text-foreground leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-border/60 bg-muted/30 p-4">
              <h3 className="text-lg font-semibold text-foreground">Popular searches in {city.name}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Bike rental near me in {city.name}</li>
                <li>Car rental near me in {city.name}</li>
                <li>Self drive car rental in {city.name}</li>
                <li>Rent bike without deposit in {city.name}</li>
                <li>Verified bike rental agencies near me</li>
                <li>Trusted car rental platform in India</li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline" className="text-[11px]">fraud free car rental</Badge>
                <Badge variant="outline" className="text-[11px]">assured refund vehicle rental</Badge>
                <Badge variant="outline" className="text-[11px]">safe self drive car rental</Badge>
                <Badge variant="outline" className="text-[11px]">AI based rental platform India</Badge>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-12 bg-muted/30 border-t border-border/60">
          <div className="container space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Other cities we serve</h2>
                <p className="text-sm text-muted-foreground">Internal links help discovery across cities.</p>
              </div>
              <Link to={`/car-rental-in-${city.slug}`} className="text-sm text-primary hover:underline">
                Car rental in {city.name}
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {crossLinks.map((c) => (
                <Link key={c.slug} to={`/bike-rental-in-${c.slug}`} className="group">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {toTitle(c.slug)} bike rental
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 md:py-12">
          <div className="container grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                B2B & partners
              </div>
              <h2 className="text-xl font-semibold text-foreground">Grow with RentKaro</h2>
              <p className="text-sm text-muted-foreground">
                Partner as a bike rental agency or car rental agency. List vehicles, manage bookings, and earn more with verified customers.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {b2bBullets.map((item) => (
                  <div key={item} className="flex items-start gap-2 rounded-lg border border-border/60 bg-card/40 p-3">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <p className="text-sm text-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/agency/register">
                  <Button className="gap-2">
                    Agency registration
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" className="gap-2">
                    How it works
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">What makes us different?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Verified bike rental platform and fraud-free car rental checks.</li>
                <li>Assured refund vehicle rental policies with transparent terms.</li>
                <li>24x7 customer support rental platform with human assistance.</li>
                <li>AI based rental platform India for matching best agencies.</li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-[11px]">government verified vehicle rental</Badge>
                <Badge variant="secondary" className="text-[11px]">trusted car rental platform in India</Badge>
                <Badge variant="secondary" className="text-[11px]">nearest bike rental documents verified</Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link to={`/vehicles?city=${encodeURIComponent(city.name)}&type=${categoryMeta.vehicle}`}>
                  <Button variant="secondary" className="w-full sm:w-auto gap-2">
                    View {categoryMeta.vehicle === 'car' ? 'cars' : 'bikes'} in {city.name}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href={canonicalUrl} className="text-xs text-muted-foreground underline">
                  {canonicalUrl}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
