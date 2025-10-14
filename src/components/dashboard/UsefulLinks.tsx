import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, Video, FileText, Users } from 'lucide-react';

const CATEGORY_ICONS = {
  gravacoes: Video,
  materiais: FileText,
  comunidade: Users,
};

const CATEGORY_LABELS = {
  gravacoes: 'Gravações',
  materiais: 'Materiais',
  comunidade: 'Comunidade',
};

export function UsefulLinks() {
  const { data: links, isLoading } = useQuery({
    queryKey: ['useful-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('useful_links')
        .select('*')
        .order('category')
        .order('display_order');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const groupedLinks = links?.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, typeof links>);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Links Úteis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupedLinks || {}).map(([category, categoryLinks]) => {
          const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
          const label = CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS];

          return (
            <Card key={category} className="shadow-card gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categoryLinks.map((link) => (
                  <Button
                    key={link.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {link.title}
                  </Button>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}