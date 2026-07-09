import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { SocketProvider } from './context/SocketContext';
import './index.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SocketProvider>
        <AppRoutes />
      </SocketProvider>
    </BrowserRouter>
  );
};

export default App;
