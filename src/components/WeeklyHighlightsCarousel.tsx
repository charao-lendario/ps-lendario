import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import rogerRobsonImg from '@/assets/destaque-roger-robson.png';

export function WeeklyHighlightsCarousel() {
  const { data: highlights, isLoading } = useQuery({
    queryKey: ['weekly-highlights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_highlights')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !highlights || highlights.length === 0) {
    return null;
  }

  // Map para usar imagens locais quando disponíveis
  const imageMap: Record<string, string> = {
    'Roger Robson': rogerRobsonImg
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Destaques da Semana</h2>
        
        <Carousel 
          className="w-full max-w-5xl mx-auto"
          opts={{
            align: "center",
          }}
        >
          <CarouselContent className="-ml-4">
            {highlights.map((highlight) => {
              const imageUrl = imageMap[highlight.guest_name] || highlight.image_url;
              
              return (
                <CarouselItem key={highlight.id} className="pl-4 basis-full">
                  <div className="flex justify-center">
                    <div className="w-full max-w-[380px]">
                      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-glow hover:scale-[1.02] transition-transform mb-4">
                        <img
                          src={imageUrl}
                          alt={`${highlight.theme_title} com ${highlight.guest_name}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            console.error('Erro ao carregar imagem:', imageUrl);
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="380" height="676"%3E%3Crect fill="%23333" width="380" height="676"/%3E%3Ctext fill="%23fff" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImagem não disponível%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <div className="text-center space-y-1">
                        <h3 className="font-bold text-xl">{highlight.theme_title}</h3>
                        <p className="text-muted-foreground">Com {highlight.guest_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(highlight.event_date), "dd/MM", { locale: ptBR })} - {highlight.event_time.slice(0, 5)}hs
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </section>
  );
}
