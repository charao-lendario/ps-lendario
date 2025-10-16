import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if admin is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (username === 'adm' && password === 'PSlend@rio88') {
      // Primeiro tenta fazer login
      let { error } = await supabase.auth.signInWithPassword({
        email: 'admin@pronto-socorro.com',
        password: 'PSlend@rio88'
      });
      
      // Se a conta não existe, cria automaticamente
      if (error && error.message.includes('Invalid login credentials')) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: 'admin@pronto-socorro.com',
          password: 'PSlend@rio88'
        });
        
        if (signUpError) {
          toast.error('Erro ao criar conta admin.');
          return false;
        }
        
        // Tenta login novamente após criar
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: 'admin@pronto-socorro.com',
          password: 'PSlend@rio88'
        });
        
        if (loginError) {
          toast.error('Erro ao fazer login.');
          return false;
        }
      } else if (error) {
        toast.error('Erro ao fazer login. Verifique suas credenciais.');
        return false;
      }
      
      setIsAuthenticated(true);
      toast.success('Login realizado com sucesso!');
      navigate('/admin');
      return true;
    }
    toast.error('Usuário ou senha incorretos');
    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    toast.success('Logout realizado com sucesso!');
    navigate('/');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
