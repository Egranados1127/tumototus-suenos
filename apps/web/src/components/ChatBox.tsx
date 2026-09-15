'use client';
import { API_URL } from '@/lib/api';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatBoxProps {
  pedidoId: string;
  rol: 'cliente' | 'conductor';
}

interface Mensaje {
  rol: 'cliente' | 'conductor' | 'sistema';
  mensaje: string;
  timestamp: string;
}

export default function ChatBox({ pedidoId, rol }: ChatBoxProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Conectar al namespace default del API
    const newSocket = io('${API_URL}');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('unirse-sala', { pedidoId, rol });
    });

    newSocket.on('nuevo-mensaje', (msg: Mensaje) => {
      setMensajes((prev) => [...prev, msg]);
    });

    newSocket.on('sistema', (texto: string) => {
      setMensajes((prev) => [...prev, { rol: 'sistema', mensaje: texto, timestamp: new Date().toISOString() }]);
    });

    return () => {
      newSocket.close();
    };
  }, [pedidoId, rol]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enviarMensaje = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    
    socket.emit('enviar-mensaje', {
      pedidoId,
      rol,
      mensaje: input.trim()
    });
    
    setInput('');
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow border overflow-hidden h-[400px]">
      <div className="bg-blue-600 text-white font-bold p-3 text-sm">
        💬 Chat Seguro {rol === 'conductor' ? '(Con el Cliente)' : '(Con el Conductor)'}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {mensajes.map((m, idx) => {
          if (m.rol === 'sistema') {
            return <div key={idx} className="text-center text-xs text-gray-400 my-2">{m.mensaje}</div>
          }
          const esMio = m.rol === rol;
          return (
            <div key={idx} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${esMio ? 'bg-blue-100 text-blue-900 rounded-br-none' : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'}`}>
                <p className="font-bold text-xs mb-1 opacity-50">
                  {m.rol === 'conductor' ? '🛵 Conductor' : '👤 Cliente'}
                </p>
                <p>{m.mensaje}</p>
                <span className="text-[10px] opacity-50 float-right mt-1 ml-2">
                  {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={enviarMensaje} className="p-3 bg-white border-t flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 border bg-gray-50 rounded-full px-4 text-sm focus:outline-none focus:border-blue-500"
        />
        <button type="submit" disabled={!input.trim()} className="bg-blue-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center disabled:bg-gray-300">
          ➤
        </button>
      </form>
    </div>
  );
}
