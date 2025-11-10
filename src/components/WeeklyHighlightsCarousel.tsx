import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import dayCavalcantiImg from '@/assets/destaque-day-cavalcanti.png';
import joaoLozanoImg from '@/assets/destaque-joao-lozano.png';

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
    'Day Cavalcanti': dayCavalcantiImg,
    'João Lozano': joaoLozanoImg
  };

  // Map para definir os textos de recorrência
  const scheduleMap: Record<string, string> = {
    'Day Cavalcanti': 'Toda terça-feira as 18:30hs',
    'João Lozano': 'Toda quinta-feira as 18:30hs'
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 bg-secondary/20">
      <div className="container mx-auto">
        <Carousel 
          className="w-full max-w-7xl mx-auto"
          opts={{
            align: "center",
          }}
        >
          <CarouselContent>
            {highlights.map((highlight) => {
              const imageUrl = imageMap[highlight.guest_name] || highlight.image_url;
              
              return (
                <CarouselItem key={highlight.id}>
                  <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
                    {/* Left side - Text content */}
                    <div className="space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1">
                      <div className="space-y-1 sm:space-y-2">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Destaques.</h2>
                        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-muted-foreground">Especialista da Semana.</p>
                      </div>
                      
                      <div className="w-full h-px bg-white/20"></div>
                      
                      <div className="space-y-2 sm:space-y-3">
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">Tema - {highlight.theme_title}</h3>
                        <p className="text-lg sm:text-xl text-muted-foreground">com {highlight.guest_name}</p>
                        <p className="text-base sm:text-lg text-muted-foreground">
                          {scheduleMap[highlight.guest_name] || `${format(parseISO(highlight.event_date), "dd/MM", { locale: ptBR })} - ${highlight.event_time.slice(0, 5)}`}
                        </p>
                      </div>
                    </div>

                    {/* Right side - Image */}
                    <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                      <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px]">
                        <div className="relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden shadow-glow hover:scale-[1.02] transition-transform">
                          <img
                            src={imageUrl}
                            alt={`${highlight.theme_title} com ${highlight.guest_name}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              console.error('Erro ao carregar imagem:', imageUrl);
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="711"%3E%3Crect fill="%23333" width="400" height="711"/%3E%3Ctext fill="%23fff" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImagem não disponível%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex left-2 sm:left-4" />
          <CarouselNext className="hidden sm:flex right-2 sm:right-4" />
        </Carousel>
      </div>
    </section>
  );
}
