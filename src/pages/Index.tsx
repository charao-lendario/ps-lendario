import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Linkedin, Instagram, ArrowRight, Shield, Menu, X, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { HostsSection } from '@/components/HostsSection';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
export default function Index() {
  const {
    user,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
          <div className="flex items-center justify-between py-3">
            <img src={academiaLendariaLogo} alt="Academia Lendária" className="h-7 md:h-8" />
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex flex-wrap justify-center gap-1 flex-1 px-4">
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
              label: 'Destaques',
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
            }, {
              label: 'FAQ',
              href: '#faq'
            }].map(item => <a key={item.href} href={item.href} className="px-3 py-2 text-sm text-white hover:text-primary hover:bg-white/10 rounded-md transition-smooth">
                  {item.label}
                </a>)}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black border-white/10 w-[280px]">
                <nav className="flex flex-col gap-2 mt-8">
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
                  }, {
                    label: 'FAQ',
                    href: '#faq'
                  }].map(item => (
                    <a 
                      key={item.href} 
                      href={item.href} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 text-base text-white hover:text-primary hover:bg-white/10 rounded-md transition-smooth"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Info Banner */}
      <div className="bg-white border-b border-gray-200 py-3 px-4">
        <p className="text-center text-xs sm:text-sm text-black max-w-4xl mx-auto">
          Um Sistema de monitoria ao vivo e exclusivo para alunos da <span className="font-semibold">Formação</span> e <span className="font-semibold">Founders</span>
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-dark"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            {/* Text Content - 60% */}
            <div className="lg:col-span-3 space-y-4 sm:space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none">
                <span className="text-foreground">Pronto-Socorro.</span>
              </h1>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-medium">
                O lugar ideal para acelerar seus resultados.
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Um ambiente colaborativo onde alunos encontram especialistas todos os dias (segunda a sexta).
              </p>
              
              <div className="pt-2 sm:pt-4">
                <Button 
                  size="lg" 
                  variant="hero" 
                  className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto w-full sm:w-auto" 
                  onClick={() => window.open('https://calendar.google.com/calendar/u/0?cid=Y181ZDhkNjEwNmI3NThjNTVkYTk2YTQzOGJlZGZlNWRiMjU4MTlhMTczZThlM2RiNmUwNDMyM2E3ZjMyNTA0MjFmQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20', '_blank')}
                >
                  Acessar Pronto-Socorro
                  <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                </Button>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground pt-2 sm:pt-4">
                Hosts - Lucas Charão e Adávio Tittoni
              </p>
              
              <p className="text-xs sm:text-sm pt-2">
                <span className="text-white">SOS Lendário.</span>{' '}
                <span className="text-muted-foreground">Solucione suas dúvidas, verifique os horários.</span>
              </p>
            </div>

            {/* Image - 40% */}
            <div className="lg:col-span-2 order-first lg:order-last">
              <div className="relative max-w-md mx-auto lg:max-w-none">
                <img 
                  src={hostsHeroImg} 
                  alt="Lucas Charão e Adávio Tittoni" 
                  className="w-full h-auto object-contain" 
                />
              </div>
            </div>
          </div>

          {/* Centered Text Section */}
          <div className="flex flex-col items-center text-center pt-12 sm:pt-16 space-y-3 sm:space-y-4 max-w-5xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Especialistas em prontidão.
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed px-4">
              O Pronto-Socorro é um ambiente colaborativo onde alunos se encontram com especialistas todos os dias (segunda à sexta) em dois horários (10h e 18h30) para tirar dúvidas, trocar ideias, fazer networking, se conectar, adquirir conhecimentos com especialistas e acelerar seu processo de aprendizagem.
            </p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section id="como-funciona" className="bg-secondary/20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Como Funciona</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Entenda como aproveitar ao máximo o Pronto-Socorro
            </p>
          </div>
          
          <div className="flex justify-center items-center w-full">
            <div className="w-full max-w-[900px]">
              <iframe 
                src="https://www.youtube.com/embed/R9FVfMftzGc?vq=hd1080&hd=1&fmt=22&quality=hd1080" 
                title="Como Funciona - Pronto Socorro" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                scrolling="no"
                className="rounded-2xl shadow-card overflow-hidden"
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  border: '0px',
                  margin: '0px auto',
                  overflow: 'hidden'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hosts */}
      

      {/* Schedule Grid */}
      <section id="grade" className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto">
          <ScheduleGrid />
        </div>
      </section>

      {/* Support Section */}
      <section className="py-8 sm:py-12 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-background to-primary/10 shadow-glow">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left flex-1">
                  <p className="text-base md:text-lg font-semibold text-foreground">
                    Você é aluno(a), está acessando no horário e não está sendo aceito(a)?
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Entre em contato com nosso suporte imediatamente
                  </p>
                </div>
                <Button 
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all"
                  onClick={() => window.open('https://wa.me/554888000116?text=Olá,%20estou%20com%20problema%20de%20acesso%20ao%20Pronto%20Socorro', '_blank')}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Suporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Calendar Section */}
      <section id="calendario" className="w-full py-12 sm:py-16 lg:py-20 bg-secondary/20">
        <div className="container mx-auto px-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Calendário.</h2>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground">Verifique as Datas</p>
          </div>
        </div>
        <WeeklyCalendarCompact />
      </section>

      {/* Weekly Highlights Carousel */}
      <section id="destaques">
        <WeeklyHighlightsCarousel />
      </section>

      {/* Student Testimonials */}
      <section id="depoimentos">
        <WeeklyHighlights />
      </section>

      {/* Experts Section */}
      <section id="especialistas" className="py-12 px-4">
        <ExpertsList />
      </section>

      {/* Hosts Section */}
      <section id="hosts" className="py-12 px-4">
        <HostsSection />
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="text-center lg:text-left lg:max-w-2xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4">
                Pronto para começar?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-400">
                Acesse agora e aproveite as monitorias ao vivo.
              </p>
            </div>
            <Button 
              size="lg" 
              className="bg-[#C4A574] hover:bg-[#B39564] text-black font-semibold px-6 sm:px-8 py-4 sm:py-6 h-auto text-base sm:text-lg rounded-xl flex-shrink-0 w-full sm:w-auto"
              onClick={() => window.open('https://calendar.google.com/calendar/u/0?cid=Y181ZDhkNjEwNmI3NThjNTVkYTk2YTQzOGJlZGZlNWRiMjU4MTlhMTczZThlM2RiNmUwNDMyM2E3ZjMyNTA0MjFmQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20', '_blank')}
            >
              Acessar Pronto-Socorro
              <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-16 lg:py-20 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">Perguntas Frequentes</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Tire suas dúvidas sobre o Pronto-Socorro Lendário
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
            <AccordionItem value="item-1" className="bg-background/50 border border-border rounded-lg px-4 sm:px-6">
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold hover:no-underline py-4">
                O que é o Pronto-Socorro Lendário?
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                O Pronto-Socorro Lendário é um serviço de monitorias em grupo onde profissionais especializados que atuam no mercado de IA resolvem suas dúvidas de forma rápida e prática. É como ter um time de especialistas disponível para te ajudar com qualquer desafio relacionado a IA, N8n, Vibe-Coding, ferramentas Low-Code e No-Code.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Qual a diferença entre o Pronto-Socorro e um curso tradicional?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                O Pronto-Socorro não é um curso! É uma monitoria especializada focada em resolver seus problemas reais e urgentes. Enquanto um curso ensina teoria, aqui você traz suas dúvidas práticas e recebe soluções imediatas de especialistas que trabalham diariamente com IA.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Quem são os monitores do Pronto-Socorro?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                São profissionais que atuam ativamente no mercado de IA, com experiência prática em implementação de soluções reais. Eles não são apenas professores teóricos, mas sim especialistas que lidam diariamente com os mesmos desafios que você enfrenta.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Como funcionam as monitorias em grupo?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                As monitorias acontecem em sessões ao vivo onde você pode trazer suas dúvidas específicas sobre IA, automações, N8n, Vibe-Coding ou qualquer ferramenta Low-Code/No-Code. Os monitores resolvem os problemas em tempo real, e todos os participantes aprendem com as soluções apresentadas.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Que tipos de dúvidas posso levar para o Pronto-Socorro?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Você pode trazer qualquer dúvida relacionada a: implementação de IA no seu negócio, configurações e automações em N8n, desenvolvimento com Vibe-Coding, uso de ferramentas Low-Code e No-Code, integração de sistemas, resolução de erros, otimização de fluxos e qualquer desafio técnico que esteja enfrentando.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Preciso ter conhecimento técnico avançado para participar?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Não! O Pronto-Socorro atende desde iniciantes com dúvidas básicas até usuários mais avançados com desafios complexos. Os monitores adaptam as explicações ao seu nível de conhecimento e garantem que você saia com a solução aplicável.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Quais são os horários das monitorias?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                As monitorias acontecem duas vezes ao dia: às 10h00 da manhã e às 18h30 da tarde. Com essa frequência, você sempre tem uma oportunidade próxima para resolver suas dúvidas urgentes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                As monitorias são gravadas?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Sim! Todas as sessões do Pronto-Socorro são gravadas e ficam disponíveis na plataforma. Assim você pode rever as soluções apresentadas, assistir monitorias que perdeu e consultar o conteúdo sempre que precisar.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Posso fazer perguntas sobre meu projeto específico?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Sim! O grande diferencial do Pronto-Socorro é justamente isso: você traz seus desafios reais, seus projetos em andamento e suas dúvidas específicas. Os monitores te ajudam a resolver exatamente o que você precisa no seu contexto.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Como faço para participar de uma monitoria?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                É muito simples! Você clica no link do Google Agenda disponível aqui na página. Se você for aluno e estiver no horário correto da monitoria (10h ou 18h30), ao clicar no link você será logado automaticamente e entrará direto na sala do Google Meet. Sem complicação, sem burocracia - é só clicar e participar.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Posso levar dúvidas sobre qualquer ferramenta de IA?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Sim! O Pronto-Socorro cobre todas as principais ferramentas e plataformas de IA do mercado: ChatGPT, Claude, Midjourney, N8n (nossa especialidade em automações), ferramentas de Vibe-Coding, plataformas Low-Code/No-Code e muito mais. Se envolve IA, os monitores podem te ajudar.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-12" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                E se eu não puder participar ao vivo?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Sem problemas! Como todas as monitorias são gravadas, você pode assistir depois. E melhor ainda: se sua dúvida for urgente e você não puder esperar, pode enviar no grupo de WhatsApp que também temos disponível.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-13" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Quantas pessoas participam de cada monitoria?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                São monitorias em grupo, o que permite networking e aprendizado coletivo. Você aprende não só com suas dúvidas, mas também com os desafios e soluções dos outros participantes. É uma comunidade colaborativa de aprendizado.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-14" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Qual a duração de cada sessão de monitoria?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Cada sessão tem 1 hora e 30 minutos de duração. Caso sua dúvida não seja respondida durante a monitoria por conta do tempo, não se preocupe: você pode enviar sua pergunta no grupo de WhatsApp e será atendido por lá.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-15" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Posso fazer perguntas sobre automações e integrações complexas?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Com certeza! Os monitores são especialistas em automações avançadas, integrações entre sistemas, workflows complexos em N8n e implementações sofisticadas de IA. Quanto mais desafiadora sua dúvida, melhor - eles adoram resolver problemas complexos.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-16" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Quem tem acesso ao Pronto-Socorro?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                O acesso varia conforme seu plano na Academia Lendária:
                <br/><br/>
                • <strong>Alunos da Formação, Gestor IA e Founders:</strong> acesso ilimitado a todos os encontros (manhã e tarde)
                <br/>
                • <strong>Alunos da Comunidade:</strong> acesso a uma monitoria por semana
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-17" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Como funciona a interação durante a monitoria?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Durante a sessão, você abre seu áudio e faz sua pergunta diretamente aos monitores. É uma interação em tempo real, onde você pode explicar seu problema e receber a solução de forma clara e aplicável.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-18" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Existe limite de quantas perguntas posso fazer em uma sessão?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                O Pronto-Socorro foi criado para resolver suas dúvidas sem burocracia. Durante as monitorias, você pode fazer suas perguntas e os monitores vão priorizando para garantir que todos sejam atendidos. Se o tempo não for suficiente, você continua sendo atendido pelo WhatsApp.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-19" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Posso compartilhar tela para mostrar meu problema?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Sim! Compartilhamento de tela é uma das melhores formas de resolver dúvidas técnicas rapidamente. Os monitores podem ver exatamente o que você está enfrentando e te guiar passo a passo para a solução.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-20" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                O que acontece se minha dúvida não for respondida durante a sessão?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Fique tranquilo! Se por qualquer motivo sua dúvida não for atendida nas 1h30 de monitoria, você pode enviá-la no grupo de WhatsApp dedicado e receberá o suporte necessário para resolver seu problema.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-21" className="bg-background/50 border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Sou aluno mas não estou conseguindo acessar o Pronto-Socorro. O que faço?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Se você está tendo problemas para acessar, entre em contato com nosso suporte pelo WhatsApp: <a href="https://wa.me/5548988000116" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+55 48 8800-0116</a>. Nossa equipe vai te ajudar a resolver qualquer questão de acesso rapidamente.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground text-center">
              <span>All Rights Reserved © 2025 Academia Lendár[IA]</span>
              <span className="hidden sm:inline">|</span>
              <div className="flex items-center gap-2 sm:gap-4">
                <a href="#" className="hover:text-white transition-colors">Políticas</a>
                <span>|</span>
                <a href="#" className="hover:text-white transition-colors">Termos</a>
              </div>
            </div>
            <img src={academiaLendariaLogo} alt="Academia Lendária" className="h-6 sm:h-8" />
          </div>
        </div>
      </footer>
    </div>;
}