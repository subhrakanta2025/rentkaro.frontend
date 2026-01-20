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
            <p className="mt-4 text-muted-foreground">Last updated: January 2026</p>

            <div className="mt-12 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We collect information you provide directly (name, email, phone, driving license details for KYC), transaction details, and support communications. We also collect usage and device data such as pages viewed, IP address, browser type, and referring URLs to keep the platform reliable and secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We use your information to process bookings, verify your identity, communicate about rentals, prevent fraud, personalize content, improve our services, and comply with legal requirements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">3. Advertising, Cookies, and Google Services</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We use cookies, local storage, and similar technologies to remember your preferences and measure site performance. We partner with third-party providers, including Google, to serve ads and analytics. These partners may use cookies and identifiers to deliver personalized or contextual ads and to measure ad effectiveness. Google may use the DoubleClick cookie and device identifiers; you can opt out of personalized ads via Google Ads Settings or adssettings.google.com, and manage cookies through your browser settings. Declining cookies may impact certain features.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">4. Information Sharing</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We share booking details with rental agencies to fulfill reservations. We also share data with payment processors, verification services, cloud hosting, analytics and advertising partners (such as Google), and as required by law. We do not sell your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">5. Data Security and Retention</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We use administrative, technical, and physical safeguards to protect your data, though no method of transmission or storage is fully secure. We retain personal data only as long as necessary for the purposes described or as required by law, after which it is securely deleted or anonymized.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">6. Your Choices and Rights</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  You may access, update, or request deletion of your personal information by contacting us. You can opt out of marketing communications via unsubscribe links, control cookies through your browser, and manage Google ad personalization through Google Ads Settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">7. Children's Privacy</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Our services are not directed to children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us data, please contact us so we can remove it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">8. Changes to This Policy</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We may update this privacy policy periodically. We will post the updated policy with a new effective date and, when material changes occur, provide additional notice where appropriate.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">9. Contact Us</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  For privacy questions or requests, contact privacy@rentkaro.online or +916372899795. For ad-related inquiries, contact ads@rentkaro.online.
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
