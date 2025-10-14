import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const TIMES = ['10:00', '18:30'];

export function ScheduleGrid() {
  const { data: schedules, isLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select(`
          *,
          hosts (
            id,
            name,
            role
          )
        `)
        .order('day_of_week')
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

  const getScheduleForSlot = (day: number, time: string) => {
    return schedules?.find(
      (s) => s.day_of_week === day && s.time === time
    );
  };

  const getTypeColor = (type: string) => {
    const colors = {
      estrategico: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      tecnico: 'bg-green-500/20 text-green-400 border-green-500/30',
      marketing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return colors[type as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Grade de Horários</h2>
      
      <Card className="shadow-card gradient-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Header Row */}
            <div className="hidden md:block font-semibold text-center">Horário</div>
            {DAYS.map((day) => (
              <div key={day} className="hidden md:block font-semibold text-center">
                {day}
              </div>
            ))}

            {/* Schedule Grid */}
            {TIMES.map((time) => (
              <>
                <div key={`time-${time}`} className="md:flex items-center justify-center font-semibold hidden">
                  {time}
                </div>
                {DAYS.map((day, dayIndex) => {
                  const schedule = getScheduleForSlot(dayIndex + 1, time);
                  
                  return (
                    <Card key={`${day}-${time}`} className="p-4 hover:border-primary/50 transition-smooth">
                      <div className="md:hidden text-sm font-semibold mb-2 text-muted-foreground">
                        {day} - {time}
                      </div>
                      
                      {schedule ? (
                        <div className="space-y-2">
                          <Badge className={getTypeColor(schedule.type)}>
                            {schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)}
                          </Badge>
                          <p className="font-medium">{schedule.hosts?.name}</p>
                          {schedule.room_link && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                              onClick={() => window.open(schedule.room_link, '_blank')}
                            >
                              <ExternalLink className="mr-2 h-3 w-3" />
                              Entrar
                            </Button>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center">Sem monitoria</p>
                      )}
                    </Card>
                  );
                })}
              </>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}