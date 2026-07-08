import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { LoginCredentials, LoginResult } from '../model/login.model';

const USE_MOCK_LOGIN = true; // Set to true to bypass database fetches and load mock credentials
const MOCK_EMAIL = 'admin@blainewings.com';
const MOCK_PASSWORD = 'password123';

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

    if (USE_MOCK_LOGIN) {
      // Bypassing database authentication with mock credentials
      if (credentials.email === MOCK_EMAIL && credentials.password === MOCK_PASSWORD) {
        navigate('/admin/home');
        setIsLoading(false);
        return { success: true };
      } else {
        setErrorMsg('Invalid email or password (using simulated credentials).');
        setIsLoading(false);
        return { success: false, error: 'Invalid mock credentials' };
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      // Check if user is admin or staff using raw user metadata
      const userMetadata = data.user?.user_metadata || {};
      const role = userMetadata.role;

      if (role === 'admin' || role === 'staff') {
        navigate('/admin/home');
        setIsLoading(false);
        return { success: true };
      } else {
        // Sign out if unauthorized role
        await supabase.auth.signOut();
        setErrorMsg('Access denied. Admin or Staff privileges required.');
        setIsLoading(false);
        return { success: false, error: 'Unauthorized role' };
      }
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred.';
      setErrorMsg(msg);
      setIsLoading(false);
      return { success: false, error: msg };
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
