import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminProfile } from '../model/profile.model';

export const useProfileViewModel = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (token === 'mock_token') {
        setProfile({
          id: 'mock-uuid',
          email: 'admin@blainewings.com',
          role: 'admin',
          name: 'Mock Admin',
          created_at: new Date().toLocaleDateString(),
        });
        return;
      }
      if (!token) return;

      const res = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch profile');

      const json = await res.json();
      const user = json.data?.user ?? json.user;

      if (user) {
        setProfile({
          id: user.id,
          email: user.email,
          role: user.role as 'admin' | 'staff',
          name: user.name || user.email,
          created_at: user.created_at
            ? new Date(user.created_at).toLocaleDateString()
            : undefined,
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    isLoading,
    handleLogout,
  };
};
