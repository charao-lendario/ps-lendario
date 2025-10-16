import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
            {highlights.map((highlight) => (
              <CarouselItem key={highlight.id} className="pl-4 basis-full md:basis-1/2">
                <div className="flex justify-center">
                  <div className="relative w-full max-w-[380px] aspect-[9/16] rounded-2xl overflow-hidden shadow-glow group hover:scale-[1.02] transition-transform">
                    <img
                      src={highlight.image_url}
                      alt={`${highlight.theme_title} com ${highlight.guest_name}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Erro ao carregar imagem:', highlight.image_url);
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="380" height="676"%3E%3Crect fill="%23333" width="380" height="676"/%3E%3Ctext fill="%23fff" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImagem não disponível%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <span className="inline-block px-3 py-1 bg-primary/90 text-primary-foreground text-sm font-semibold rounded-full mb-2">
                        {highlight.tag}
                      </span>
                      <h3 className="text-white font-bold text-xl mb-1">{highlight.theme_title}</h3>
                      <p className="text-white/90 text-sm mb-1">com {highlight.guest_name}</p>
                      <p className="text-white/80 text-xs">
                        {format(new Date(highlight.event_date), "d 'de' MMMM", { locale: ptBR })} às {highlight.event_time.slice(0, 5)}
                      </p>
                    </div>
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
