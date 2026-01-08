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
  {
    id: 5,
    name: 'Vikram Singh',
    location: 'Pune',
    rating: 5,
    comment: 'Used RentKaro for my Leh trip. The Fortuner was well-maintained and the agency provided excellent support throughout.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60',
    vehicle: 'Toyota Fortuner',
  },
  {
    id: 6,
    name: 'Ananya Iyer',
    location: 'Chennai',
    rating: 5,
    comment: 'Best rental experience ever! The electric scooter was perfect for beach hopping in Pondicherry. Zero hassle, zero emissions!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60',
    vehicle: 'Ola S1 Pro',
  },
  {
    id: 7,
    name: 'Rajesh Menon',
    location: 'Kolkata',
    rating: 4,
    comment: 'Good service and reasonable prices. The car had minor scratches but overall a pleasant experience. Would book again.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60',
    vehicle: 'Hyundai i20',
  },
  {
    id: 8,
    name: 'Meera Nair',
    location: 'Ahmedabad',
    rating: 5,
    comment: 'Travelled to Kutch with family. The XUV700 was spacious and comfortable. Kids loved the panoramic sunroof!',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60',
    vehicle: 'Mahindra XUV700',
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-muted/30 py-10 md:py-14">
      <div className="container">
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-bold text-foreground md:text-2xl">
            What Our <span className="text-primary">Customers</span> Say
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-muted-foreground">
            Real experiences from travelers who trusted RentKaro for their journeys
          </p>
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative rounded-lg border border-border bg-card p-2.5 sm:p-4 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <Quote className="absolute right-2 top-2 sm:right-3 sm:top-3 h-4 w-4 sm:h-6 sm:w-6 text-primary/20" />
              
              <div className="flex items-center gap-2">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-7 w-7 sm:h-9 sm:w-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-[10px] sm:text-sm font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-[9px] sm:text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>

              <div className="mt-1.5 sm:mt-2 flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="mt-2 text-[9px] sm:text-xs text-muted-foreground line-clamp-3">
                "{testimonial.comment}"
              </p>

              <p className="mt-2 text-[8px] sm:text-[10px] font-medium text-primary truncate">
                Rented: {testimonial.vehicle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
