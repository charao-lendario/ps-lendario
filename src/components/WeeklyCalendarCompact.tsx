import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, ExternalLink, Instagram, Clock } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns';
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

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const { data: events } = useQuery({
    queryKey: ['calendar-events', format(weekStart, 'yyyy-MM-dd')],
    queryFn: async () => {
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
        .eq('status', 'scheduled')
        .gte('date', format(weekStart, 'yyyy-MM-dd'))
        .lte('date', format(weekEnd, 'yyyy-MM-dd'))
        .order('date')
        .order('time');
      
      if (error) throw error;
      return data as CalendarEvent[];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    const subscription = supabase
      .channel('calendar-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' },
        () => queryClient.invalidateQueries({ queryKey: ['calendar-events'] })
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient]);

  const getEventsForDay = (day: Date) => {
    if (!events) return [];
    return events.filter(event => isSameDay(parseISO(event.date), day));
  };

  const changeWeek = (weeks: number) => {
    setCurrentWeek(weeks > 0 ? addWeeks(currentWeek, weeks) : subWeeks(currentWeek, Math.abs(weeks)));
  };

  const goToToday = () => setCurrentWeek(new Date());

  return (
    <div className="w-full bg-background py-8">
      <div className="container mx-auto px-4 space-y-6">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold">
            {format(weekStart, "d 'de' MMM", { locale: ptBR })} - {format(weekEnd, "d 'de' MMM 'de' yyyy", { locale: ptBR })}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeWeek(-1)}
              className="hover-scale"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              onClick={goToToday}
            >
              Hoje
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeWeek(1)}
              className="hover-scale"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Week Days Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            const hasEvents = dayEvents.length > 0;
            const isTodayDay = isToday(day);
            
            return (
              <Card
                key={day.toISOString()}
                className={cn(
                  "gradient-card shadow-card hover:shadow-glow transition-smooth cursor-pointer",
                  isTodayDay && "border-2 border-primary",
                  hasEvents && "bg-green-500/10 border-green-500/50"
                )}
                onClick={() => dayEvents.length > 0 && setSelectedEvent(dayEvents[0])}
              >
                <CardContent className="p-4 space-y-3">
                  {/* Day Header */}
                  <div className="text-center space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-medium">
                      {format(day, 'EEEE', { locale: ptBR })}
                    </p>
                    <p className={cn(
                      "text-3xl font-bold",
                      isTodayDay && "text-primary",
                      hasEvents && "text-green-500"
                    )}>
                      {format(day, 'd')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(day, 'MMM', { locale: ptBR })}
                    </p>
                  </div>

                  {/* Events Indicator */}
                  <div className="space-y-2">
                    {hasEvents ? (
                      <>
                        <div className="flex items-center justify-center gap-1 text-green-500">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs font-semibold">{dayEvents.length} evento{dayEvents.length > 1 ? 's' : ''}</span>
                        </div>
                        
                        {/* Show first event time */}
                        <div className="flex items-center justify-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{dayEvents[0].time}</span>
                        </div>

                        {/* Guest name if available */}
                        {dayEvents[0].guests && (
                          <p className="text-xs text-center font-medium truncate">
                            {dayEvents[0].guests.name}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-center text-muted-foreground">
                        Sem eventos
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Event Detail Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Detalhes do Evento</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                {selectedEvent.guests?.avatar_url && (
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedEvent.guests.avatar_url} alt={selectedEvent.guests.name} />
                    <AvatarFallback>{selectedEvent.guests.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedEvent.guests?.name}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="default">{format(parseISO(selectedEvent.date), "d 'de' MMMM", { locale: ptBR })}</Badge>
                    <Badge variant="secondary">{selectedEvent.time}</Badge>
                    {selectedEvent.type && <Badge variant="outline">{selectedEvent.type}</Badge>}
                  </div>
                </div>
              </div>
              
              {selectedEvent.guests?.bio && (
                <div>
                  <h4 className="font-semibold mb-2">Sobre</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedEvent.guests.bio}</p>
                </div>
              )}

              {selectedEvent.guests?.social_links && (
                <div>
                  <h4 className="font-semibold mb-2">Redes Sociais</h4>
                  <div className="flex gap-2">
                    {selectedEvent.guests.social_links.instagram && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedEvent.guests.social_links.instagram, '_blank')}
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {selectedEvent.room_link && (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => window.open(selectedEvent.room_link, '_blank')}
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Acessar Sala Virtual
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
