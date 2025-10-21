import cyberSecurityImage from '@/assets/destaque-cyber-security.png';

export function WeeklyHighlightsCarousel() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Destaques da Semana</h2>
        
        <div className="flex justify-center">
          <div className="relative w-full max-w-[380px] aspect-[9/16] rounded-2xl overflow-hidden shadow-glow hover:scale-[1.02] transition-transform">
            <img
              src={cyberSecurityImage}
              alt="Cyber Security com Roger Robson"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
