import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Linkedin, Instagram, ArrowRight, Shield } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lucasCharaoImg from '@/assets/adavio-tittoni.png';
import adavioTittoniImg from '@/assets/adavio-tittoni-new.png';
import academiaLendariaLogo from '@/assets/academia-lendaria-logo.png';
import hostsHeroImg from '@/assets/hosts-hero.png';
import WeeklyCalendarCompact from '@/components/WeeklyCalendarCompact';
import { WeeklyHighlights } from '@/components/dashboard/WeeklyHighlights';
import { ExpertsList } from '@/components/ExpertsList';
import { WeeklyHighlightsCarousel } from '@/components/WeeklyHighlightsCarousel';
import { ScheduleGrid } from '@/components/dashboard/ScheduleGrid';
export default function Index() {
  const {
    user,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  const hosts = [{
    name: 'Lucas Charão',
    role: 'Estratégia & Crescimento',
    type: 'Estratégico',
    bio: 'Analista de Experiência Educacional da Academia Lendária, especialista em Engenheiro de Prompts, Clones Digitais e Agentes. Host do PS desde o seu início(Julho de 2024).',
    avatar: lucasCharaoImg,
    social: {
      linkedin: '',
      instagram: 'https://www.instagram.com/olucascharao/',
      instagramHandle: '@olucascharao'
    }
  }, {
    name: 'Adávio Tittoni',
    role: 'Desenvolvimento & Automações',
    type: 'Técnico',
    bio: 'Analista de Experiência Educacional da Academia Lendária, especialista e professor de automação, N8N e Vibe Coding.',
    avatar: adavioTittoniImg,
    social: {
      linkedin: '',
      instagram: 'https://www.instagram.com/adaviotittoni/',
      instagramHandle: '@adaviotittoni'
    }
  }];
  return <div className="min-h-screen gradient-dark">
      {/* Discrete Admin Button */}
      <div className="absolute top-4 right-4 z-50">
        <Link to="/auth">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white/90 hover:bg-white/10">
            <Shield className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-black border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 py-3">
            <img src={academiaLendariaLogo} alt="Academia Lendária" className="h-8" />
            <div className="flex flex-wrap justify-center gap-1 flex-1">
              {[{
              label: 'Como Funciona',
              href: '#como-funciona'
            }, {
              label: 'Horários',
              href: '#grade'
            }, {
              label: 'Calendário',
              href: '#calendario'
            }, {
              label: 'Destaques Semanais',
              href: '#destaques'
            }, {
              label: 'Alunos',
              href: '#depoimentos'
            }, {
              label: 'Especialistas',
              href: '#especialistas'
            }, {
              label: 'Hosts',
              href: '#hosts'
            }].map(item => <a key={item.href} href={item.href} className="px-3 py-2 text-sm text-white hover:text-primary hover:bg-white/10 rounded-md transition-smooth">
                  {item.label}
                </a>)}
            </div>
          </div>
        </div>
      </nav>

      {/* Info Banner */}
      <div className="bg-white border-b border-gray-200 py-3 px-4">
        <p className="text-center text-sm text-black max-w-4xl mx-auto">
          Um Sistema de monitoria ao vivo e exclusivo para alunos da <span className="font-semibold">Formação</span> e <span className="font-semibold">Founders</span>
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-dark"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-5 gap-12 items-center max-w-7xl mx-auto">
            {/* Text Content - 60% */}
            <div className="lg:col-span-3 space-y-6">
              <div className="inline-flex items-center gap-3 mb-6">
                
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none">
                <span className="text-foreground">Pronto-Socorro.</span>
              </h1>
              
              <h2 className="text-2xl md:text-3xl text-muted-foreground font-medium">
                O lugar ideal para acelerar seus resultados.
              </h2>

              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl">
                Um ambiente colaborativo onde alunos encontram especialistas todos os dias (segunda a sexta).
              </p>
              
              <div className="pt-4">
                <Button size="lg" variant="hero" className="text-lg px-8 py-6 h-auto" onClick={() => window.open('https://membros.academialendaria.ai/m/lessons/pronto-socorro', '_blank')}>
                  Acessar Pronto-Socorro
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground pt-4">
                Hosts - Lucas Charão e Adávio Tittoni
              </p>
              
              <p className="text-sm pt-2">
                <span className="text-white">SOS Lendário.</span>{' '}
                <span className="text-muted-foreground">Solucione suas dúvidas, verifique os horários.</span>
              </p>
            </div>

            {/* Image - 40% */}
            <div className="lg:col-span-2">
              <div className="relative">
                <img src={hostsHeroImg} alt="Lucas Charão e Adávio Tittoni" className="w-full h-auto object-contain" />
              </div>
            </div>
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
            {hosts.map(host => <Card key={host.name} className="shadow-card gradient-card hover:shadow-glow transition-smooth overflow-hidden">
                <CardContent className="p-0 flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-2/5 sm:min-h-[400px] overflow-hidden">
                    {host.avatar ? <img src={host.avatar} alt={host.name} className="w-full h-full object-cover object-center" /> : <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-6xl font-bold">{host.name.charAt(0)}</span>
                      </div>}
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
                      {host.social.linkedin && <Button size="sm" variant="outline" onClick={() => window.open(host.social.linkedin, '_blank')}>
                          <Linkedin className="h-4 w-4" />
                        </Button>}
                      {host.social.instagram && <Button size="sm" variant="outline" onClick={() => window.open(host.social.instagram, '_blank')} className="gap-2">
                          <Instagram className="h-4 w-4" />
                          <span>{host.social.instagramHandle}</span>
                        </Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>)}
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
            <iframe className="w-full h-full" src="https://www.youtube.com/embed/UgD1qjh8BTU" title="Como Funciona - Pronto Socorro" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
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
              <Button size="lg" variant="hero" className="text-lg" onClick={() => window.open('https://membros.academialendaria.ai/m/lessons/pronto-socorro', '_blank')}>
                Acessar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>;
}