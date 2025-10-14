import { VideoCarousel } from '@/components/VideoCarousel';

export function WeeklyHighlights() {
  return (
    <section className="w-full space-y-8">
      <h2 className="text-3xl font-bold text-center">Depoimentos de Alunos</h2>
      
      {/* Carrossel de Vídeos */}
      <VideoCarousel />
    </section>
  );
}