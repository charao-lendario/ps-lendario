import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
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

  const eventsOnSelectedDate = events?.filter(event => 
    selectedDate && isSameDay(new Date(event.date), selectedDate)
  ) || [];

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
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold">Calendário de Eventos</h2>
        <p className="text-muted-foreground text-lg">
          Confira os próximos convidados e eventos especiais
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 shadow-card gradient-card">
          <CardContent className="p-8">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              modifiers={{
                event: eventDates
              }}
              modifiersClassNames={{
                event: 'relative bg-gradient-primary text-primary-foreground font-bold hover:scale-110 transition-smooth after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-accent after:rounded-full shadow-glow'
              }}
              className="rounded-md w-full [&_td]:p-3 [&_th]:p-3 [&_button]:h-16 [&_button]:w-16 [&_button]:text-lg [&_.rdp-caption]:text-2xl [&_.rdp-caption]:font-bold [&_.rdp-caption]:mb-6"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-card gradient-card">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              {selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : 'Selecione uma data'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsOnSelectedDate.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground text-lg">
                  Nenhum evento agendado para esta data
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {eventsOnSelectedDate.map((event) => (
                  <div
                    key={event.id}
                    className="p-5 rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent space-y-3 hover:shadow-glow transition-smooth"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <h3 className="font-bold text-xl">{event.guests?.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="text-base px-3 py-1">
                            {event.time}
                          </Badge>
                        </div>
                        {event.guests?.bio && (
                          <p className="text-sm text-muted-foreground">
                            {event.guests.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    {event.room_link && (
                      <Button
                        size="lg"
                        className="w-full"
                        onClick={() => window.open(event.room_link, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-5 w-5" />
                        Acessar Sala Virtual
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
