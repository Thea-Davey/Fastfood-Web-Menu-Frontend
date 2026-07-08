import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { AdminProfile } from '../model/profile.model';

export const useProfileViewModel = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AdminProfile | null>({
    id: 'admin-uuid-1',
    email: 'admin@blainewings.com',
    role: 'admin',
    name: 'Admin User'
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          id: user.id,
          email: user.email || 'admin@blainewings.com',
          role: (user.user_metadata?.role as 'admin' | 'staff') || 'admin',
          name: user.user_metadata?.name || 'Admin User',
          created_at: user.created_at ? new Date(user.created_at).toLocaleDateString() : undefined
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Error during signout:', err);
      // Force navigation in case of error
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    isLoading,
    handleLogout
  };
};
