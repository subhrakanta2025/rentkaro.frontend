import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: '+91 12345 67890',
    subtext: 'Mon-Sat, 9am-6pm IST',
  },
  {
    icon: Mail,
    title: 'Email',
    details: 'support@rentkaro.in',
    subtext: 'We reply within 24 hours',
  },
  {
    icon: MapPin,
    title: 'Office',
    details: 'Bangalore, Karnataka',
    subtext: 'India',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    details: 'Mon - Sat: 9am - 6pm',
    subtext: 'Sunday: Closed',
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container text-center">
            <h1 className="text-4xl font-bold text-foreground md:text-5xl">
              Contact Us
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div className="rounded-xl border border-border bg-card p-8">
                <h2 className="text-2xl font-bold text-foreground">Send us a message</h2>
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Tell us more..." rows={5} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Get in touch</h2>
                  <p className="mt-2 text-muted-foreground">
                    We're here to help with any questions about our platform, partnerships, or services.
                  </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {contactInfo.map((item) => (
                    <div key={item.title} className="rounded-xl border border-border bg-card p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-foreground">{item.details}</p>
                      <p className="text-sm text-muted-foreground">{item.subtext}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
