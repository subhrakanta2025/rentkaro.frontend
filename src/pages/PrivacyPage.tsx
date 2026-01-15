import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
            <p className="mt-4 text-muted-foreground">Last updated: December 2024</p>

            <div className="mt-12 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We collect information you provide directly, including your name, email, phone number, and driving license details for KYC verification. We also collect usage data to improve our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We use your information to process bookings, verify your identity, communicate with you about your rentals, improve our platform, and comply with legal requirements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">3. Information Sharing</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We share your booking details with rental agencies to fulfill your reservation. We may also share information with payment processors, verification services, and as required by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">4. Data Security</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">5. Your Rights</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  You have the right to access, correct, or delete your personal information. You can also opt out of marketing communications at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">6. Cookies</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and personalize content. You can manage cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">7. Changes to This Policy</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">8. Contact Us</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  If you have any questions about this privacy policy, please contact us at privacy@rentkaro.online or +91 12345 67890.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
