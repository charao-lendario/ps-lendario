import { Navbar } from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function Admin() {
  const queryClient = useQueryClient();
  const [videoUrl, setVideoUrl] = useState('');
  const [highlightForm, setHighlightForm] = useState({
    guest_name: '',
    event_date: '',
    event_time: '',
    theme_title: '',
    tag: 'convidado' as 'convidado' | 'marketing',
    image_url: ''
  });
  const [testimonialForm, setTestimonialForm] = useState({
    student_name: '',
    video_url: ''
  });
  const [expertForm, setExpertForm] = useState({
    name: '',
    specialty: '',
    avatar_url: ''
  });

  // Fetch data
  const { data: videoSetting } = useQuery({
    queryKey: ['video-setting'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'how_it_works_video')
        .single();
      return data;
    }
  });

  const { data: highlights } = useQuery({
    queryKey: ['highlights'],
    queryFn: async () => {
      const { data } = await supabase
        .from('weekly_highlights')
        .select('*')
        .order('display_order');
      return data || [];
    }
  });

  const { data: testimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data } = await supabase
        .from('student_testimonials')
        .select('*')
        .order('display_order');
      return data || [];
    }
  });

  const { data: experts } = useQuery({
    queryKey: ['experts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('guests')
        .select('*')
        .order('display_order');
      return data || [];
    }
  });

  // Mutations
  const updateVideoMutation = useMutation({
    mutationFn: async (url: string) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: url })
        .eq('key', 'how_it_works_video');
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Vídeo atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['video-setting'] });
    }
  });

  const addHighlightMutation = useMutation({
    mutationFn: async (data: typeof highlightForm) => {
      const { error } = await supabase.from('weekly_highlights').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Destaque adicionado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      setHighlightForm({
        guest_name: '',
        event_date: '',
        event_time: '',
        theme_title: '',
        tag: 'convidado',
        image_url: ''
      });
    }
  });

  const deleteHighlightMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('weekly_highlights').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Destaque removido!');
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
    }
  });

  const addTestimonialMutation = useMutation({
    mutationFn: async (data: typeof testimonialForm) => {
      const { error } = await supabase.from('student_testimonials').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Depoimento adicionado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setTestimonialForm({ student_name: '', video_url: '' });
    }
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('student_testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Depoimento removido!');
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    }
  });

  const addExpertMutation = useMutation({
    mutationFn: async (data: typeof expertForm) => {
      const { error } = await supabase.from('guests').insert([{
        name: data.name,
        bio: data.specialty,
        avatar_url: data.avatar_url
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Especialista adicionado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['experts'] });
      setExpertForm({ name: '', specialty: '', avatar_url: '' });
    }
  });

  const deleteExpertMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('guests').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Especialista removido!');
      queryClient.invalidateQueries({ queryKey: ['experts'] });
    }
  });

  return (
    <div className="min-h-screen gradient-dark">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Painel Administrativo</h1>
        
        <Tabs defaultValue="video" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="video">Vídeo</TabsTrigger>
            <TabsTrigger value="highlights">Destaques</TabsTrigger>
            <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
            <TabsTrigger value="experts">Especialistas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="video">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Vídeo "Como Funciona"</h2>
              <div className="space-y-4">
                <div>
                  <Label>URL do YouTube (embed)</Label>
                  <Input
                    placeholder="https://www.youtube.com/embed/..."
                    value={videoUrl || videoSetting?.value || ''}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>
                <Button onClick={() => updateVideoMutation.mutate(videoUrl)}>
                  Salvar
                </Button>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="highlights">
            <Card className="p-6 space-y-6">
              <h2 className="text-2xl font-bold">Destaques da Semana</h2>
              
              <div className="grid gap-4">
                <div>
                  <Label>Nome do Convidado</Label>
                  <Input
                    value={highlightForm.guest_name}
                    onChange={(e) => setHighlightForm({...highlightForm, guest_name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={highlightForm.event_date}
                      onChange={(e) => setHighlightForm({...highlightForm, event_date: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>Horário</Label>
                    <Select
                      value={highlightForm.event_time}
                      onValueChange={(value) => setHighlightForm({...highlightForm, event_time: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10:00:00">10:00</SelectItem>
                        <SelectItem value="18:30:00">18:30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Título do Tema</Label>
                  <Input
                    value={highlightForm.theme_title}
                    onChange={(e) => setHighlightForm({...highlightForm, theme_title: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>Etiqueta</Label>
                  <Select
                    value={highlightForm.tag}
                    onValueChange={(value: 'convidado' | 'marketing') => setHighlightForm({...highlightForm, tag: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="convidado">Convidado</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>URL da Imagem</Label>
                  <Input
                    placeholder="https://..."
                    value={highlightForm.image_url}
                    onChange={(e) => setHighlightForm({...highlightForm, image_url: e.target.value})}
                  />
                </div>
                
                <Button onClick={() => addHighlightMutation.mutate(highlightForm)}>
                  Adicionar Destaque
                </Button>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Destaques Cadastrados</h3>
                <div className="space-y-2">
                  {highlights?.map((highlight: any) => (
                    <div key={highlight.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <p className="font-semibold">{highlight.guest_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(highlight.event_date).toLocaleDateString('pt-BR')} às {highlight.event_time}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteHighlightMutation.mutate(highlight.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="testimonials">
            <Card className="p-6 space-y-6">
              <h2 className="text-2xl font-bold">Depoimentos de Alunos</h2>
              
              <div className="grid gap-4">
                <div>
                  <Label>Nome do Aluno</Label>
                  <Input
                    value={testimonialForm.student_name}
                    onChange={(e) => setTestimonialForm({...testimonialForm, student_name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>URL do Vídeo</Label>
                  <Input
                    placeholder="/videos/nome-aluno.mp4"
                    value={testimonialForm.video_url}
                    onChange={(e) => setTestimonialForm({...testimonialForm, video_url: e.target.value})}
                  />
                </div>
                
                <Button onClick={() => addTestimonialMutation.mutate(testimonialForm)}>
                  Adicionar Depoimento
                </Button>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Depoimentos Cadastrados</h3>
                <div className="space-y-2">
                  {testimonials?.map((testimonial: any) => (
                    <div key={testimonial.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <p className="font-semibold">{testimonial.student_name}</p>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteTestimonialMutation.mutate(testimonial.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="experts">
            <Card className="p-6 space-y-6">
              <h2 className="text-2xl font-bold">Especialistas</h2>
              
              <div className="grid gap-4">
                <div>
                  <Label>Nome</Label>
                  <Input
                    value={expertForm.name}
                    onChange={(e) => setExpertForm({...expertForm, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>Especialidade/Descrição</Label>
                  <Textarea
                    value={expertForm.specialty}
                    onChange={(e) => setExpertForm({...expertForm, specialty: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>URL da Foto</Label>
                  <Input
                    placeholder="https://... ou /assets/..."
                    value={expertForm.avatar_url}
                    onChange={(e) => setExpertForm({...expertForm, avatar_url: e.target.value})}
                  />
                </div>
                
                <Button onClick={() => addExpertMutation.mutate(expertForm)}>
                  Adicionar Especialista
                </Button>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Especialistas Cadastrados</h3>
                <div className="space-y-2">
                  {experts?.map((expert: any) => (
                    <div key={expert.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <p className="font-semibold">{expert.name}</p>
                        <p className="text-sm text-muted-foreground">{expert.bio}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteExpertMutation.mutate(expert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
