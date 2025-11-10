import lucasHostImg from '@/assets/lucas-host.png';
import adavioHostImg from '@/assets/adavio-host.png';
import { Instagram } from 'lucide-react';

export function HostsSection() {
  const hosts = [
    {
      name: 'Lucas Charão',
      role: 'Estratégia & Crescimento',
      bio: 'Analista de Experiência Educacional da Academia Lendária, especialista em Engenheiro de Prompts, Clones Digitais e Agentes. Host do PS desde o seu início(Julho de 2024).',
      image: lucasHostImg,
      instagram: 'https://www.instagram.com/olucascharao/',
    },
    {
      name: 'Adávio Tittoni',
      role: 'Desenvolvimento & Automações',
      bio: 'Analista de Experiência Educacional da Academia Lendária, especialista e professor de automação, N8N e Vibe Coding.',
      image: adavioHostImg,
      instagram: 'https://www.instagram.com/adaviotittoni/',
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 px-4">
      <div className="container mx-auto">
        <div className="bg-black rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-3 sm:space-y-4 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Hosts.</h2>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-400">Especialistas prontos para tirar suas dúvidas.</p>
            </div>

            {/* Right side - Hosts stacked vertically */}
            <div className="space-y-6 sm:space-y-8">
              {hosts.map((host, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-800 flex-shrink-0">
                    <img
                      src={host.image}
                      alt={host.name}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center 20%' }}
                    />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 mb-1">
                      <h3 className="font-bold text-base sm:text-lg text-white">{host.name}</h3>
                      <a 
                        href={host.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-400 transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400 font-semibold mb-2">{host.role}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{host.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
