import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Guest {
  name: string;
  bio?: string;
  avatar_url?: string;
  social_links?: {
    linkedin?: string;
    instagram?: string;
  };
}

interface Event {
  id: string;
  date: string;
  time: string;
  topic?: string;
  room_link?: string;
}

interface CarouselItem {
  guest: Guest;
  event: Event;
}

interface OverlappingCarouselProps {
  items: CarouselItem[];
}

type Position = 'hidden-left' | 'left' | 'center' | 'right' | 'hidden-right';

interface CardPosition {
  scale: number;
  opacity: number;
  zIndex: number;
  translateX: number;
  rotateY: number;
}

const positionStyles: Record<Position, CardPosition> = {
  'hidden-left': {
    scale: 0.7,
    opacity: 0,
    zIndex: 0,
    translateX: -60,
    rotateY: 15,
  },
  left: {
    scale: 0.85,
    opacity: 0.7,
    zIndex: 10,
    translateX: -20,
    rotateY: 8,
  },
  center: {
    scale: 1,
    opacity: 1,
    zIndex: 30,
    translateX: 0,
    rotateY: 0,
  },
  right: {
    scale: 0.85,
    opacity: 0.7,
    zIndex: 10,
    translateX: 20,
    rotateY: -8,
  },
  'hidden-right': {
    scale: 0.7,
    opacity: 0,
    zIndex: 0,
    translateX: 60,
    rotateY: -15,
  },
};

interface CardProps {
  guest: Guest;
  event: Event;
  position: Position;
  isActive: boolean;
  onClick: () => void;
}

function OverlappingCard({ guest, event, position, isActive, onClick }: CardProps) {
  const style = positionStyles[position];
  const formattedDate = format(new Date(event.date), "dd 'de' MMMM", { locale: ptBR });

  return (
    <div
      className="absolute top-1/2 left-1/2 w-[280px] h-[380px] lg:w-[320px] lg:h-[420px] transition-all duration-500 ease-out cursor-pointer"
      style={{
        transform: `
          translate(-50%, -50%) 
          translateX(${style.translateX}%) 
          scale(${style.scale}) 
          rotateY(${style.rotateY}deg)
        `,
        opacity: style.opacity,
        zIndex: style.zIndex,
        transformStyle: 'preserve-3d',
      }}
      onClick={onClick}
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl">
        {guest.avatar_url ? (
          <img 
            src={`${guest.avatar_url}?quality=90`}
            alt={guest.name}
            className="w-full h-full object-cover object-center"
            loading={isActive ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-secondary/50" />
        )}
        
        {/* Subtle Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Minimal Info - só no card ativo */}
        {isActive && (
          <div className="absolute bottom-4 left-4 right-4 space-y-1">
            <p className="text-base font-semibold text-white line-clamp-1">
              {event.topic || 'Monitoria'}
            </p>
            <p className="text-sm text-white/90 font-medium line-clamp-1">
              Com {guest.name}
            </p>
            <p className="text-xs text-white/70">
              {formattedDate} às {event.time}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function OverlappingCarousel({ items }: OverlappingCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const getPosition = (cardIndex: number, activeIndex: number): Position => {
    const diff = cardIndex - activeIndex;
    
    if (diff === 0) return 'center';
    if (diff === -1) return 'left';
    if (diff === 1) return 'right';
    if (diff < -1) return 'hidden-left';
    return 'hidden-right';
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleCardClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative w-full h-[450px] lg:h-[500px] overflow-visible py-12"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ perspective: '1200px' }}
    >
      <div className="relative h-full flex items-center justify-center">
        {items.map((item, index) => (
          <OverlappingCard
            key={item.event.id}
            guest={item.guest}
            event={item.event}
            position={getPosition(index, activeIndex)}
            isActive={index === activeIndex}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
      
      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Card anterior"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Próximo card"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex 
                ? 'bg-white w-6' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Ir para card ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
