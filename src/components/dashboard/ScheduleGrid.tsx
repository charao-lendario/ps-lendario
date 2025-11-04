import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Square } from 'lucide-react';

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

  const getScheduleForSlot = (day: number, time: string) => {
    return schedules?.find(
      (s) => s.day_of_week === day && s.time === time
    );
  };

  const getTypeConfig = (type: string) => {
    const configs = {
      estrategico: { 
        label: 'Estratégico', 
        color: 'text-blue-400',
        iconColor: 'text-blue-500',
        bgColor: 'bg-blue-500'
      },
      tecnico: { 
        label: 'Técnico', 
        color: 'text-green-400',
        iconColor: 'text-green-500',
        bgColor: 'bg-green-500'
      },
      marketing: { 
        label: 'Marketing', 
        color: 'text-yellow-400',
        iconColor: 'text-yellow-500',
        bgColor: 'bg-yellow-500'
      },
    };
    return configs[type as keyof typeof configs] || { 
      label: type, 
      color: 'text-muted-foreground',
      iconColor: 'text-muted-foreground',
      bgColor: 'bg-muted'
    };
  };

  const getDefaultSchedule = (day: number, time: string) => {
    if ([1, 3, 5].includes(day) && time === '10:00') {
      return { type: 'estrategico' };
    }
    if ([1, 3, 5].includes(day) && time === '18:30') {
      return { type: 'tecnico' };
    }
    if ([2, 4].includes(day) && time === '10:00') {
      return { type: 'tecnico' };
    }
    if ([2, 4].includes(day) && time === '18:30') {
      return { type: 'marketing' };
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-white">Horários.</span>{' '}
          <span className="text-muted-foreground font-normal">
            Verifique os horários disponíveis e os temas abordados.
          </span>
        </h2>
      </div>
      
      {/* Schedule Table */}
      <div className="border border-white/10 rounded-2xl p-6 md:p-8 bg-black/20">
        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-6 gap-6">
          {/* Header Row */}
          <div className="font-semibold text-lg text-white">Horário</div>
          {DAYS.map((day) => (
            <div key={day} className="font-semibold text-lg text-white text-center">
              {day}
            </div>
          ))}

          {/* Time Rows */}
          {TIMES.map((time) => (
            <>
              <div key={`time-${time}`} className="flex items-center text-white text-2xl font-semibold">
                {time}
              </div>
              {DAYS.map((day, dayIndex) => {
                const schedule = getScheduleForSlot(dayIndex + 1, time);
                const defaultSchedule = getDefaultSchedule(dayIndex + 1, time);
                const displaySchedule = schedule || defaultSchedule;
                const config = displaySchedule ? getTypeConfig(displaySchedule.type) : null;
                
                return (
                  <div 
                    key={`${day}-${time}`} 
                    className="flex items-center justify-center"
                  >
                    {config && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-white/10">
                        <div className={`w-3 h-3 rounded-sm ${config.bgColor}`} />
                        <span className="text-white font-medium">{config.label}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-6">
          {TIMES.map((time) => (
            <div key={`mobile-${time}`} className="space-y-3">
              <div className="text-white text-xl font-semibold">{time}</div>
              <div className="grid grid-cols-1 gap-3">
                {DAYS.map((day, dayIndex) => {
                  const schedule = getScheduleForSlot(dayIndex + 1, time);
                  const defaultSchedule = getDefaultSchedule(dayIndex + 1, time);
                  const displaySchedule = schedule || defaultSchedule;
                  const config = displaySchedule ? getTypeConfig(displaySchedule.type) : null;
                  
                  return (
                    <div 
                      key={`mobile-${day}-${time}`} 
                      className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/10"
                    >
                      <span className="text-white font-medium">{day}</span>
                      {config && (
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-sm ${config.bgColor}`} />
                          <span className="text-white text-sm">{config.label}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}