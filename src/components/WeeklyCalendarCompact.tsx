import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, ExternalLink, Instagram, Linkedin, Clock } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay, isToday, parseISO, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
interface CalendarEvent {
  id: string;
  date: string;
  time: string;
  type?: string;
  status: string;
  room_link?: string;
  schedule_id?: string;
  guests?: {
    id: string;
    name: string;
    bio?: string;
    avatar_url?: string;
    social_links?: any;
  };
}
export default function WeeklyCalendarCompact() {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const queryClient = useQueryClient();
  const weekStart = startOfWeek(currentWeek, {
    weekStartsOn: 0
  });
  const weekEnd = endOfWeek(currentWeek, {
    weekStartsOn: 0
  });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: weekEnd
  });
  const {
    data: events
  } = useQuery({
    queryKey: ['calendar-events', format(weekStart, 'yyyy-MM-dd')],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('events').select(`
          *,
          guests (
            id,
            name,
            bio,
            avatar_url,
            social_links
          )
        `).eq('status', 'scheduled').gte('date', format(weekStart, 'yyyy-MM-dd')).lte('date', format(weekEnd, 'yyyy-MM-dd')).order('date').order('time');
      if (error) throw error;
      return data as CalendarEvent[];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });
  useEffect(() => {
    const subscription = supabase.channel('calendar-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'events'
    }, () => queryClient.invalidateQueries({
      queryKey: ['calendar-events']
    })).subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient]);
  const getEventsForDay = (day: Date) => {
    if (!events) return [];
    return events.filter(event => isSameDay(parseISO(event.date), day));
  };
  const isMarketingSlot = (date: Date, time: string) => {
    const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, etc.
    // Marketing: Terça (2) e Quinta (4) às 18:30
    return [2, 4].includes(dayOfWeek) && time === '18:30:00';
  };
  const getEventTypeColor = (type?: string) => {
    return {
      bg: 'bg-primary/10',
      border: 'border-primary/50',
      text: 'text-primary',
      dot: 'bg-primary'
    };
  };
  const changeWeek = (weeks: number) => {
    setCurrentWeek(weeks > 0 ? addWeeks(currentWeek, weeks) : subWeeks(currentWeek, Math.abs(weeks)));
  };
  const goToToday = () => setCurrentWeek(new Date());
  return <div className="w-full bg-background py-8">
      <div className="container mx-auto px-4 space-y-6">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold">
            {format(weekStart, "d 'de' MMM", {
            locale: ptBR
          })} - {format(weekEnd, "d 'de' MMM 'de' yyyy", {
            locale: ptBR
          })}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => changeWeek(-1)} className="hover-scale">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="default" onClick={goToToday}>
              Hoje
            </Button>
            <Button variant="outline" size="icon" onClick={() => changeWeek(1)} className="hover-scale">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Week Days Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {weekDays.map(day => {
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;
          const isTodayDay = isToday(day);
          const eventColor = hasEvents ? getEventTypeColor(dayEvents[0].type) : null;
          return <Card key={day.toISOString()} className={cn("gradient-card shadow-card hover:shadow-glow transition-smooth cursor-pointer", isTodayDay && "border-2 border-primary", hasEvents && eventColor && `${eventColor.bg} ${eventColor.border}`)} onClick={() => dayEvents.length > 0 && setSelectedEvent(dayEvents[0])}>
                <CardContent className="p-4 space-y-3">
                  {/* Day Header */}
                  <div className="text-center space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-medium">
                      {format(day, 'EEEE', {
                    locale: ptBR
                  })}
                    </p>
                    <p className={cn("text-3xl font-bold", isTodayDay && "text-primary", hasEvents && eventColor && eventColor.text)}>
                      {format(day, 'd')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(day, 'MMM', {
                    locale: ptBR
                  })}
                    </p>
                  </div>

                  {/* Events Indicator */}
                  <div className="space-y-2">
                    {hasEvents ? <>
                        <div className={cn("flex items-center justify-center gap-1", eventColor && eventColor.text)}>
                          <div className={cn("w-2 h-2 rounded-full animate-pulse", eventColor && eventColor.dot)} />
                          <span className="text-xs font-semibold">{dayEvents.length} evento{dayEvents.length > 1 ? 's' : ''}</span>
                        </div>
                        
                        {/* Show first event time */}
                        <div className="flex items-center justify-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{dayEvents[0].time.slice(0, 5)}hs</span>
                        </div>

                        {/* Guest name if available */}
                        {dayEvents[0].guests && <p className="text-xs text-center font-medium truncate">
                            {dayEvents[0].guests.name}
                          </p>}

                        {/* Event Tags */}
                        <div className="flex flex-wrap gap-1 justify-center">
                          {isMarketingSlot(day, dayEvents[0].time) ? (
                            <Badge className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-500 border-yellow-500/30 font-bold">
                              Marketing
                            </Badge>
                          ) : (
                            dayEvents[0].guests && (
                              <Badge className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-500 border-purple-500/30 font-bold">
                                Convidado
                              </Badge>
                            )
                          )}
                        </div>
                      </> : <p className="text-xs text-center text-muted-foreground">
                        Sem eventos
                      </p>}
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>
      </div>

      {/* Event Detail Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Detalhes do Evento</DialogTitle>
          </DialogHeader>
          {selectedEvent && <div className="space-y-6">
              <div className="flex items-start gap-4">
                {selectedEvent.guests?.avatar_url && <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedEvent.guests.avatar_url} alt={selectedEvent.guests.name} />
                    <AvatarFallback>{selectedEvent.guests.name[0]}</AvatarFallback>
                  </Avatar>}
                  <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedEvent.guests?.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="default">{format(parseISO(selectedEvent.date), "d 'de' MMMM", {
                    locale: ptBR
                  })}</Badge>
                    <Badge variant="secondary">{selectedEvent.time.slice(0, 5)}hs</Badge>
                    {isMarketingSlot(parseISO(selectedEvent.date), selectedEvent.time) && <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 font-bold">
                        Marketing
                      </Badge>}
                    {selectedEvent.guests && <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30 font-bold">
                        Convidado
                      </Badge>}
                  </div>
                </div>
              </div>
              
              {selectedEvent.guests?.bio && <div>
                  <h4 className="font-semibold mb-2">Sobre</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedEvent.guests.bio}</p>
                </div>}

              {selectedEvent.guests?.social_links && <div>
                  <h4 className="font-semibold mb-2">Redes Sociais</h4>
                  <div className="flex gap-2">
                    {selectedEvent.guests.social_links.linkedin && <Button variant="outline" size="sm" onClick={() => window.open(selectedEvent.guests.social_links.linkedin, '_blank')}>
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>}
                    {selectedEvent.guests.social_links.instagram && <Button variant="outline" size="sm" onClick={() => window.open(selectedEvent.guests.social_links.instagram, '_blank')}>
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram
                      </Button>}
                  </div>
                </div>}

              <Button size="lg" className="w-full" onClick={() => window.open('https://membros.academialendaria.ai/m/lessons/pronto-socorro', '_blank')}>
                <ExternalLink className="mr-2 h-5 w-5" />
                Acessar Sala Virtual
              </Button>
            </div>}
        </DialogContent>
      </Dialog>
    </div>;
}