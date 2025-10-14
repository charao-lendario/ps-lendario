import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
  { src: '/videos/leonardo.mp4', name: 'Leonardo' },
  { src: '/videos/werner.mp4', name: 'Werner' },
  { src: '/videos/edu.mp4', name: 'Edu' },
];

function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: '320px', height: '650px' }}>
      {/* iPhone Frame */}
      <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl p-3">
        {/* Screen bezel */}
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-black">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-20" />
          
          {/* Video content */}
          <div className="absolute inset-0">
            {children}
          </div>
        </div>
      </div>
      
      {/* Side buttons */}
      <div className="absolute left-0 top-24 w-1 h-8 bg-gray-800 rounded-l" />
      <div className="absolute left-0 top-36 w-1 h-12 bg-gray-800 rounded-l" />
      <div className="absolute left-0 top-52 w-1 h-12 bg-gray-800 rounded-l" />
      <div className="absolute right-0 top-32 w-1 h-16 bg-gray-800 rounded-r" />
    </div>
  );
}

export function VideoCarousel() {
  return (
    <Carousel className="w-full max-w-4xl mx-auto py-8">
      <CarouselContent>
        {videos.map((video, index) => (
          <CarouselItem key={index} className="flex justify-center">
            <IPhoneFrame>
              <video
                controls
                className="w-full h-full object-cover"
                preload="metadata"
                playsInline
              >
                <source src={video.src} type="video/mp4" />
                Seu navegador não suporta reprodução de vídeo.
              </video>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pb-8">
                <p className="text-white font-semibold text-lg text-center">{video.name}</p>
              </div>
            </IPhoneFrame>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
