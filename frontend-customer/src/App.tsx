import React from 'react';
import { AppRoutes } from './routes';
import { CartProvider } from './context/CartContext';
import { SessionProvider } from './context/SessionContext';
import { useSession } from './context/SessionContext';
import InvalidQrScreen from './shared-components/InvalidQrScreen/InvalidQrScreen';

const SessionGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isReady, error } = useSession();

  if (!isReady) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Loading...</div>;
  }

  if (error) {
    return <InvalidQrScreen message={error} />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <SessionProvider>
      <SessionGate>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </SessionGate>
    </SessionProvider>
  );
};

export default App;
