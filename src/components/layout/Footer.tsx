import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { NewsletterForm } from './NewsletterForm';
import { cn } from '@/lib/utils';
import { APP_LOGO_PATH } from '@/lib/logo';

function FooterLogo() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      {!isLoaded && (
        <div className="skeleton-logo h-5 w-20 absolute inset-0" />
      )}
      <img 
        src={APP_LOGO_PATH} 
        alt="RentKaro" 
        className={cn(
          "h-5 w-auto hover-bounce",
          isLoaded ? "animate-fade-in" : "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Agencies', href: '/agencies' },
    { name: 'Blog', href: '/blog' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Safety', href: '/safety' },
    { name: 'Refund Policy', href: '/refund' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Refund Policy', href: '/refund' },
  ],
  forAgencies: [
    { name: 'Agency Dashboard', href: '/agency/dashboard' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Contact Us', href: '/contact' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/rentkaro.online?igsh=MWQ1djhqbWU4dGM0YQ==' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/rentkaro/' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-6 sm:py-8 md:py-10">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <FooterLogo />
            </Link>
            <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs text-muted-foreground max-w-xs leading-relaxed">
              India's trusted vehicle rental marketplace. Rent bikes and cars from verified agencies across major cities.
            </p>
            <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
              <a href="tel:+911234567890" className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-primary flex-shrink-0" />
                +91 12345 67890
              </a>
              <a href="mailto:support@rentkaro.online" className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-primary flex-shrink-0" />
                support@rentkaro.online
              </a>
              <p className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
                <MapPin className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-primary flex-shrink-0" />
                Hyderabad, Telangana
              </p>
            </div>
          </div>

          {/* Links - 2 columns on mobile */}
          <div>
            <h3 className="text-[10px] sm:text-xs font-semibold text-foreground uppercase tracking-wide">Company</h3>
            <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-[11px] sm:text-xs text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] sm:text-xs font-semibold text-foreground uppercase tracking-wide">Support</h3>
            <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-[11px] sm:text-xs text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] sm:text-xs font-semibold text-foreground uppercase tracking-wide">Legal</h3>
            <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-[11px] sm:text-xs text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] sm:text-xs font-semibold text-foreground uppercase tracking-wide">Agencies</h3>
            <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
              {footerLinks.forAgencies.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-[11px] sm:text-xs text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-6 sm:mt-8 border-t border-border pt-4 sm:pt-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-4 sm:mt-6 flex flex-col items-center justify-between gap-2 sm:gap-3 border-t border-border pt-4 sm:pt-6 md:flex-row">
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} RentKaro. All rights reserved.
          </p>
          <div className="flex items-center gap-2 sm:gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="flex h-6 sm:h-7 w-6 sm:w-7 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label={social.name}
              >
                <social.icon className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
