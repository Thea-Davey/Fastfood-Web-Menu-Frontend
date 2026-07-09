import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials, LoginResult } from '../model/login.model';

export const useLoginViewModel = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent): Promise<LoginResult> => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setErrorMsg('Please enter both email and password.');
      return { success: false, error: 'Empty fields' };
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg = json.message || 'Invalid email or password.';
        setErrorMsg(msg);
        return { success: false, error: msg };
      }

      // Store token and user info for use across the app
      localStorage.setItem('access_token', json.data?.access_token ?? json.access_token);
      localStorage.setItem('admin_user', JSON.stringify(json.data?.user ?? json.user));

      navigate('/admin/home');
      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    credentials,
    setCredentials,
    showPassword,
    setShowPassword,
    isLoading,
    errorMsg,
    handleLogin,
  };
};
