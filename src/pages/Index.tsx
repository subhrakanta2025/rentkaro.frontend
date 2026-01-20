import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedVehicles } from '@/components/home/FeaturedVehicles';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TopAgencies } from '@/components/home/TopAgencies';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FAQSection } from '@/components/home/FAQSection';
import { CTASection } from '@/components/home/CTASection';
import { setPageSEO, setStructuredData } from '@/lib/seo';

const Index = () => {
  useEffect(() => {
    setPageSEO({
      title: 'Bike & Car Rental Near You | Verified Agencies – RentKaro',
      description: 'Book bikes and cars from verified nearby rental agencies. Government-approved ID and vehicle verification, 24x7 support, assured refund. RentKaro.online.',
      canonicalUrl: 'https://rentkaro.online/',
      keywords: [
        'bike rental near me',
        'car rental near me',
        'self drive car rental',
        'rent bike online',
        'rent car online',
        'two wheeler rental near me',
        'affordable bike rental',
        'cheap car rental',
        'vehicle rental platform',
        'verified rental agencies'
      ],
    });

    setStructuredData('organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'RentKaro',
      url: 'https://rentkaro.online/',
      logo: 'https://rentkaro.online/logo.png'
    });

    setStructuredData('website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'RentKaro',
      url: 'https://rentkaro.online/',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://rentkaro.online/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    });

    setStructuredData('mobileapp', {
      '@context': 'https://schema.org',
      '@type': 'MobileApplication',
      name: 'RentKaro',
      operatingSystem: 'Android',
      applicationCategory: 'TravelApplication',
      url: 'https://rentkaro.online/',
      downloadUrl: 'https://rentkaro.online/',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR'
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedVehicles />
        <HowItWorks />
        <TopAgencies />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
