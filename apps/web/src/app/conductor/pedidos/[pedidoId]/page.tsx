'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ChatBox from '@/components/ChatBox';

export default function ViajeEnCursoPage({ params }: { params: { pedidoId: string } }) {
  const router = useRouter();
  const pedidoId = params.pedidoId as string;
  
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completando, setCompletando] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/pedidos/${pedidoId}`)
      .then(res => res.json())
      .then(data => {
        setPedido(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pedidoId]);

  const completarPedido = async () => {
    setCompletando(true);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/pedidos/${pedidoId}/completar`, {
        method: 'PATCH'
      });
      if (res.ok) {
        alert("¡Pedido entregado! Buen trabajo.");
        router.push('/conductor/pedidos'); // Volver al radar
      }
    } finally {
      setCompletando(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando detalles del viaje...</div>;
  if (!pedido) return <div className="p-8 text-center text-red-500">Error al cargar el pedido.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Mobile */}
      <div className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50">
        <h1 className="text-xl font-bold text-center">Viaje en Curso</h1>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4">
        {/* Mapa simulado (Placeholder) */}
        <div className="bg-gray-300 rounded-2xl h-48 flex items-center justify-center shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <span className="text-4xl">🗺️</span>
          <span className="ml-2 text-gray-600 font-bold">Navegación GPS...</span>
        </div>

        {/* Info del Pedido */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Recoger en:</p>
              <p className="font-bold text-gray-800 text-lg">Comercio (Ferretería)</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-xl">🏪</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Entregar en:</p>
            <p className="font-black text-gray-900 text-xl">{pedido.direccionEntrega}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Paquete / Detalle:</p>
            <p className="text-gray-700">{pedido.descripcion}</p>
            
            {pedido.notas && (
              <div className="mt-3 text-sm bg-yellow-100 text-yellow-800 p-3 rounded-lg font-medium">
                ⚠️ Nota: {pedido.notas}
              </div>
            )}
          </div>

          <div className="mb-6">
            <ChatBox pedidoId={pedidoId} rol="conductor" />
          </div>

          <button
            onClick={completarPedido}
            disabled={completando}
            className="w-full bg-green-600 text-white font-black text-lg py-5 rounded-xl active:scale-95 transition-transform uppercase tracking-wider shadow-lg disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {completando ? 'Procesando...' : (
              <>
                <span>✅</span> Marcar como Entregado
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
