import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Linkedin, Instagram } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GuestCardProps {
  guest: {
    name: string;
    bio?: string;
    avatar_url?: string;
    social_links?: {
      linkedin?: string;
      instagram?: string;
    };
  };
  event: {
    id: string;
    date: string;
    time: string;
    topic?: string;
    room_link?: string;
  };
  dateBadge: {
    label: string;
    variant: 'default' | 'secondary' | 'outline';
  };
}

export function GuestCard({ guest, event, dateBadge }: GuestCardProps) {
  const formattedDate = format(new Date(event.date), "dd 'de' MMMM", { locale: ptBR });

  return (
    <div
      className="relative w-full max-w-[320px] h-[360px] sm:h-[420px] lg:h-[480px] rounded-lg overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-2xl mx-auto"
      role="article"
      aria-label={`Evento: ${event.topic || 'Monitoria'} com ${guest.name} em ${formattedDate}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && event.room_link && window.open(event.room_link, '_blank')}
    >
      {/* Background Image */}
      {guest.avatar_url ? (
        <img
          src={`${guest.avatar_url}?width=320&height=480&resize=cover&quality=85`}
          alt={`${guest.name} - ${event.topic || 'Monitoria'}`}
          className="absolute inset-0 w-full h-full object-cover object-[center_20%] brightness-90"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-secondary/50" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent group-hover:from-black/98 transition-colors" />

      {/* Content Stack - Bottom Positioned */}
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
        {/* Badge Top */}
        <Badge variant={dateBadge.variant} className="backdrop-blur-sm">
          {dateBadge.label}
        </Badge>

        {/* Guest Info */}
        <div className="space-y-1">
          <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight line-clamp-2">
            {event.topic || 'Monitoria'}
          </h3>
          <p className="text-sm text-white/80">
            Com {guest.name}
          </p>
        </div>

        {/* Date/Time */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="text-sm text-white/80">
            <span>{formattedDate}</span>
          </div>
          <div className="text-sm text-accent font-semibold">
            {event.time}
          </div>
        </div>

        {/* Social Links */}
        {(guest.social_links?.linkedin || guest.social_links?.instagram) && (
          <div className="flex gap-2">
            {guest.social_links.linkedin && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 bg-white/10 border-white/20 hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(guest.social_links.linkedin, '_blank');
                }}
              >
                <Linkedin className="h-3 w-3 text-white" />
              </Button>
            )}
            {guest.social_links.instagram && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 bg-white/10 border-white/20 hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(guest.social_links.instagram, '_blank');
                }}
              >
                <Instagram className="h-3 w-3 text-white" />
              </Button>
            )}
          </div>
        )}

        {/* CTA Button - Appears on Hover */}
        {event.room_link && (
          <Button
            className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 w-full py-2 bg-accent/20 border border-accent hover:bg-accent/30 text-accent text-sm font-semibold"
            onClick={() => window.open(event.room_link, '_blank')}
          >
            Acessar Sala
          </Button>
        )}
      </div>
    </div>
  );
}
