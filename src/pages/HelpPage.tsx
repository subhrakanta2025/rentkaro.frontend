import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Car, CreditCard, Calendar, Shield, Users, HelpCircle, Send, Mail, Phone, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface TicketFormData {
  name: string;
  email: string;
  phone: string;
  category: string;
  subject: string;
  description: string;
}

const categories = [
  { icon: Car, title: 'Booking', count: 8 },
  { icon: CreditCard, title: 'Payments', count: 5 },
  { icon: Calendar, title: 'Cancellations', count: 4 },
  { icon: Shield, title: 'Safety', count: 6 },
  { icon: Users, title: 'Account', count: 5 },
  { icon: HelpCircle, title: 'General', count: 7 },
];

const faqs = [
  {
    question: 'How do I book a vehicle on RentKaro?',
    answer: 'Simply search for your desired location and dates, browse available vehicles, select the one you like, complete the booking form, and make the payment. You will receive a confirmation email with all the details.',
  },
  {
    question: 'What documents do I need to rent a vehicle?',
    answer: 'You will need a valid driving license appropriate for the vehicle type (LMV for cars, MCWG for bikes), a government-issued ID (Aadhaar/PAN), and in some cases, a security deposit.',
  },
  {
    question: 'Can I cancel my booking?',
    answer: 'Yes, you can cancel your booking. Cancellation policies vary by agency. Generally, free cancellation is available up to 24-48 hours before pickup. Refunds are processed within 5-7 business days.',
  },
  {
    question: 'Is insurance included in the rental?',
    answer: 'Basic insurance is typically included in the rental price. However, coverage may vary by agency. We recommend checking the specific terms before booking or opting for additional coverage if needed.',
  },
  {
    question: 'What happens if I return the vehicle late?',
    answer: 'Late returns may incur additional charges. Most agencies offer a grace period of 1-2 hours. Beyond that, you may be charged for an extra day or hourly rates. Please inform the agency if you expect to be late.',
  },
  {
    question: 'How do I become a rental agency partner?',
    answer: 'You can register as an agency by clicking List Your Vehicles. Complete the registration form, submit your business documents for verification, and once approved, you can start listing your vehicles.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit/debit cards, UPI, net banking, and popular wallets like Paytm and PhonePe. Payment is securely processed through our platform.',
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can reach us via email at support@rentkaro.online, call us at +916372899795 (Mon-Sat, 9am-6pm), or use the contact form on our Contact Us page.',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketForm, setTicketForm] = useState<TicketFormData>({
    name: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
    description: '',
  });

  const filteredFaqs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!ticketForm.name || !ticketForm.email || !ticketForm.category || !ticketForm.subject || !ticketForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const ticketId = `TKT${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    toast.success(`Ticket submitted successfully! Your ticket ID is: ${ticketId}. We will get back to you within 24 hours.`);
    
    setTicketForm({
      name: '',
      email: '',
      phone: '',
      category: '',
      subject: '',
      description: '',
    });
  };

  return (
    <DashboardLayout title="Help & Support" description="Find answers to common questions or raise a support ticket">
      <div className="container-dashboard">
        {/* Search Section */}
        <div className="mb-8">
          <div className="mx-auto flex max-w-md gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for help..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <div
                key={category.title}
                className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-3 font-semibold text-foreground">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.count} articles</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs and Support Ticket Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* FAQs Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="mt-6">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {filteredFaqs.length === 0 && (
              <p className="mt-6 text-center text-muted-foreground">
                No results found. Try a different search term.
              </p>
            )}
          </div>

          {/* Submit a Ticket Section */}
          <div>
            <Card className="p-8 h-fit">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Submit a Support Ticket</h2>
                </div>
                <p className="text-muted-foreground">
                  Cannot find what you need? Submit a ticket and our support team will help you.
                </p>
              </div>

              <form onSubmit={handleTicketSubmit} className="space-y-6">
                <div className="grid gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={ticketForm.name}
                      onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={ticketForm.email}
                      onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={ticketForm.phone}
                      onChange={(e) => setTicketForm({ ...ticketForm, phone: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Issue Category *</Label>
                    <Select
                      value={ticketForm.category}
                      onValueChange={(value) => setTicketForm({ ...ticketForm, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="booking">Booking Issue</SelectItem>
                        <SelectItem value="payment">Payment Problem</SelectItem>
                        <SelectItem value="cancellation">Cancellation & Refund</SelectItem>
                        <SelectItem value="vehicle">Vehicle Issue</SelectItem>
                        <SelectItem value="account">Account Related</SelectItem>
                        <SelectItem value="agency">Agency Partner Query</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed information about your issue..."
                    rows={4}
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Include as much detail as possible to help us resolve your issue quickly.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <Button type="submit" className="gap-2">
                    <Send className="h-4 w-4" />
                    Submit Ticket
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setTicketForm({
                      name: '',
                      email: '',
                      phone: '',
                      category: '',
                      subject: '',
                      description: '',
                    })}
                  >
                    Clear Form
                  </Button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold mb-4 text-sm">Other Ways to Reach Us</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>support@rentkaro.online</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>+916372899795</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
