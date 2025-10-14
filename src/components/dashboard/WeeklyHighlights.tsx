import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink, Loader2, Linkedin, Instagram } from 'lucide-react';
import { format, isToday, isTomorrow, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Destaques da Semana</h2>
        <Card className="shadow-card gradient-card">
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum convidado especial esta semana
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Destaques da Semana</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const dateBadge = getDateBadge(event.date);
          const guest = event.guests;
          const socialLinks = guest?.social_links as any || {};

          return (
            <Card key={event.id} className="shadow-card gradient-card hover:shadow-glow transition-smooth overflow-hidden">
              <div className="aspect-[3/4] bg-secondary relative">
                {guest?.avatar_url ? (
                  <img
                    src={guest.avatar_url}
                    alt={guest.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Avatar className="h-32 w-32">
                      <AvatarFallback className="text-4xl">
                        {guest?.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Badge variant={dateBadge.variant}>{dateBadge.label}</Badge>
                  <h3 className="text-xl font-bold">{guest?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.date), "dd 'de' MMMM", { locale: ptBR })} às {event.time}
                  </p>
                  {guest?.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{guest.bio}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  {socialLinks.linkedin && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(socialLinks.linkedin, '_blank')}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  )}
                  {socialLinks.instagram && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(socialLinks.instagram, '_blank')}
                    >
                      <Instagram className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {event.room_link && (
                  <Button
                    className="w-full"
                    onClick={() => window.open(event.room_link, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Acessar Sala
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}