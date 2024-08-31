// src/lib/websocket.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return socket;
};