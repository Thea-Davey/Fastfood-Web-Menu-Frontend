// lib/socket.ts
// Singleton Socket.io client for the kitchen staff app.
// Connect once per app lifetime; import `socket` everywhere you need it.

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? '';

// Lazy singleton — only connects when first imported.
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket'],
});
