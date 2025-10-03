import { supabase } from './supabase';

const ADMIN_EMAIL = 'admin@ephraimumunnakwe.com';
const ADMIN_PASSWORD = '@Phenomenal1Sensational2';

export const authenticateAdmin = async (password: string): Promise<boolean> => {
  if (password !== ADMIN_PASSWORD) return false;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    if (error) throw error;
    return !!data.user;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('Auth check:', { user: !!user, error });
    if (error) {
      console.error('Auth error:', error);
      return false;
    }
    return !!user;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// For client-side quick check (non-async)
export const isAuthenticatedSync = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const session = localStorage.getItem('sb-cecsvrwibdvncrxbbctr-auth-token');
    return session !== null;
  } catch {
    return false;
  }
};