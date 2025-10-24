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

  const isMarketingSlot = (date: Date, time: string) => {
    const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, etc.
    // Marketing: Terça (2) e Quinta (4) às 18:30
    return [2, 4].includes(dayOfWeek) && time === '18:30:00';
  };

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

  const eventsOnSelectedDate = events?.filter(event => 
    selectedDate && isSameDay(new Date(event.date), selectedDate)
  ) || [];

  const eventDates = events?.map(event => new Date(event.date)) || [];
  
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 });
  
  const currentWeekDates = [];
  for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
    currentWeekDates.push(new Date(d));
  }

  // Determinar os eventos do dia selecionado
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return { slot1: null, slot2: null };
    
    const dayOfWeek = getDay(selectedDate);
    const guestEvent = eventsOnSelectedDate.find(e => e.guests && e.type !== 'technical');
    
    // Segunda (1), Quarta (3), Sexta (5)
    if ([1, 3, 5].includes(dayOfWeek)) {
      return {
        slot1: {
          name: 'Adávio Tittoni',
          time: '18:30',
          type: 'technical',
          badge: { text: 'Técnico', color: 'bg-green-500/20 text-green-500 border-green-500/30' },
          bio: undefined
        },
        slot2: guestEvent ? {
          name: guestEvent.guests?.name || '',
          time: guestEvent.time.slice(0, 5),
          type: 'guest',
          bio: guestEvent.guests?.bio,
          badge: { text: 'Convidado', color: 'bg-purple-500/20 text-purple-500 border-purple-500/30' }
        } : {
          name: 'Lucas Charão',
          time: '20:00',
          type: 'strategic',
          badge: { text: 'Estratégico', color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
          bio: undefined
        }
      };
    }
    
    // Terça (2), Quinta (4)
    if ([2, 4].includes(dayOfWeek)) {
      return {
        slot1: {
          name: 'Marketing',
          time: '18:30',
          type: 'marketing',
          badge: { text: 'Marketing', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' },
          bio: undefined
        },
        slot2: guestEvent ? {
          name: guestEvent.guests?.name || '',
          time: guestEvent.time.slice(0, 5),
          type: 'guest',
          bio: guestEvent.guests?.bio,
          badge: { text: 'Convidado', color: 'bg-purple-500/20 text-purple-500 border-purple-500/30' }
        } : null
      };
    }
    
    return { slot1: null, slot2: null };
  };

  const dayEvents = getEventsForSelectedDate();

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
              event: eventDates,
              currentWeek: currentWeekDates
            }}
            modifiersClassNames={{
              event: 'relative bg-gradient-primary text-primary-foreground font-bold hover:scale-110 transition-smooth after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-2 after:h-2 after:bg-accent after:rounded-full shadow-glow animate-pulse',
              currentWeek: 'bg-primary/10 border-2 border-primary/30 font-semibold'
            }}
            className="w-full mx-auto max-w-6xl [&_table]:w-full [&_td]:p-4 [&_th]:p-4 [&_button]:h-20 [&_button]:w-full [&_button]:text-xl [&_button]:font-semibold [&_.rdp-caption]:text-3xl [&_.rdp-caption]:font-bold [&_.rdp-caption]:mb-8 [&_th]:text-lg [&_th]:font-bold"
          />
        </CardContent>
      </Card>

      {selectedDate && (
        <Card className="shadow-card gradient-card border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              Eventos - {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Primeiro Slot de Evento */}
              {dayEvents.slot1 ? (
                <div className="p-6 rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent space-y-4 hover:shadow-glow transition-smooth animate-fade-in">
                  <div className="space-y-3">
                    <h3 className="font-bold text-2xl">{dayEvents.slot1.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default" className="text-base px-4 py-2">
                        {dayEvents.slot1.time}hs
                      </Badge>
                      <Badge className={`text-base px-4 py-2 font-bold ${dayEvents.slot1.badge.color}`}>
                        {dayEvents.slot1.badge.text}
                      </Badge>
                    </div>
                    {dayEvents.slot1.bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {dayEvents.slot1.bio}
                      </p>
                    )}
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => window.open('https://membros.academialendaria.ai/m/lessons/pronto-socorro', '_blank')}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Acessar Sala Virtual
                  </Button>
                </div>
              ) : (
                <div className="p-6 rounded-lg border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/10 to-transparent space-y-4 min-h-[250px] flex flex-col">
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold text-primary/30">1</div>
                      <p className="text-sm text-muted-foreground">Sem evento agendado</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Segundo Slot de Evento */}
              {dayEvents.slot2 ? (
                <div className="p-6 rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent space-y-4 hover:shadow-glow transition-smooth animate-fade-in">
                  <div className="space-y-3">
                    <h3 className="font-bold text-2xl">{dayEvents.slot2.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default" className="text-base px-4 py-2">
                        {dayEvents.slot2.time}hs
                      </Badge>
                      <Badge className={`text-base px-4 py-2 font-bold ${dayEvents.slot2.badge.color}`}>
                        {dayEvents.slot2.badge.text}
                      </Badge>
                    </div>
                    {dayEvents.slot2.bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {dayEvents.slot2.bio}
                      </p>
                    )}
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => window.open('https://membros.academialendaria.ai/m/lessons/pronto-socorro', '_blank')}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Acessar Sala Virtual
                  </Button>
                </div>
              ) : (
                <div className="p-6 rounded-lg border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/10 to-transparent space-y-4 min-h-[250px] flex flex-col">
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold text-primary/30">2</div>
                      <p className="text-sm text-muted-foreground">Sem evento agendado</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
