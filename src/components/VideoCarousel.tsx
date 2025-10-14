import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';

interface Video {
  src: string;
  name: string;
}

const videos: Video[] = [
  { src: '/videos/conceicao.mp4', name: 'Conceição' },
  { src: '/videos/petrucio.mp4', name: 'Petrúcio' },
  { src: '/videos/carlinha.mp4', name: 'Carlinha' },
  { src: '/videos/caca.mp4', name: 'Cacá' },
  { src: '/videos/samuel.mp4', name: 'Samuel' },
  { src: '/videos/ligia.mp4', name: 'Lígia' },
];

export function VideoCarousel() {
  return (
    <Carousel className="w-full max-w-2xl mx-auto">
      <CarouselContent>
        {videos.map((video, index) => (
          <CarouselItem key={index}>
            <Card className="gradient-card shadow-glow overflow-hidden border-0">
              <div className="relative">
                <video
                  controls
                  className="w-full h-[300px] md:h-[400px] object-cover rounded-lg"
                  preload="metadata"
                >
                  <source src={video.src} type="video/mp4" />
                  Seu navegador não suporta reprodução de vídeo.
                </video>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-semibold text-lg">{video.name}</p>
                </div>
              </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
