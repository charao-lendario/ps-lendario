import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isToday, getDay } from 'date-fns';
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
    const dayOfWeek = getDay(day); // 0 = Domingo, 1 = Segunda, etc.
    
    // Segunda (1), Quarta (3), Sexta (5)
    if ([1, 3, 5].includes(dayOfWeek)) {
      return [
        { time: '10:00', name: 'Lucas Charão', type: 'strategic' },
        { time: '18:30', name: 'Adávio Tittoni', type: 'technical' }
      ];
    }
    
    // Terça (2)
    if (dayOfWeek === 2) {
      return [
        { time: '10:00', name: 'Adávio Tittoni', type: 'technical' },
        { time: '18:30', name: 'Day Cavalcanti', type: 'marketing' }
      ];
    }
    
    // Quinta (4)
    if (dayOfWeek === 4) {
      return [
        { time: '10:00', name: 'Adávio Tittoni', type: 'technical' },
        { time: '18:30', name: 'João Lozano', type: 'marketing' }
      ];
    }
    
    return [];
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
          const isWeekend = getDay(day) === 0 || getDay(day) === 6;
          
          return <Card key={day.toISOString()} className={cn("gradient-card shadow-card transition-smooth", isTodayDay && "border-2 border-primary", isWeekend && "opacity-50")}>
                <CardContent className="p-4 space-y-3">
                  {/* Day Header */}
                  <div className="text-center space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-medium">
                      {format(day, 'EEEE', {
                    locale: ptBR
                  })}
                    </p>
                    <p className={cn("text-3xl font-bold", isTodayDay && "text-primary")}>
                      {format(day, 'd')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(day, 'MMM', {
                    locale: ptBR
                  })}
                    </p>
                  </div>

                  {/* Events List */}
                  <div className="space-y-2">
                    {hasEvents ? (
                      <>
                        {dayEvents.map((event, idx) => (
                          <div key={idx} className="p-2 bg-background/50 rounded border border-border/20">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span className="text-[10px]">{event.time}</span>
                              </div>
                              <Badge className={cn("text-[9px] px-1.5 py-0", 
                                event.type === 'technical' && "bg-green-500/20 text-green-500 border-green-500/30",
                                event.type === 'marketing' && "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
                                event.type === 'strategic' && "bg-blue-500/20 text-blue-500 border-blue-500/30"
                              )}>
                                {event.type === 'technical' ? 'Técnico' : 
                                 event.type === 'marketing' ? 'Marketing' : 'Estratégico'}
                              </Badge>
                            </div>
                            <p className="text-xs font-medium truncate">{event.name}</p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-xs text-center text-muted-foreground py-2">
                        Sem eventos
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>
        
        {/* Schedule Note */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground italic">
            *Programação sujeita a alteração sem aviso prévio.
          </p>
        </div>
      </div>
    </div>;
}