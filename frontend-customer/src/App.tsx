import React from 'react';
import { AppRoutes } from './routes';
import { CartProvider } from './context/CartContext';
import { SessionProvider } from './context/SessionContext';

const App: React.FC = () => {
  return (
    <SessionProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </SessionProvider>
  );
};

export default App;
