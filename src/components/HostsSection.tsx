export function HostsSection() {
  // Placeholder images - will be replaced with actual host images
  const hosts = [
    {
      name: 'Lucas Charão',
      role: 'Host do Pronto-Socorro',
      image: '', // Será adicionado depois
    },
    {
      name: 'Adávio Tittoni',
      role: 'Host do Pronto-Socorro',
      image: '', // Será adicionado depois
    },
  ];

  return (
    <section className="w-full py-16 px-4">
      <div className="container mx-auto">
        <div className="bg-black rounded-3xl p-8 lg:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Hosts do Pronto-Socorro
          </h2>
          
          <div className="flex justify-center gap-16">
            {hosts.map((host, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-40 h-40 rounded-3xl overflow-hidden bg-gray-800">
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
                <div>
                  <h3 className="font-bold text-lg text-white">{host.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{host.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
