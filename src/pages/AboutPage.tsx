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
              <div className="mt-8 grid gap-6 rounded-xl border border-border bg-card p-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Founded</p>
                  <p className="text-lg font-semibold text-foreground">2022</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Headquarters</p>
                  <p className="text-lg font-semibold text-foreground">Hyderabad, India</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Human Support</p>
                  <p className="text-lg font-semibold text-foreground">Real people, 7 days a week</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="bg-muted/30 py-16">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold text-foreground">Who We Are</h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                We are a Hyderabad-based team of product builders, operations specialists, and support champions committed to safe, transparent mobility. Our marketplace bridges verified rental agencies with customers, providing clear pricing, secure KYC, and reliable support.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Every guide, checklist, and city page is researched and written by our in-house team with human review—no auto-generated listings or AI-only content—so riders and agencies can trust what they read.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {["Verified partners across India", "Secure KYC and payments", "Responsive support for every trip"].map((item) => (
                  <div key={item} className="rounded-xl bg-background p-6 shadow-sm">
                    <p className="text-base font-semibold text-foreground">{item}</p>
                    <p className="mt-2 text-sm text-muted-foreground">We keep standards high so you can ride with confidence.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Completeness */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-5xl rounded-xl border border-border bg-card p-8">
              <h2 className="text-3xl font-bold text-foreground text-center">Trust, Coverage, and Completeness</h2>
              <p className="mt-4 text-center text-muted-foreground">
                To avoid the usual pitfalls—thin content, missing legal pages, or half-built experiences—we keep our product and content checks human-led and thorough.
              </p>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-background p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground">Full Site Coverage</h3>
                  <p className="mt-2 text-muted-foreground">
                    Dedicated pages for bookings, vehicles, agencies, blog, help, FAQs, contact, privacy, terms, refunds, safety, and more—no placeholder or under-construction screens.
                  </p>
                </div>
                <div className="rounded-lg bg-background p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground">Legal & Transparency</h3>
                  <p className="mt-2 text-muted-foreground">
                    Live legal pages include Privacy Policy, Terms, Refunds, Safety, and KYC details so users and partners know exactly how data, payments, and bookings are handled.
                  </p>
                </div>
                <div className="rounded-lg bg-background p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground">Human Editorial Review</h3>
                  <p className="mt-2 text-muted-foreground">
                    Content is drafted and verified by our team with manual fact checks; we use tools to assist but never publish AI-only or unreviewed copy.
                  </p>
                </div>
                <div className="rounded-lg bg-background p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground">Operational Maturity</h3>
                  <p className="mt-2 text-muted-foreground">
                    Operating since 2022 with established support, KYC, and payment flows so the site is stable, complete, and ready for customers and partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
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
