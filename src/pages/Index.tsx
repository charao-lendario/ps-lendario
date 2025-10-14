import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Linkedin, Instagram, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      avatar: '',
      social: {
        linkedin: '',
        instagram: '',
      },
    },
    {
      name: 'Adávio Tittoni',
      role: 'Desenvolvimento & Automações',
      type: 'Técnico',
      bio: 'Expert técnico em desenvolvimento e automações.',
      avatar: '',
      social: {
        linkedin: '',
        instagram: '',
      },
    },
  ];

  return (
    <div className="min-h-screen gradient-dark">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <div className="text-primary text-sm font-semibold tracking-wider uppercase mb-4">
                Academia Lendária
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                  Pronto-Socorro
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Sistema de monitoria ao vivo é exclusivo para alunos da <span className="text-primary font-semibold">Formação</span> e <span className="text-primary font-semibold">Founders</span>
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
          </div>
        </div>
      </section>

      {/* Featured Hosts */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Seus Hosts</h2>
            <p className="text-muted-foreground text-lg">
              Especialistas prontos para tirar suas dúvidas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {hosts.map((host) => (
              <Card key={host.name} className="shadow-card gradient-card hover:shadow-glow transition-smooth">
                <CardContent className="p-8 text-center space-y-6">
                  <Avatar className="h-32 w-32 mx-auto border-2 border-primary/20">
                    {host.avatar ? (
                      <AvatarImage src={host.avatar} alt={host.name} />
                    ) : (
                      <AvatarFallback className="text-4xl bg-gradient-primary">
                        {host.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{host.name}</h3>
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                      {host.type}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{host.role}</p>
                    <p className="text-muted-foreground">{host.bio}</p>
                  </div>

                  <div className="flex gap-2 justify-center">
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 px-4 bg-secondary/20">
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