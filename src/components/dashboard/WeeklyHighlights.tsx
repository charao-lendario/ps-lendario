import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { isToday, isTomorrow, startOfWeek, endOfWeek, format } from 'date-fns';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { GuestCard } from '@/components/GuestCard';
import eventoCyberSecurity from '@/assets/evento-cyber-security.png';
import eventoDiscovery from '@/assets/evento-discovery.png';

export function WeeklyHighlights() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['weekly-events'],
    queryFn: async () => {
      const today = new Date();
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          guests (
            id,
            name,
            bio,
            avatar_url,
            social_links
          )
        `)
        .gte('date', format(weekStart, 'yyyy-MM-dd'))
        .lte('date', format(weekEnd, 'yyyy-MM-dd'))
        .eq('status', 'scheduled')
        .order('date')
        .order('time');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const getDateBadge = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return { label: 'Hoje', variant: 'default' as const };
    if (isTomorrow(date)) return { label: 'Amanhã', variant: 'secondary' as const };
    return { label: 'Esta semana', variant: 'outline' as const };
  };

  const highlightImages = [eventoCyberSecurity, eventoDiscovery];

  if (!events || events.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Destaques da Semana</h2>
        
        {/* Carrossel de Imagens */}
        <Carousel className="w-full max-w-2xl mx-auto">
          <CarouselContent>
            {highlightImages.map((image, index) => (
              <CarouselItem key={index}>
                <Card className="gradient-card shadow-glow overflow-hidden border-0">
                  <img
                    src={image}
                    alt={`Destaque ${index + 1}`}
                    className="w-full h-[300px] md:h-[400px] object-cover rounded-lg"
                  />
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
        
        <Card className="shadow-card gradient-card">
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum convidado especial esta semana
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <section className="w-full space-y-8">
      <h2 className="text-3xl font-bold">Destaques da Semana</h2>
      
      {/* Carrossel de Imagens */}
      <Carousel className="w-full max-w-2xl mx-auto">
        <CarouselContent>
          {highlightImages.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="gradient-card shadow-glow overflow-hidden border-0">
                <img
                  src={image}
                  alt={`Destaque ${index + 1}`}
                  className="w-full h-[300px] md:h-[400px] object-cover rounded-lg"
                />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
      
      {/* Grid de Cards Compactos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => {
          const dateBadge = getDateBadge(event.date);
          const guest = event.guests;

          return (
            <GuestCard
              key={event.id}
              guest={{
                name: guest?.name || 'Convidado',
                bio: guest?.bio,
                avatar_url: guest?.avatar_url,
                social_links: guest?.social_links as any,
              }}
              event={{
                id: event.id,
                date: event.date,
                time: event.time,
                topic: guest?.name,
                room_link: event.room_link,
              }}
              dateBadge={dateBadge}
            />
          );
        })}
      </div>
    </section>
  );
}