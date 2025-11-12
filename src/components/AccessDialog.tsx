import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar } from "lucide-react";

interface AccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccessDialog({ open, onOpenChange }: AccessDialogProps) {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/554888000116?text=Olá,%20estou%20com%20problema%20de%20acesso%20ao%20Pronto%20Socorro', '_blank');
  };

  const handleCalendarClick = () => {
    window.open('https://calendar.google.com/calendar/u/0/r?cid=Y181ZDhkNjEwNmI3NThjNTVkYTk2YTQzOGJlZGZlNWRiMjU4MTlhMTczZThlM2RiNmUwNDMyM2E3ZjMyNTA0MjFmQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20', '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Como Acessar o Pronto-Socorro</DialogTitle>
          <DialogDescription>
            Assista ao vídeo e adicione o calendário para não perder nenhuma sessão
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Warning Section */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex flex-col items-center text-center">
            <p className="text-lg font-semibold mb-3 flex items-center gap-2">
              ⚠️ Não consegue acessar?
            </p>
            <Button
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar com o Suporte
            </Button>
          </div>

          {/* Video Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Vídeo Tutorial</h3>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://www.youtube.com/embed/bbbMyBoFRUM"
                title="Tutorial de Acesso"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg"
              />
            </div>
          </div>

          {/* Calendar Button */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Adicionar ao Google Calendário</h3>
            <p className="text-sm text-muted-foreground">
              Adicione nosso calendário ao seu Google Calendar e receba notificações de todas as sessões
            </p>
            <Button
              onClick={handleCalendarClick}
              className="w-full gradient-primary"
              size="lg"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Adicionar ao Google Calendário
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
