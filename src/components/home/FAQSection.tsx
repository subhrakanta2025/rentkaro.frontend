import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What documents do I need to rent a vehicle?',
    answer: 'You need a valid driving license (LMV for cars, MCWG for bikes), a government-issued ID like Aadhaar or PAN, and in some cases, a refundable security deposit.',
  },
  {
    question: 'How do I book a vehicle on RentKaro?',
    answer: 'Simply search for your location and dates, browse available vehicles, select one you like, complete the booking form with your details, and make the payment. You will receive instant confirmation.',
  },
  {
    question: 'Can I cancel my booking and get a refund?',
    answer: 'Yes! Free cancellation is available up to 48 hours before pickup for a full refund. Cancellations within 24-48 hours get 75% refund. Check our refund policy for complete details.',
  },
  {
    question: 'Is insurance included in the rental price?',
    answer: 'Basic insurance coverage is included with every rental. Additional comprehensive coverage options are available for extra peace of mind during your trip.',
  },
  {
    question: 'How do I become a rental agency partner?',
    answer: 'Click on "List Your Vehicles" in the header, complete the registration form, submit your business documents for KYC verification, and once approved, you can start listing your vehicles.',
  },
  {
    question: 'What happens if the vehicle breaks down during my rental?',
    answer: 'Contact our 24/7 support helpline immediately. We will coordinate with the agency to provide roadside assistance or arrange an alternative vehicle at no extra cost.',
  },
];

export function FAQSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Got questions? We have answers to help you get started.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-border bg-card px-6 data-[state=open]:bg-card"
              >
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
