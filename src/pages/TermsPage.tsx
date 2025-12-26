import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
            <p className="mt-4 text-muted-foreground">Last updated: December 2024</p>

            <div className="mt-12 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  By accessing or using RentKaro's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">2. Description of Service</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  RentKaro is a vehicle rental marketplace that connects customers with rental agencies. We facilitate the booking process but are not the direct provider of rental vehicles.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">3. User Accounts</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  To use certain features of our platform, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">4. Booking and Payments</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  All bookings are subject to vehicle availability and agency confirmation. Payments are processed securely through our platform. Pricing includes all applicable taxes unless otherwise stated.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">5. Cancellation Policy</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Cancellation policies vary by agency and vehicle. Please review the specific cancellation terms before confirming your booking. Refunds, if applicable, will be processed according to the stated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">6. User Responsibilities</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Users must have a valid driving license appropriate for the vehicle type. Users are responsible for any damages or violations during the rental period. Vehicles must be returned in the same condition as received.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">7. Limitation of Liability</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  RentKaro acts as an intermediary and is not liable for any disputes between customers and agencies. Our liability is limited to the amount paid for the booking in question.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">8. Contact</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  For any questions about these terms, please contact us at support@rentkaro.in or call +91 12345 67890.
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
