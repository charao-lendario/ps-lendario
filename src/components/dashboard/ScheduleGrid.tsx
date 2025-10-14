import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Fragment } from 'react';

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
      estrategico: 'bg-blue-500/20 text-blue-500 border-blue-500/30 font-bold',
      tecnico: 'bg-green-500/20 text-green-500 border-green-500/30 font-bold',
      marketing: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30 font-bold',
    };
    return colors[type as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const getDefaultSchedule = (day: number, time: string) => {
    // Segunda, Quarta, Sexta = 1, 3, 5
    // Terça, Quinta = 2, 4
    
    if ([1, 3, 5].includes(day) && time === '10:00') {
      return { type: 'estrategico', label: 'Estratégico' };
    }
    if ([1, 3, 5].includes(day) && time === '18:30') {
      return { type: 'tecnico', label: 'Técnico' };
    }
    if ([2, 4].includes(day) && time === '10:00') {
      return { type: 'tecnico', label: 'Técnico' };
    }
    if ([2, 4].includes(day) && time === '18:30') {
      return { type: 'marketing', label: 'Marketing' };
    }
    return null;
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
              <Fragment key={`time-row-${time}`}>
                <div className="md:flex items-center justify-center font-semibold hidden">
                  {time}
                </div>
                {DAYS.map((day, dayIndex) => {
                  const schedule = getScheduleForSlot(dayIndex + 1, time);
                  const defaultSchedule = getDefaultSchedule(dayIndex + 1, time);
                  const displaySchedule = schedule || defaultSchedule;
                  
                  return (
                    <Card key={`${day}-${time}`} className="p-4 hover:border-primary/50 transition-smooth">
                      <div className="md:hidden text-sm font-semibold mb-2 text-muted-foreground">
                        {day} - {time}
                      </div>
                      
                      {displaySchedule ? (
                        <div className="space-y-2 flex flex-col items-center">
                          <Badge className={getTypeColor(displaySchedule.type)}>
                            {'label' in displaySchedule 
                              ? displaySchedule.label 
                              : displaySchedule.type.charAt(0).toUpperCase() + displaySchedule.type.slice(1)}
                          </Badge>
                          {schedule?.hosts?.name && (
                            <p className="font-medium text-center">{schedule.hosts.name}</p>
                          )}
                          {schedule?.room_link && (
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
              </Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}