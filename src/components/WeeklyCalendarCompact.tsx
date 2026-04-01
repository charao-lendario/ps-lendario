import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isToday, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { AccessDialog } from '@/components/AccessDialog';
const hostThemes = {
  'Lucas Charão': 'Estratégico (Tudo que for relacionado a estratégia, planejamento e Engenharia de Prompts)',
  'Jaya Roberta': 'Estratégico (Tudo que for relacionado a estratégia, planejamento e Engenharia de Prompts)',
  'Marllon Blando': 'Estratégico (Tudo que for relacionado a estratégia, planejamento e Engenharia de Prompts)',
  'Adávio Tittoni': 'Técnico (N8N, automação, vibe coding)',
  'Day Cavalcanti': 'Marketing',
  'João Lozano': 'Marketing'
};

export default function WeeklyCalendarCompact() {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
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
  
  const isHoliday = (day: Date) => {
    // 03/04/2025 - Sexta-Feira Santa
    if (day.getDate() === 3 && day.getMonth() === 3 && day.getFullYear() === 2025) {
      return 'Sem PS — Feriado de Sexta-Feira Santa 🙏';
    }
    return null;
  };

  const getEventsForDay = (day: Date) => {
    const dayOfWeek = getDay(day); // 0 = Domingo, 1 = Segunda, etc.

    // Verificar feriados
    const holidayMessage = isHoliday(day);
    if (holidayMessage) return [];

    // 06/04/2025 (domingo especial com Marllon Blando às 10h)
    const isMarllonDay = day.getDate() === 6 && day.getMonth() === 3 && day.getFullYear() === 2025;
    if (isMarllonDay) {
      return [
        { time: '10:00', name: 'Marllon Blando', type: 'strategic', endTime: '11:30' }
      ];
    }

    // Verificar se é dia 26/11/2024 (quarta-feira especial com Jaya Roberta)
    const isJayaDay = day.getDate() === 26 && day.getMonth() === 10 && day.getFullYear() === 2024;

    // Segunda (1), Quarta (3), Sexta (5)
    if ([1, 3, 5].includes(dayOfWeek)) {
      const morningHost = isJayaDay ? 'Jaya Roberta' : 'Lucas Charão';
      return [
        { time: '10:00', name: morningHost, type: 'strategic', endTime: '11:30' },
        { time: '18:30', name: 'Adávio Tittoni', type: 'technical', endTime: '20:00' }
      ];
    }
    
    // Terça (2)
    if (dayOfWeek === 2) {
      return [
        { time: '10:00', name: 'Adávio Tittoni', type: 'technical', endTime: '11:30' },
        { time: '18:30', name: 'Day Cavalcanti', type: 'marketing', endTime: '20:00' }
      ];
    }
    
    // Quinta (4)
    if (dayOfWeek === 4) {
      return [
        { time: '10:00', name: 'Adávio Tittoni', type: 'technical', endTime: '11:30' },
        { time: '18:30', name: 'João Lozano', type: 'marketing', endTime: '20:00' }
      ];
    }
    
    return [];
  };

  const getCurrentEventForDay = (day: Date) => {
    const now = new Date();
    
    // Converter para horário de Brasília (UTC-3)
    const brasiliaOffset = -3 * 60; // -3 horas em minutos
    const localOffset = now.getTimezoneOffset(); // offset do timezone local em minutos
    const brasiliaTime = new Date(now.getTime() + (localOffset + brasiliaOffset) * 60 * 1000);
    
    const currentHour = brasiliaTime.getHours();
    const currentMinutes = brasiliaTime.getMinutes();
    const currentTime = currentHour + currentMinutes / 60;
    
    const eventsForDay = getEventsForDay(day);
    
    // Das 00:00 às 11:40 - evento das 10h
    if (currentTime >= 0 && currentTime <= 11.67) {
      return eventsForDay.find(e => e.time === '10:00') || null;
    }
    
    // Das 12:40 às 21:00 - evento das 18:30
    if (currentTime >= 12.67 && currentTime <= 21) {
      return eventsForDay.find(e => e.time === '18:30') || null;
    }
    
    return null;
  };

  const isEventLive = () => {
    const now = new Date();
    
    // Converter para horário de Brasília (UTC-3)
    const brasiliaOffset = -3 * 60;
    const localOffset = now.getTimezoneOffset();
    const brasiliaTime = new Date(now.getTime() + (localOffset + brasiliaOffset) * 60 * 1000);
    
    const currentHour = brasiliaTime.getHours();
    const currentMinutes = brasiliaTime.getMinutes();
    const currentTime = currentHour + currentMinutes / 60;
    
    // 10:00 às 11:40 ou 18:30 às 20:00
    return (currentTime >= 10 && currentTime <= 11.67) || (currentTime >= 18.5 && currentTime <= 20);
  };

  const handleDayClick = (day: Date) => {
    const currentEvent = getCurrentEventForDay(day);
    if (currentEvent) {
      setAccessDialogOpen(true);
    }
  };
  
  const changeWeek = (weeks: number) => {
    setCurrentWeek(weeks > 0 ? addWeeks(currentWeek, weeks) : subWeeks(currentWeek, Math.abs(weeks)));
  };
  const goToToday = () => setCurrentWeek(new Date());
  return <div className="w-full bg-background py-8">
      <div className="container mx-auto px-4 space-y-6">
        {/* Week Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
            {format(weekStart, "d 'de' MMM", {
            locale: ptBR
          })} - {format(weekEnd, "d 'de' MMM 'de' yyyy", {
            locale: ptBR
          })}
          </h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="icon" onClick={() => changeWeek(-1)} className="hover-scale flex-1 sm:flex-none">
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button variant="default" onClick={goToToday} size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
              Hoje
            </Button>
            <Button variant="outline" size="icon" onClick={() => changeWeek(1)} className="hover-scale flex-1 sm:flex-none">
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* Week Days Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3 sm:gap-4">
        {weekDays.map(day => {
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;
          const isTodayDay = isToday(day);
          const isWeekend = getDay(day) === 0 || getDay(day) === 6;
          const showLiveBadge = isTodayDay && isEventLive();
          
          const currentEvent = isTodayDay ? getCurrentEventForDay(day) : null;
          const isDayMarketingLive = isTodayDay && showLiveBadge && currentEvent?.type === 'marketing';
          
          return <Card 
                key={day.toISOString()} 
                className={cn(
                  "gradient-card shadow-card transition-smooth cursor-pointer hover:border-primary/50",
                  isTodayDay && "border-2 border-primary",
                  isDayMarketingLive && "!border-red-500 animate-pulse",
                  isWeekend && "opacity-50"
                )}
                onClick={isTodayDay ? () => handleDayClick(day) : undefined}
              >
                <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  {/* Day Header */}
                  <div className="text-center space-y-0.5 sm:space-y-1">
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase font-medium">
                      {format(day, 'EEEE', {
                    locale: ptBR
                  })}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <p className={cn("text-2xl sm:text-3xl font-bold", isTodayDay && "text-primary")}>
                        {format(day, 'd')}
                      </p>
                      {showLiveBadge && (
                        <Badge className="bg-red-500 text-white text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 animate-pulse font-bold">
                          Ao vivo
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {format(day, 'MMM', {
                    locale: ptBR
                  })}
                    </p>
                  </div>

                  {/* Events List */}
                  <div className="space-y-1.5 sm:space-y-2">
                    {isHoliday(day) ? (
                      <div className="p-2 sm:p-3 bg-orange-500/10 rounded border border-orange-500/30 text-center">
                        <p className="text-[10px] sm:text-xs font-medium text-orange-400">
                          {isHoliday(day)}
                        </p>
                      </div>
                    ) : hasEvents ? (
                      <>
                        {dayEvents.map((event, idx) => (
                          <div key={idx} className="p-1.5 sm:p-2 bg-background/50 rounded border border-border/20">
                            <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                <span className="text-[9px] sm:text-[10px]">{event.time}</span>
                              </div>
                              <Badge className={cn("text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0", 
                                event.type === 'technical' && "bg-green-500/20 text-green-500 border-green-500/30",
                                event.type === 'marketing' && "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
                                event.type === 'strategic' && "bg-blue-500/20 text-blue-500 border-blue-500/30"
                              )}>
                                {event.type === 'technical' ? 'Técnico' : 
                                 event.type === 'marketing' ? 'Marketing' : 'Estratégico'}
                              </Badge>
                            </div>
                            <p className="text-[10px] sm:text-xs font-medium truncate">{event.name}</p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-[10px] sm:text-xs text-center text-muted-foreground py-1.5 sm:py-2">
                        Sem eventos
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>
        
        {/* Schedule Note */}
        <div className="text-center mt-4 sm:mt-6 px-4">
          <p className="text-[10px] sm:text-xs text-muted-foreground italic">
            *Programação sujeita a alteração sem aviso prévio.
          </p>
        </div>
      </div>

      <AccessDialog open={accessDialogOpen} onOpenChange={setAccessDialogOpen} />
    </div>;
}