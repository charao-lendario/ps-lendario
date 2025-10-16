import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Linkedin, Instagram, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lucasCharaoImg from '@/assets/adavio-tittoni.png';
import adavioTittoniImg from '@/assets/adavio-tittoni-new.png';
import academiaLendariaLogo from '@/assets/academia-lendaria-logo.png';
import WeeklyCalendarCompact from '@/components/WeeklyCalendarCompact';
import { WeeklyHighlights } from '@/components/dashboard/WeeklyHighlights';
import { ExpertsList } from '@/components/ExpertsList';
import { WeeklyHighlightsCarousel } from '@/components/WeeklyHighlightsCarousel';
import { ScheduleGrid } from '@/components/dashboard/ScheduleGrid';

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const hosts = [
    {
      name: 'Lucas Charão',
      role: 'Estratégia & Crescimento',
      type: 'Estratégico',
      bio: 'Especialista em estratégia e crescimento de negócios digitais.',
      avatar: lucasCharaoImg,
      social: {
        linkedin: '',
        instagram: 'https://www.instagram.com/olucascharao/',
      },
    },
    {
      name: 'Adávio Tittoni',
      role: 'Desenvolvimento & Automações',
      type: 'Técnico',
      bio: 'Expert técnico em desenvolvimento e automações.',
      avatar: adavioTittoniImg,
      social: {
        linkedin: '',
        instagram: 'https://www.instagram.com/adaviotittoni/',
      },
    },
  ];

  return (
    <div className="min-h-screen gradient-dark">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <img 
                src={academiaLendariaLogo} 
                alt="Academia Lendária" 
                className="h-8 mx-auto mb-3 opacity-90"
              />
              <div className="text-primary text-sm font-semibold tracking-wider uppercase mb-4">
                Academia Lendária
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                  Pronto-Socorro
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Sistema de monitoria ao vivo é exclusivo para alunos da <span className="text-primary font-semibold">Formação</span> e <span className="text-primary font-semibold">Founders</span>
            </p>

            <p className="text-lg md:text-xl text-foreground/90 max-w-3xl mx-auto leading-relaxed">
              O Pronto-Socorro é um ambiente colaborativo onde alunos se encontram com especialistas todos os dias (segunda à sexta) em dois horários (10hs e 18:30hs) para tirar dúvidas, trocar idéias, fazer networking, se conectar, adquirir conhecimentos com especialistas e acelerar seu processo de aprendisagem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="hero" 
                className="text-lg"
                onClick={() => window.open('https://membros.academialendaria.ai/m/lessons/pronto-socorro', '_blank')}
              >
                Acessar Pronto-Socorro
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Anchor Menu */}
            <nav className="flex flex-wrap justify-center gap-3 mt-8 pt-8 border-t border-border/50">
              {[
                { label: 'Seus Hosts', href: '#hosts' },
                { label: 'Como Funciona', href: '#como-funciona' },
                { label: 'Grade de Horários', href: '#grade' },
                { label: 'Calendário', href: '#calendario' },
                { label: 'Destaques da Semana', href: '#destaques' },
                { label: 'Depoimentos dos Alunos', href: '#depoimentos' },
                { label: 'Especialistas', href: '#especialistas' },
              ].map((item) => (
                <Button
                  key={item.href}
                  variant="secondary"
                  size="lg"
                  asChild
                  className="font-semibold"
                >
                  <a href={item.href}>
                    {item.label}
                  </a>
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Featured Hosts */}
      <section id="hosts" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Seus Hosts</h2>
            <p className="text-muted-foreground text-lg">
              Especialistas prontos para tirar suas dúvidas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {hosts.map((host) => (
              <Card key={host.name} className="shadow-card gradient-card hover:shadow-glow transition-smooth overflow-hidden">
                <CardContent className="p-0 flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-2/5 sm:min-h-[400px] overflow-hidden">
                    {host.avatar ? (
                      <img 
                        src={host.avatar} 
                        alt={host.name}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-6xl font-bold">{host.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold">{host.name}</h3>
                      <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                        {host.type}
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">{host.role}</p>
                      <p className="text-muted-foreground text-sm">{host.bio}</p>
                    </div>

                    <div className="flex gap-2">
                      {host.social.linkedin && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(host.social.linkedin, '_blank')}
                        >
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      )}
                      {host.social.instagram && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(host.social.instagram, '_blank')}
                        >
                          <Instagram className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section id="como-funciona" className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-muted-foreground">
              Entenda como aproveitar ao máximo o Pronto-Socorro
            </p>
          </div>
          
          <Card className="aspect-video gradient-card shadow-card overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/UgD1qjh8BTU"
              title="Como Funciona - Pronto Socorro"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Card>
        </div>
      </section>

      {/* Schedule Grid */}
      <section id="grade" className="py-20 px-4">
        <div className="container mx-auto">
          <ScheduleGrid />
        </div>
      </section>

      {/* Calendar Section */}
      <section id="calendario" className="w-full py-20 bg-secondary/20">
        <WeeklyCalendarCompact />
      </section>

      {/* Weekly Highlights Carousel */}
      <section id="destaques">
        <WeeklyHighlightsCarousel />
      </section>

      {/* Student Testimonials */}
      <section id="depoimentos" className="py-20 px-4">
        <div className="container mx-auto">
          <WeeklyHighlights />
        </div>
      </section>

      {/* Experts Section */}
      <section id="especialistas" className="py-12 px-4">
        <ExpertsList />
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-2xl mx-auto gradient-card shadow-glow">
            <CardContent className="p-12 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Pronto para começar?
              </h2>
              <p className="text-lg text-muted-foreground">
                Acesse agora e aproveite as monitorias ao vivo
              </p>
              <Button 
                size="lg" 
                variant="hero" 
                className="text-lg"
                onClick={() => window.open('https://membros.academialendaria.ai/m/lessons/pronto-socorro', '_blank')}
              >
                Acessar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}