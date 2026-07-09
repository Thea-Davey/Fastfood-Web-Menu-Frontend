import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials, LoginResult } from '../model/login.model';

const MOCK_EMAIL = 'staff@blainewings.com';
const MOCK_PASSWORD = 'password123';

export function useLoginViewModel() {
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

    // Simulated local login for kitchen staff
    if (credentials.email === MOCK_EMAIL && credentials.password === MOCK_PASSWORD) {
      navigate('/staff/pending-orders');
      setIsLoading(false);
      return { success: true };
    } else {
      setErrorMsg('Invalid email or password.');
      setIsLoading(false);
      return { success: false, error: 'Invalid credentials' };
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
}
