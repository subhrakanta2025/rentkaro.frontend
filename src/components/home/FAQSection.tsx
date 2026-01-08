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
    <section className="bg-muted/30 py-8 sm:py-10 md:py-14">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-lg sm:text-xl font-bold text-foreground md:text-2xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground px-2">
            Got questions? We have answers to help you get started.
          </p>
        </div>

        <div className="mx-auto mt-5 sm:mt-8 max-w-2xl">
          <Accordion type="single" collapsible className="space-y-1.5 sm:space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg border border-border bg-card px-3 sm:px-4 data-[state=open]:bg-card"
              >
                <AccordionTrigger className="text-left text-xs sm:text-sm font-medium hover:no-underline py-2.5 sm:py-3">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[10px] sm:text-xs text-muted-foreground pb-2.5 sm:pb-3 leading-relaxed">
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
