import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle } from 'lucide-react';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold text-foreground">Refund Policy</h1>
            <p className="mt-4 text-muted-foreground">Last updated: December 2024</p>

            <div className="mt-12 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground">Cancellation & Refund Overview</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  At RentKaro, we understand that plans can change. Our refund policy is designed to be fair to both customers and rental agencies while ensuring a smooth experience for everyone.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">Standard Refund Schedule</h2>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-success" />
                    <div>
                      <p className="font-medium text-foreground">48+ hours before pickup</p>
                      <p className="text-sm text-muted-foreground">Full refund (100%)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium text-foreground">24-48 hours before pickup</p>
                      <p className="text-sm text-muted-foreground">75% refund</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium text-foreground">12-24 hours before pickup</p>
                      <p className="text-sm text-muted-foreground">50% refund</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium text-foreground">Less than 12 hours or No-show</p>
                      <p className="text-sm text-muted-foreground">No refund</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">Refund Process</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Refunds are processed automatically once a cancellation is confirmed. The amount will be credited to your original payment method within 5-7 business days, depending on your bank.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">Exceptions</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Full refunds are provided regardless of timing if the vehicle is unavailable due to agency fault, the agency cancels the booking, or there are safety concerns with the vehicle.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">Agency-Specific Policies</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Some agencies may have different refund policies. These will be clearly displayed on the vehicle listing page before you confirm your booking. The policy shown at the time of booking will apply.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  For any refund-related queries, please contact our support team at refunds@rentkaro.online or call +91 12345 67890. Our team is available Monday to Saturday, 9am to 6pm IST.
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
