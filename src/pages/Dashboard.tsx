import { Navbar } from '@/components/layout/Navbar';
import { ScheduleGrid } from '@/components/dashboard/ScheduleGrid';
import WeeklyCalendar from '@/components/WeeklyCalendar';
import { WeeklyHighlights } from '@/components/dashboard/WeeklyHighlights';
import { UsefulLinks } from '@/components/dashboard/UsefulLinks';

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

        <WeeklyCalendar />
        
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