import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';
import { format, isSameDay, startOfWeek, endOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function MonthlyCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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

  const eventDates = events?.map(event => new Date(event.date)) || [];

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
        <CardContent className="p-8 md:p-12">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={ptBR}
            modifiers={{
              event: eventDates
            }}
            modifiersClassNames={{
              event: 'bg-primary/5'
            }}
            components={{
              Day: ({ date, ...props }) => {
                const dayEvents = getEventsForDate(date);
                const isToday = isSameDay(date, new Date());
                
                return (
                  <div 
                    className={`relative p-2 min-h-[120px] border rounded-lg ${
                      isToday ? 'border-primary/50 bg-primary/10' : 'border-border/30'
                    } ${selectedDate && isSameDay(date, selectedDate) ? 'ring-2 ring-primary' : ''}`}
                  >
                    <div className="text-sm font-bold mb-2">{format(date, 'd')}</div>
                    <div className="space-y-1">
                      {dayEvents.morning && (
                        <div className="text-[10px] leading-tight">
                          <Badge className={`${dayEvents.morning.badge.color} text-white text-[8px] px-1 py-0`}>
                            10h
                          </Badge>
                          <div className="truncate font-medium mt-0.5">{dayEvents.morning.name}</div>
                        </div>
                      )}
                      {dayEvents.evening && (
                        <div className="text-[10px] leading-tight">
                          <Badge className={`${dayEvents.evening.badge.color} text-white text-[8px] px-1 py-0`}>
                            18:30
                          </Badge>
                          <div className="truncate font-medium mt-0.5">{dayEvents.evening.name}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            }}
            className="w-full mx-auto max-w-7xl [&_table]:w-full [&_td]:p-1 [&_th]:p-2 [&_.rdp-caption]:text-3xl [&_.rdp-caption]:font-bold [&_.rdp-caption]:mb-8 [&_th]:text-lg [&_th]:font-bold"
          />
        </CardContent>
      </Card>

    </div>
  );
}
