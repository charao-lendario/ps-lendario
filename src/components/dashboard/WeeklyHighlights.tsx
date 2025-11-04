import { VideoCarousel } from '@/components/VideoCarousel';

export function WeeklyHighlights() {
  return (
    <section className="w-full py-20 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Text content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-bold text-white">Depoimentos.</h2>
              <p className="text-4xl md:text-5xl font-bold text-muted-foreground">Alunos Lendários.</p>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Diversos alunos não estão só tirando suas dúvidas, mas transformando seus conhecimentos com IA.
            </p>
          </div>

          {/* Right side - Video Carousel */}
          <div className="flex justify-center lg:justify-end">
            <VideoCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}