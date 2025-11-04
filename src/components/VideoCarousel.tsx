import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Video {
  id: string;
  video_url: string;
  student_name: string;
}

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
  const { data: videos, isLoading } = useQuery({
    queryKey: ['student-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_testimonials')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as Video[];
    },
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto py-8 text-center">
        <p className="text-muted-foreground">Carregando depoimentos...</p>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto py-8 text-center">
        <p className="text-muted-foreground">Nenhum depoimento disponível.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm">
      <Carousel 
        className="w-full"
        opts={{
          align: "center",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent>
          {videos.map((video) => {
            const isLocalVideo = video.video_url.startsWith('/videos/');
            
            return (
              <CarouselItem key={video.id} className="flex justify-center">
                <IPhoneFrame>
                  {isLocalVideo ? (
                    <video
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                      playsInline
                    >
                      <source src={video.video_url} type="video/mp4" />
                      Seu navegador não suporta reprodução de vídeo.
                    </video>
                  ) : (
                    <iframe
                      src={video.video_url}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pb-8">
                    <p className="text-white font-semibold text-lg text-center">{video.student_name}</p>
                  </div>
                </IPhoneFrame>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="-left-12" />
        <CarouselNext className="-right-12" />
      </Carousel>
    </div>
  );
}
