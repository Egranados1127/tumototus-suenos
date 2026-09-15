'use client';
import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/api';

const ESTADOS: Record<string, { label: string; icon: string; color: string; paso: number }> = {
  SOLICITADO:  { label: 'Buscando conductor...', icon: '🔍', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', paso: 1 },
  ACEPTADO:    { label: 'Conductor asignado',    icon: '🛵', color: 'text-blue-600 bg-blue-50 border-blue-200',     paso: 2 },
  EN_CURSO:    { label: 'En camino a tu puerta', icon: '🚀', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', paso: 3 },
  COMPLETADO:  { label: '¡Pedido entregado!',    icon: '✅', color: 'text-green-600 bg-green-50 border-green-200',  paso: 4 },
  CANCELADO:   { label: 'Pedido cancelado',      icon: '❌', color: 'text-red-600 bg-red-50 border-red-200',        paso: 0 },
};

export default function TrackingPedidoPage({ params }: { params: { pedidoId: string } }) {
  const { pedidoId } = params;
  const [pedido, setPedido] = useState<any>(null);
  const [error, setError] = useState('');

  const cargarPedido = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/pedidos/${pedidoId}`);
      if (res.ok) {
        const data = await res.json();
        setPedido(data);
      }
    } catch {
      // Silently fail on polling
    }
  };

  useEffect(() => {
    cargarPedido();
    const interval = setInterval(cargarPedido, 5000);
    return () => clearInterval(interval);
  }, [pedidoId]);

  const estado = pedido ? (ESTADOS[pedido.estado] ?? ESTADOS['SOLICITADO']) : ESTADOS['SOLICITADO'];
  const pasos = ['Recibido', 'Asignado', 'En camino', 'Entregado'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 flex items-center gap-2">
        <span className="text-2xl">🛵</span>
        <div>
          <p className="text-white font-black text-sm">TuMotoTus Sueños</p>
          <p className="text-blue-200 text-xs">Seguimiento en tiempo real</p>
        </div>
      </header>

      {/* Contenido */}
      <div className="flex-1 bg-white rounded-t-3xl px-4 pt-6 pb-10 shadow-2xl">
        {/* Estado actual */}
        <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 mb-6 ${estado.color}`}>
          <span className="text-3xl">{estado.icon}</span>
          <div>
            <p className="font-black text-lg">{estado.label}</p>
            <p className="text-xs opacity-70">ID: {pedidoId.slice(0, 8)}...</p>
          </div>
          {pedido?.estado === 'SOLICITADO' && (
            <div className="ml-auto flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          )}
        </div>

        {/* Barra de progreso */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {pasos.map((paso, i) => (
              <div key={paso} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mb-1 ${
                  estado.paso > i ? 'bg-blue-600 text-white' :
                  estado.paso === i + 1 ? 'bg-blue-200 text-blue-700 ring-2 ring-blue-400 ring-offset-1' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {estado.paso > i ? '✓' : i + 1}
                </div>
                <p className={`text-xs text-center font-bold ${estado.paso > i ? 'text-blue-600' : 'text-gray-400'}`}>
                  {paso}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detalles del pedido */}
        {pedido ? (
          <div className="space-y-3 mb-6">
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">📦 Tu pedido</p>
              <p className="text-gray-800 font-medium">{pedido.descripcion}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">📍 Dirección de entrega</p>
              <p className="text-gray-800 font-medium">{pedido.direccionEntrega}</p>
            </div>
            {pedido.notas && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">💬 Notas</p>
                <p className="text-gray-800 font-medium">{pedido.notas}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {[1, 2].map(i => (
              <div key={i} className="bg-gray-100 rounded-2xl p-4 animate-pulse h-16" />
            ))}
          </div>
        )}

        {/* Chat (cuando hay conductor asignado) */}
        {pedido?.estado === 'ACEPTADO' || pedido?.estado === 'EN_CURSO' ? (
          <div className="border-2 border-blue-100 rounded-2xl p-4">
            <p className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
              <span>💬</span> Chat con el conductor
            </p>
            <p className="text-xs text-gray-400 text-center py-4">
              Chat disponible · Envía un mensaje al conductor
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
            <p className="text-sm text-blue-600 font-medium">
              ⏱️ Tiempo estimado de asignación: <strong>2-5 minutos</strong>
            </p>
            <p className="text-xs text-blue-400 mt-1">Esta página se actualiza automáticamente</p>
          </div>
        )}
      </div>
    </div>
  );
}
