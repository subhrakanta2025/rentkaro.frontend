import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Shield, CheckCircle, Users, Phone, FileCheck, Car } from 'lucide-react';

const safetyFeatures = [
  {
    icon: FileCheck,
    title: 'Verified Agencies',
    description: 'All rental agencies undergo strict verification including business license, GST, and background checks.',
  },
  {
    icon: Car,
    title: 'Vehicle Inspection',
    description: 'Every vehicle listed on our platform meets safety and maintenance standards.',
  },
  {
    icon: Users,
    title: 'Customer Verification',
    description: 'KYC verification ensures accountability and safety for all parties.',
  },
  {
    icon: Shield,
    title: 'Insurance Coverage',
    description: 'Basic insurance is included with every rental for your peace of mind.',
  },
  {
    icon: Phone,
    title: '24/7 Support',
    description: 'Our support team is available round the clock for emergencies.',
  },
  {
    icon: CheckCircle,
    title: 'Secure Payments',
    description: 'All transactions are encrypted and processed through secure payment gateways.',
  },
];

const tips = [
  'Always inspect the vehicle before starting your rental',
  'Take photos/videos of the vehicle condition at pickup',
  'Check that all documents are in the vehicle',
  'Ensure the fuel level matches what was agreed',
  'Test all lights, indicators, and brakes',
  'Note any existing damage on the checkout form',
  'Keep emergency contact numbers handy',
  'Follow traffic rules and wear safety gear for bikes',
];

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mt-6 text-4xl font-bold text-foreground md:text-5xl">
              Your Safety is Our Priority
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              We've implemented comprehensive safety measures to ensure a secure and reliable rental experience.
            </p>
          </div>
        </section>

        {/* Safety Features */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-center text-3xl font-bold text-foreground">How We Keep You Safe</h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {safetyFeatures.map((feature) => (
                <div key={feature.title} className="rounded-xl border border-border bg-card p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="bg-muted/30 py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-center text-3xl font-bold text-foreground">Safety Tips for Renters</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-lg bg-background p-4">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                    <p className="text-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="py-16">
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-foreground">Emergency Support</h2>
            <p className="mt-2 text-muted-foreground">
              In case of any emergency during your rental, contact us immediately.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-destructive/10 px-6 py-3 text-lg font-semibold text-destructive">
              <Phone className="h-5 w-5" />
              Emergency Helpline: +91 12345 67890
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
