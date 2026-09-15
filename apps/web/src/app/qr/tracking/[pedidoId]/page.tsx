'use client';
import { useState, useEffect } from 'react';
import ChatBox from '@/components/ChatBox';

export default function TrackingPedidoPage({ params }: { params: { pedidoId: string } }) {
  const [pedido, setPedido] = useState<any>(null);

  useEffect(() => {
    // Polling simple para ver si el conductor ya lo aceptó
    const interval = setInterval(async () => {
      const res = await fetch(`${API_URL}/api/v1/pedidos/${params.pedidoId}`);
      if (res.ok) {
        const data = await res.json();
        setPedido(data.data);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [params.pedidoId]);

  if (!pedido) return <div className="p-8 text-center">Cargando tu domicilio...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Mapa Fake */}
        <div className="h-48 bg-gray-300 relative">
          <img src="https://www.google.com/maps/d/thumbnail?mid=16Jc_sB43X89j-i721Jv9h6Vw8E0&hl=en" alt="Mapa" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-blue-900 bg-opacity-20 flex justify-center items-center">
             <div className="bg-white p-3 rounded-xl shadow-lg text-center font-bold text-sm">
                📍 {pedido.estado === 'CREADO' ? 'Buscando conductor...' : pedido.estado === 'EN_CURSO' ? 'El conductor va en camino' : '¡Pedido Entregado!'}
             </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-black mb-2">Tu Domicilio</h2>
          <p className="text-sm text-gray-500 mb-6">{pedido.descripcion}</p>

          {(pedido.estado === 'EN_CURSO' || pedido.estado === 'CREADO') && (
            <div className="mt-4">
              <ChatBox pedidoId={params.pedidoId} rol="cliente" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
