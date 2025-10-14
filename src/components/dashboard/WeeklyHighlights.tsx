import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { isToday, isTomorrow, startOfWeek, endOfWeek, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { OverlappingCarousel } from '@/components/OverlappingCarousel';
import { VideoCarousel } from '@/components/VideoCarousel';

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

  if (!events || events.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Depoimentos de Alunos</h2>
        
        {/* Carrossel de Vídeos */}
        <VideoCarousel />
        
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
      <h2 className="text-3xl font-bold text-center">Depoimentos de Alunos</h2>
      
      {/* Carrossel de Vídeos */}
      <VideoCarousel />
      
      {/* Desktop: Overlapping Carousel */}
      <div className="hidden lg:block">
        <OverlappingCarousel 
          items={events.map((event) => {
            const guest = event.guests;
            return {
              guest: {
                name: guest?.name || 'Convidado',
                bio: guest?.bio,
                avatar_url: guest?.avatar_url,
                social_links: guest?.social_links as any,
              },
              event: {
                id: event.id,
                date: event.date,
                time: event.time,
                topic: guest?.name,
                room_link: event.room_link,
              }
            };
          })}
        />
      </div>

      {/* Mobile/Tablet: Grid Layout */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => {
            const guest = event.guests;
            const dateBadge = getDateBadge(event.date);
            const formattedDate = format(new Date(event.date), "dd 'de' MMMM", { locale: ptBR });
            
            return (
              <div key={event.id} className="mx-auto">
                <div
                  className="relative w-full max-w-[320px] aspect-square rounded-lg overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-2xl"
                  role="article"
                  aria-label={`Evento: Monitoria com ${guest?.name}`}
                >
                  {guest?.avatar_url ? (
                    <img
                      src={`${guest.avatar_url}?quality=90`}
                      alt={`${guest.name} - Monitoria`}
                      className="absolute inset-0 w-full h-full object-cover object-center brightness-90"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-secondary/50" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white leading-tight line-clamp-2">
                        Monitoria
                      </h3>
                      <p className="text-sm text-white/80">
                        Com {guest?.name || 'Convidado'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="text-sm text-white/80">
                        <span>{formattedDate}</span>
                      </div>
                      <div className="text-sm text-accent font-semibold">
                        {event.time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}