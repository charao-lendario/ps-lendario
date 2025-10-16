import adrianoDeMarqui from '@/assets/especialistas/adriano-de-marqui.jpg';
import celsoCecconi from '@/assets/especialistas/celso-cecconi.jpg';
import dayCavalcanti from '@/assets/especialistas/day-cavalcanti.jpg';
import deniTorres from '@/assets/especialistas/deni-torres.jpg';
import douglasMachado from '@/assets/especialistas/douglas-machado.jpg';
import erickGarcia from '@/assets/especialistas/erick-garcia.jpg';
import gabrielLopes from '@/assets/especialistas/gabriel-lopes.jpg';
import gabrielMarcondes from '@/assets/especialistas/gabriel-marcondes.jpg';
import gustavoOliveira from '@/assets/especialistas/gustavo-oliveira.jpg';
import joseAmorim from '@/assets/especialistas/jose-amorim.jpg';
import marllonBlando from '@/assets/especialistas/marllon-blando.jpg';
import ramonToledo from '@/assets/especialistas/ramon-toledo.jpg';
import raquelRossi from '@/assets/especialistas/raquel-rossi.jpg';
import rogerRobson from '@/assets/especialistas/roger-robson.jpg';
import ruanBraz from '@/assets/especialistas/ruan-braz.jpg';
import sergioRicardo from '@/assets/especialistas/sergio-ricardo.jpg';

interface Expert {
  name: string;
  specialty: string;
  image: string;
  objectPosition?: string;
}

const experts: Expert[] = [
  {
    name: 'Adriano De Marqui',
    specialty: 'Coordenador Educacional da Academia Lendária',
    image: adrianoDeMarqui,
  },
  {
    name: 'Celso Cecconi',
    specialty: 'CEO e Mentor da Foco no Comercial',
    image: celsoCecconi,
  },
  {
    name: 'Day Cavalcanti',
    specialty: 'Engenheira de Prompt Sênior da Academia Lendária',
    image: dayCavalcanti,
  },
  {
    name: 'Deni Torres',
    specialty: 'Especialista em IA da Academia Lendária',
    image: deniTorres,
  },
  {
    name: 'Douglas Machado',
    specialty: 'Especialista em Vendas da Academia Lendária',
    image: douglasMachado,
  },
  {
    name: 'Erick Garcia',
    specialty: 'Especialista em Vendas',
    image: erickGarcia,
  },
  {
    name: 'Gabriel Lopes',
    specialty: 'Dev Full Stack da Academia Lendária',
    image: gabrielLopes,
    objectPosition: 'center 20%',
  },
  {
    name: 'Gabriel Marcondes',
    specialty: 'CEO da Agência Lendária',
    image: gabrielMarcondes,
  },
  {
    name: 'Gustavo Oliveira',
    specialty: 'Empresário e Contador',
    image: gustavoOliveira,
  },
  {
    name: 'José Amorim',
    specialty: 'PO da Formação da Academia Lendária',
    image: joseAmorim,
  },
  {
    name: 'Marllon Blando',
    specialty: 'Head do time de Sucesso do Cliente da Academia Lendária',
    image: marllonBlando,
    objectPosition: 'center 20%',
  },
  {
    name: 'Ramon Toledo',
    specialty: 'Especialista em vendas usando a Neurociência',
    image: ramonToledo,
  },
  {
    name: 'Raquel Rossi',
    specialty: 'Cientista de Dados da Academia Lendária',
    image: raquelRossi,
    objectPosition: 'center 20%',
  },
  {
    name: 'Roger Robson',
    specialty: 'Especialista em Cyber Security',
    image: rogerRobson,
    objectPosition: 'center 20%',
  },
  {
    name: 'Ruan Braz',
    specialty: 'Especialista em Design com IA',
    image: ruanBraz,
  },
  {
    name: 'Sergio Ricardo',
    specialty: 'Especialista em vendas (Dr. Vendas)',
    image: sergioRicardo,
  },
];

export function ExpertsList() {
  return (
    <section className="w-full py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Especialistas que já passaram pelo PS
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
          {experts.map((expert, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-3">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary shadow-glow">
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-full h-full object-cover"
                  style={expert.objectPosition ? { objectPosition: expert.objectPosition } : undefined}
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{expert.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{expert.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
