import { Navbar } from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Admin() {
  return (
    <div className="min-h-screen gradient-dark">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Painel Administrativo</h1>
        
        <Tabs defaultValue="schedules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="schedules">Horários</TabsTrigger>
            <TabsTrigger value="guests">Convidados</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="hosts">Hosts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedules">
            <div className="text-center py-12 text-muted-foreground">
              Gestão de horários em desenvolvimento
            </div>
          </TabsContent>
          
          <TabsContent value="guests">
            <div className="text-center py-12 text-muted-foreground">
              Gestão de convidados em desenvolvimento
            </div>
          </TabsContent>
          
          <TabsContent value="links">
            <div className="text-center py-12 text-muted-foreground">
              Gestão de links em desenvolvimento
            </div>
          </TabsContent>
          
          <TabsContent value="hosts">
            <div className="text-center py-12 text-muted-foreground">
              Gestão de hosts em desenvolvimento
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}