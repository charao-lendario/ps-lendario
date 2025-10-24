import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

export function MonthlyCalendar() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const { data: events, isLoading } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          guests (
            id,
            name,
            bio,
            avatar_url
          )
        `)
        .eq('status', 'scheduled')
        .order('date')
        .order('time');
      
      if (error) throw error;
      return data;
    },
  });

  const getEventsForDate = (date: Date) => {
    const dayOfWeek = getDay(date);
    const guestEvent = events?.find(e => 
      isSameDay(new Date(e.date), date) && e.guests && e.type !== 'technical'
    );
    
    // Segunda (1), Quarta (3), Sexta (5)
    if ([1, 3, 5].includes(dayOfWeek)) {
      return {
        morning: guestEvent ? {
          name: guestEvent.guests?.name || '',
          badge: { text: 'Convidado', color: 'bg-purple-500' }
        } : {
          name: 'Lucas Charão',
          badge: { text: 'Estratégico', color: 'bg-blue-500' }
        },
        evening: {
          name: 'Adávio Tittoni',
          badge: { text: 'Técnico', color: 'bg-green-500' }
        }
      };
    }
    
    // Terça (2), Quinta (4)
    if ([2, 4].includes(dayOfWeek)) {
      return {
        morning: guestEvent ? {
          name: guestEvent.guests?.name || '',
          badge: { text: 'Convidado', color: 'bg-purple-500' }
        } : null,
        evening: {
          name: 'Marketing',
          badge: { text: 'Marketing', color: 'bg-yellow-500' }
        }
      };
    }
    
    return { morning: null, evening: null };
  };

  // Gerar os dias do calendário
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold">Calendário de Eventos</h2>
        <p className="text-muted-foreground text-lg">
          Confira os próximos convidados e eventos especiais
        </p>
      </div>
      
      <Card className="shadow-glow gradient-card border-2 border-primary/20">
        <CardContent className="p-4 md:p-8">
          {/* Header do Calendário */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Dias da Semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center font-bold text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Grade de Dias */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date) => {
              const dayEvents = getEventsForDate(date);
              const isToday = isSameDay(date, new Date());
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              
              return (
                <div
                  key={date.toISOString()}
                  className={`min-h-[100px] p-1 border rounded-lg ${
                    isToday ? 'border-primary border-2 bg-primary/5' : 'border-border/30'
                  } ${!isCurrentMonth ? 'opacity-30' : ''}`}
                >
                  <div className="text-xs font-bold mb-1">{format(date, 'd')}</div>
                  <div className="space-y-1">
                    {dayEvents.morning && (
                      <div className="text-[9px] leading-tight bg-background/50 rounded p-1">
                        <Badge className={`${dayEvents.morning.badge.color} text-white text-[7px] px-1 py-0 mb-0.5`}>
                          10h
                        </Badge>
                        <div className="truncate font-medium">{dayEvents.morning.name}</div>
                      </div>
                    )}
                    {dayEvents.evening && (
                      <div className="text-[9px] leading-tight bg-background/50 rounded p-1">
                        <Badge className={`${dayEvents.evening.badge.color} text-white text-[7px] px-1 py-0 mb-0.5`}>
                          18:30
                        </Badge>
                        <div className="truncate font-medium">{dayEvents.evening.name}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
