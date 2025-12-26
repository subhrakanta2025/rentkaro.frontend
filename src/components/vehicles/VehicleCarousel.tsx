import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Autoplay from "embla-carousel-autoplay"

const bikeImages = [
  "https://via.placeholder.com/400x300.png/0000FF/FFFFFF?text=Bike+1",
  "https://via.placeholder.com/400x300.png/0000FF/FFFFFF?text=Bike+2",
  "https://via.placeholder.com/400x300.png/0000FF/FFFFFF?text=Bike+3",
]

const carImages = [
  "https://via.placeholder.com/400x300.png/FF0000/FFFFFF?text=Car+1",
  "https://via.placeholder.com/400x300.png/FF0000/FFFFFF?text=Car+2",
  "https://via.placeholder.com/400x300.png/FF0000/FFFFFF?text=Car+3",
]

export const VehicleCarousel = () => {
  return (
    <Carousel 
      className="w-full max-w-xs mx-auto"
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      <CarouselContent>
        {bikeImages.map((src, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img src={src} alt={`Bike ${index + 1}`} />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
        {carImages.map((src, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img src={src} alt={`Car ${index + 1}`} />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
