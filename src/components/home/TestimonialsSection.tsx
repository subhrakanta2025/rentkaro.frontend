import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Rahul Sharma',
    location: 'Mumbai',
    rating: 5,
    comment: 'Excellent service! The bike was in perfect condition and the pickup was seamless. Will definitely use RentKaro again for my trips.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
    vehicle: 'Royal Enfield Classic 350',
  },
  {
    id: 2,
    name: 'Priya Patel',
    location: 'Bangalore',
    rating: 5,
    comment: 'Rented a car for our family trip to Coorg. The process was quick, prices were transparent, and the car was spotless. Highly recommend!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60',
    vehicle: 'Maruti Swift',
  },
  {
    id: 3,
    name: 'Amit Kumar',
    location: 'Delhi',
    rating: 5,
    comment: 'Great platform to find affordable rentals. The agency was professional and the scooter helped me explore the city hassle-free.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
    vehicle: 'Honda Activa',
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    location: 'Hyderabad',
    rating: 5,
    comment: 'I was skeptical at first, but RentKaro exceeded my expectations. The booking was easy and the support team was very helpful.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60',
    vehicle: 'Tata Nexon',
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            What Our <span className="text-primary">Customers</span> Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Real experiences from travelers who trusted RentKaro for their journeys
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/20" />
              
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>

              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="mt-4 text-sm text-muted-foreground line-clamp-4">
                "{testimonial.comment}"
              </p>

              <p className="mt-4 text-xs font-medium text-primary">
                Rented: {testimonial.vehicle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
