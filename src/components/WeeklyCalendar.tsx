import { useState, useEffect, memo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, ExternalLink, Instagram, Linkedin } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay, isToday, parseISO, addMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

interface EventCardProps {
  event: CalendarEvent;
  onClick: () => void;
}

const EventCard = memo(({ event, onClick }: EventCardProps) => {
  const typeColors = {
    'Estratégico': 'bg-accent/20 border-l-4 border-accent',
    'Técnico': 'bg-blue-500/20 border-l-4 border-blue-500',
    'Marketing': 'bg-purple-500/20 border-l-4 border-purple-500',
    'default': 'bg-primary/20 border-l-4 border-primary'
  };

  const typeColor = typeColors[event.type as keyof typeof typeColors] || typeColors.default;

  return (
    <button
      onClick={onClick}
      className={`${typeColor} w-full text-left p-2 rounded-md relative group hover:scale-[1.02] transition-smooth cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent`}
      aria-label={`Evento ${event.type || 'Monitoria'} às ${event.time}`}
    >
      <div className="text-xs font-semibold text-foreground">{event.time}</div>
      {event.guests && (
        <>
          <div className="text-sm font-medium text-foreground truncate mt-1">
            {event.guests.name}
          </div>
        </>
      )}
      {event.type && (
        <Badge className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5">
          {event.type}
        </Badge>
      )}
    </button>
  );
});

EventCard.displayName = 'EventCard';

interface WeeklyCalendarProps {
  initialDate?: Date;
}

export default function WeeklyCalendar({ initialDate }: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState<Date>(initialDate || new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const queryClient = useQueryClient();

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const { data: events, isLoading } = useQuery({
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

  const timeSlots = Array.from({ length: 23 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const getEventsForDayAndTime = (day: Date, timeSlot: string) => {
    if (!events) return [];
    return events.filter(event => 
      isSameDay(parseISO(event.date), day) && event.time === timeSlot
    );
  };

  const getEventsForDay = (day: Date) => {
    if (!events) return [];
    return events.filter(event => isSameDay(parseISO(event.date), day));
  };

  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const goToToday = () => setCurrentWeek(new Date());

  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    if (hours < 9 || hours >= 20) return null;
    
    const totalMinutes = (hours - 9) * 60 + minutes;
    const percentage = (totalMinutes / (11 * 60)) * 100;
    return percentage;
  };

  const currentTimePosition = getCurrentTimePosition();

  return (
    <div className="w-full bg-background py-4">
      {/* Week Navigation */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="h-12 container mx-auto px-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {format(weekStart, "d 'de' MMMM", { locale: ptBR })} - {format(weekEnd, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousWeek}
              className="hover:scale-110 transition-smooth"
              aria-label="Semana anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              onClick={goToToday}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Hoje
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextWeek}
              className="hover:scale-110 transition-smooth"
              aria-label="Próxima semana"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:block container mx-auto px-4 py-3">
        <div className="grid grid-cols-8 gap-0 border border-border rounded-lg overflow-hidden">
          {/* Header Row */}
          <div className="sticky top-12 z-20 bg-card border-b-2 border-border col-span-1"></div>
          {weekDays.map(day => {
            const hasEvents = getEventsForDay(day).length > 0;
            return (
              <div 
                key={day.toISOString()} 
                className={`sticky top-12 z-20 bg-card border-b-2 border-border p-2 text-center transition-colors ${
                  isToday(day) ? 'bg-primary/10' : ''
                } ${hasEvents ? 'bg-green-500/10 border-b-green-500/50' : ''}`}
              >
                <div className="text-xs font-medium text-muted-foreground">
                  {format(day, 'EEE', { locale: ptBR })}
                </div>
                <div className={`text-lg font-bold ${isToday(day) ? 'text-accent' : ''} ${hasEvents ? 'text-green-500' : ''}`}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}

          {/* Time Slots */}
          {timeSlots.map((timeSlot, idx) => (
            <div key={timeSlot} className="contents">
              {/* Time Column */}
              <div className={`sticky left-0 z-10 bg-card p-1.5 text-right text-xs text-muted-foreground border-r border-border ${idx % 2 === 0 ? 'border-t-2' : 'border-t'} border-border/50`}>
                {timeSlot}
              </div>
              
              {/* Day Columns */}
              {weekDays.map(day => {
                const dayEvents = getEventsForDayAndTime(day, timeSlot);
                const isCurrentDay = isToday(day);
                const hasEventsDay = getEventsForDay(day).length > 0;
                const slotTime = parseInt(timeSlot.split(':')[0]) * 60 + parseInt(timeSlot.split(':')[1]);
                const showTimeLine = isCurrentDay && currentTimePosition !== null && 
                  slotTime <= (9 * 60 + (currentTimePosition / 100) * (11 * 60)) && 
                  slotTime + 30 > (9 * 60 + (currentTimePosition / 100) * (11 * 60));
                
                return (
                  <div 
                    key={`${day.toISOString()}-${timeSlot}`}
                    className={`relative min-h-[60px] p-1.5 ${idx % 2 === 0 ? 'border-t-2' : 'border-t'} border-border/50 hover:bg-muted/30 transition-colors ${
                      isCurrentDay ? 'bg-primary/5' : ''
                    } ${hasEventsDay ? 'bg-green-500/5' : ''}`}
                  >
                    {showTimeLine && (
                      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 z-10 animate-pulse" />
                    )}
                    {dayEvents.length > 0 ? (
                      <div className="space-y-0.5">
                        {dayEvents.map(event => (
                          <EventCard 
                            key={event.id} 
                            event={event} 
                            onClick={() => setSelectedEvent(event)}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Stack */}
      <div className="md:hidden container mx-auto px-4 py-3 space-y-3">
        {weekDays.slice(0, 3).map(day => {
          const dayEvents = events?.filter(event => isSameDay(parseISO(event.date), day)) || [];
          const hasEvents = dayEvents.length > 0;
          return (
            <Card 
              key={day.toISOString()} 
              className={`${isToday(day) ? 'border-accent' : ''} ${hasEvents ? 'border-green-500/50 bg-green-500/5' : ''}`}
            >
              <CardHeader className="p-3">
                <CardTitle className="flex justify-between items-center text-base">
                  <span className={hasEvents ? 'text-green-500' : ''}>
                    {format(day, "EEEE, d 'de' MMMM", { locale: ptBR })}
                  </span>
                  {isToday(day) && <Badge variant="default">Hoje</Badge>}
                  {hasEvents && !isToday(day) && <Badge className="bg-green-500">Com eventos</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                {dayEvents.length > 0 ? (
                  <div className="space-y-1.5">
                    {dayEvents.map(event => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onClick={() => setSelectedEvent(event)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-2 text-sm">Nenhum evento</p>
                )}
              </CardContent>
            </Card>
          );
        })}
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
                    {selectedEvent.guests.social_links.linkedin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedEvent.guests.social_links.linkedin, '_blank')}
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    )}
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

              <Button
                size="lg"
                className="w-full"
                onClick={() => window.open('https://membros.academialendaria.ai/m/lessons/pronto-socorro', '_blank')}
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Acessar Sala Virtual
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
