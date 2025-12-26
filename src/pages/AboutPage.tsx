import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Users, Target, Award, Heart } from 'lucide-react';

const values = [
  {
    icon: Users,
    title: 'Customer First',
    description: 'We prioritize our customers\' needs and ensure a seamless rental experience.',
  },
  {
    icon: Target,
    title: 'Transparency',
    description: 'Clear pricing, honest communication, and no hidden charges.',
  },
  {
    icon: Award,
    title: 'Quality Assurance',
    description: 'Every vehicle on our platform meets strict quality and safety standards.',
  },
  {
    icon: Heart,
    title: 'Community',
    description: 'Building lasting relationships with agencies and customers across India.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container text-center">
            <h1 className="text-4xl font-bold text-foreground md:text-5xl">
              About <span className="text-primary">RentKaro</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              India's trusted vehicle rental marketplace connecting you with verified agencies across major cities.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                RentKaro was founded with a simple mission: to make vehicle rentals accessible, affordable, and hassle-free for everyone in India. We noticed that finding a reliable rental vehicle was often complicated, with unclear pricing and inconsistent quality.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Our platform brings together trusted rental agencies from across the country, offering a wide range of bikes and cars at competitive prices. Whether you need a scooter for daily commuting or a car for a family road trip, RentKaro has you covered.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-muted/30 py-16">
          <div className="container">
            <h2 className="text-center text-3xl font-bold text-foreground">Our Values</h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div key={value.title} className="rounded-xl bg-background p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-4xl font-bold text-primary">50+</p>
                <p className="mt-2 text-muted-foreground">Cities Covered</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">500+</p>
                <p className="mt-2 text-muted-foreground">Partner Agencies</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">10,000+</p>
                <p className="mt-2 text-muted-foreground">Vehicles Listed</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">1M+</p>
                <p className="mt-2 text-muted-foreground">Happy Customers</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
