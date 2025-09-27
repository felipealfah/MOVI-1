import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, User, getCurrentUser } from '../lib/supabase';
import { mockUser } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if Supabase is configured
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key:', supabaseAnonKey ? 'exists' : 'missing');
    
    const configured = supabaseUrl && 
                      supabaseAnonKey && 
                      supabaseUrl !== 'https://placeholder.supabase.co' &&
                      supabaseAnonKey !== 'placeholder-key' &&
                      supabaseUrl.includes('supabase.co');
    
    console.log('Supabase configured:', configured);
    
    // If not configured, use mock data immediately
    if (!configured) {
      console.log('Using mock data');
      console.log('Setting mock user immediately');
      setUser(mockUser);
      setLoading(false);
      return;
    }

    // If configured, handle Supabase auth
    handleSupabaseAuth();
  }, []);

  const handleSupabaseAuth = async () => {
    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      setSupabaseUser(session?.user ?? null);
      
      if (session?.user) {
        await refreshUser();
      }
      
      setLoading(false);

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setSupabaseUser(session?.user ?? null);
        
        if (session?.user) {
          await refreshUser();
        } else {
          setUser(null);
        }
        
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Supabase auth error:', error);
      // Fallback to mock data if Supabase fails
      console.log('Falling back to mock data');
      setUser(mockUser);
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      console.log('User data refreshed:', userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const configured = supabaseUrl && supabaseUrl.includes('supabase.co');
    
    if (!configured) {
      // Mock login
      setUser(mockUser);
      return;
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string, name: string) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const configured = supabaseUrl && supabaseUrl.includes('supabase.co');
    
    if (!configured) {
      // Mock signup
      setUser({ ...mockUser, name, email, credits: 0 });
      return;
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        // Email confirmation is handled by Supabase settings
      },
    });

    if (error) throw error;

    // Return data so the UI can show confirmation message
    return data;
  };

  const signOut = async () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const configured = supabaseUrl && supabaseUrl.includes('supabase.co');
    
    if (!configured) {
      setUser(null);
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    supabaseUser,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};