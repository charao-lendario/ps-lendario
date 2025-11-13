import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';

const scheduleData = [
  {
    day: 'Segunda, Quarta e Sexta',
    sessions: [
      { time: '10:00 - 11:30', host: 'Lucas Charão', type: 'Estratégico', color: 'blue' },
      { time: '18:30 - 20:00', host: 'Igor Rover', type: 'Técnico', color: 'green' }
    ]
  },
  {
    day: 'Terça',
    sessions: [
      { time: '10:00 - 11:30', host: 'Igor Rover', type: 'Técnico', color: 'green' },
      { time: '18:30 - 20:00', host: 'Day Cavalcanti', type: 'Marketing', color: 'yellow' }
    ]
  },
  {
    day: 'Quinta',
    sessions: [
      { time: '10:00 - 11:30', host: 'Igor Rover', type: 'Técnico', color: 'green' },
      { time: '18:30 - 20:00', host: 'João Lozano', type: 'Marketing', color: 'yellow' }
    ]
  }
];

export function ScheduleDisplay() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">Grade de Horários</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Confira os horários disponíveis para participar das sessões do Pronto-Socorro
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scheduleData.map((schedule, idx) => (
          <Card key={idx} className="gradient-card shadow-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Calendar className="h-5 w-5" />
                <h3 className="text-lg font-semibold">{schedule.day}</h3>
              </div>
              
              <div className="space-y-3">
                {schedule.sessions.map((session, sessionIdx) => (
                  <div key={sessionIdx} className="p-4 bg-background/50 rounded-lg border border-border/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{session.time}</span>
                      </div>
                      <Badge className={`text-xs ${
                        session.color === 'blue' ? 'bg-blue-500/20 text-blue-500 border-blue-500/30' :
                        session.color === 'green' ? 'bg-green-500/20 text-green-500 border-green-500/30' :
                        'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                      }`}>
                        {session.type}
                      </Badge>
                    </div>
                    <p className="font-medium">{session.host}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground italic mt-6">
        *Programação sujeita a alteração sem aviso prévio
      </div>
    </div>
  );
}
