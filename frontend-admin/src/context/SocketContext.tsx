import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Determine the socket URL. Use the explicit SOCKET_URL or fallback to API_URL
    const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;
    
    // We only want the base URL without /api, but if VITE_API_URL has /api at the end, 
    // it's usually fine since socket.io connects to the origin anyway.
    
    const socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: true,
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Admin socket connected:', socketInstance.id);
      setIsConnected(true);
      
      // Tell the backend we are an admin so it adds us to the 'admin:room'
      socketInstance.emit('admin:join');
    });

    socketInstance.on('disconnect', () => {
      console.log('Admin socket disconnected');
      setIsConnected(false);
    });

    // Clean up on unmount
    return () => {
      socketInstance.emit('admin:leave');
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextValue => {
  return useContext(SocketContext);
};
