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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Calendário</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card gradient-card">
          <CardHeader>
            <CardTitle>Selecione uma data</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              modifiers={{
                event: eventDates
              }}
              modifiersClassNames={{
                event: 'bg-primary/20 text-primary font-bold'
              }}
              className="rounded-md"
            />
          </CardContent>
        </Card>

        <Card className="shadow-card gradient-card">
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : 'Selecione uma data'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsOnSelectedDate.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum evento agendado para esta data
              </p>
            ) : (
              <div className="space-y-4">
                {eventsOnSelectedDate.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg border border-border bg-secondary/20 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{event.guests?.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{event.time}</Badge>
                        </div>
                        {event.guests?.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {event.guests.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    {event.room_link && (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => window.open(event.room_link, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Acessar Sala
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
