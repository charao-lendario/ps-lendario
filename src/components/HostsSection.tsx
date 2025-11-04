import lucasHostImg from '@/assets/lucas-host.png';
import adavioHostImg from '@/assets/adavio-host.png';

export function HostsSection() {
  const hosts = [
    {
      name: 'Lucas Charão',
      role: 'Host do Pronto-Socorro',
      image: lucasHostImg,
    },
    {
      name: 'Adávio Tittoni',
      role: 'Host do Pronto-Socorro',
      image: adavioHostImg,
    },
  ];

  return (
    <section className="w-full py-16 px-4">
      <div className="container mx-auto">
        <div className="bg-black rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white">Hosts.</h2>
              <p className="text-2xl md:text-3xl text-gray-400">Especialistas prontos para tirar suas dúvidas.</p>
            </div>

            {/* Right side - Hosts stacked vertically */}
            <div className="space-y-8">
              {hosts.map((host, index) => (
                <div key={index} className="flex items-center gap-6">
                  <div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-gray-800 flex-shrink-0">
                    {host.image ? (
                      <img
                        src={host.image}
                        alt={host.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        Foto
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg text-white">{host.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{host.role}</p>
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
