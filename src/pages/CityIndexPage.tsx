import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { setPageSEO } from '@/lib/seo';
import { MapPin, ArrowRight } from 'lucide-react';

const cities = [
  'hyderabad', 'bangalore', 'chennai', 'pune', 'mumbai', 'delhi', 'noida', 'gurgaon', 'kolkata', 'kochi', 'trivandrum', 'vizag', 'vijayawada', 'tirupati',
  'jaipur', 'ahmedabad', 'surat', 'indore', 'bhopal', 'lucknow', 'kanpur', 'nagpur', 'chandigarh', 'patna', 'ranchi', 'coimbatore', 'mysore', 'goa', 'bhubaneswar', 'guwahati'
];

const toTitle = (slug: string) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function CityIndexPage() {
  useMemo(() => {
    setPageSEO({
      title: 'RentKaro Cities | Bike & Car Rental Near You',
      description: 'Find bike and car rentals in top cities across India. Explore RentKaro city pages for verified agencies, transparent pricing, and quick booking.',
      canonicalUrl: 'https://rentkaro.online/cities',
      keywords: ['bike rental cities', 'car rental cities', 'vehicle rental India', 'rentkaro cities'],
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12 space-y-8">
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl font-bold text-foreground">RentKaro cities across India</h1>
          <p className="text-muted-foreground">
            Browse bike and car rental options in major Tier-1, Tier-2, and Tier-3 cities. Each city page includes verified agencies, pricing, and fast booking.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">bike rental near me</Badge>
            <Badge variant="secondary">car rental in city</Badge>
            <Badge variant="secondary">vehicle rental India</Badge>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((slug) => (
            <div key={slug} className="rounded-lg border border-border/70 bg-card/40 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-foreground font-semibold">
                <MapPin className="h-4 w-4 text-primary" />
                {toTitle(slug)}
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <Link to={`/bike-rental-in-${slug}`}><Button variant="outline" size="sm" className="gap-1">Bike <ArrowRight className="h-3 w-3" /></Button></Link>
                <Link to={`/car-rental-in-${slug}`}><Button variant="outline" size="sm" className="gap-1">Car <ArrowRight className="h-3 w-3" /></Button></Link>
                <Link to={`/vehicle-rental-in-${slug}`}><Button variant="outline" size="sm" className="gap-1">Vehicle <ArrowRight className="h-3 w-3" /></Button></Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
