import { Navbar } from '@/components/layout/Navbar';
import { ScheduleGrid } from '@/components/dashboard/ScheduleGrid';
import WeeklyCalendarCompact from '@/components/WeeklyCalendarCompact';
import { WeeklyHighlights } from '@/components/dashboard/WeeklyHighlights';
import { UsefulLinks } from '@/components/dashboard/UsefulLinks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen gradient-dark">
      <Navbar />
      
      <main className="w-full space-y-12">
        <div className="container mx-auto px-4 py-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Acompanhe a programação semanal de monitorias</p>
          </div>
        </div>

        <WeeklyCalendarCompact />
        
        {/* Support Section */}
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-background to-primary/10 shadow-glow">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left flex-1">
                  <p className="text-base md:text-lg font-semibold text-foreground">
                    Você é aluno(a), está acessando no horário e não está sendo aceito(a)?
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Entre em contato com nosso suporte imediatamente
                  </p>
                </div>
                <Button 
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all"
                  onClick={() => window.open('https://wa.me/seu_numero_aqui', '_blank')}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Suporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="container mx-auto px-4">
          <WeeklyHighlights />
        </div>
        
        <div className="container mx-auto px-4">
          <UsefulLinks />
        </div>
      </main>
    </div>
  );
}