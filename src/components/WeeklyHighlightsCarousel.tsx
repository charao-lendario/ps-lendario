import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import destaqueCyberSecurity from '@/assets/destaque-cyber-security.png';
import destaqueDiscovery from '@/assets/destaque-discovery.png';

const highlights = [
  { src: destaqueCyberSecurity, alt: 'Cyber Security com Roger Robson' },
  { src: destaqueDiscovery, alt: 'Processo de Discovery com Marllon Blando' },
];

export function WeeklyHighlightsCarousel() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Destaques da Semana</h2>
        
        <Carousel 
          className="w-full max-w-5xl mx-auto"
          opts={{
            align: "start",
          }}
        >
          <CarouselContent className="-ml-4">
            {highlights.map((highlight, index) => (
              <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2">
                <div className="flex justify-center">
                  <div className="relative w-full max-w-[380px] aspect-[9/16] rounded-2xl overflow-hidden shadow-glow group hover:scale-[1.02] transition-transform">
                    <img
                      src={highlight.src}
                      alt={highlight.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </section>
  );
}
