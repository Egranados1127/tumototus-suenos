'use client';
import { API_URL } from '@/lib/api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PedidosRadarConductor() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPedidos = async () => {
    try {
      // Nota: En producción esto llevaría el Token JWT en los headers.
      // Aquí estamos llamando a nuestro endpoint que está disponible (o asumiendo un mock de login)
      const res = await fetch('${API_URL}/api/v1/pedidos/disponibles');
      if (res.ok) {
        const data = await res.json();
        setPedidos(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
    // En producción usaríamos WebSockets. Para el MVP haremos Polling cada 5 segundos
    const interval = setInterval(fetchPedidos, 5000);
    return () => clearInterval(interval);
  }, []);

  const aceptarPedido = async (pedidoId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/pedidos/${pedidoId}/aceptar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Simulamos el ID de un conductor para la prueba MVP
          'Authorization': 'Bearer MOCK_DRIVER_TOKEN'
        }
      });
      
      if (res.ok) {
        // Redirigir a la pantalla del viaje en curso
        router.push(`/conductor/pedidos/${pedidoId}`);
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || 'Alguien más tomó este pedido'}`);
        fetchPedidos(); // Actualiza la lista porque seguro ya se lo llevaron
      }
    } catch (err) {
      alert('Error de conexión.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Mobile */}
      <div className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Radar de Domicilios</h1>
          <p className="text-green-400 text-xs font-semibold flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
            Buscando pedidos...
          </p>
        </div>
        <button 
          onClick={() => router.push('/conductor')}
          className="text-sm bg-gray-800 px-3 py-1 rounded border border-gray-700 hover:bg-gray-700"
        >
          Mi Moto
        </button>
      </div>

      {/* Lista de Pedidos */}
      <div className="p-4 flex-1 space-y-4">
        {loading && pedidos.length === 0 && (
          <div className="text-center text-gray-500 mt-10">Escaneando zona...</div>
        )}

        {!loading && pedidos.length === 0 && (
          <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200 mt-10">
            <div className="text-5xl mb-4">🏍️</div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">No hay pedidos cerca</h2>
            <p className="text-sm text-gray-500">Mantén la app abierta para recibir nuevas solicitudes de los comercios afiliados.</p>
          </div>
        )}

        {pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              NUEVO
            </div>
            
            <div className="p-5">
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <span className="text-xl">🏪</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{pedido.comercio?.nombre || 'Comercio Asociado'}</h3>
                  <p className="text-sm text-gray-500">{pedido.comercio?.direccion}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-semibold text-gray-700">📦 Qué llevar:</p>
                <p className="text-gray-600 mb-2">{pedido.descripcion}</p>
                
                <p className="text-sm font-semibold text-gray-700">📍 A dónde:</p>
                <p className="text-gray-600">{pedido.direccionEntrega}</p>
                
                {pedido.notas && (
                  <div className="mt-2 text-xs bg-yellow-100 text-yellow-800 p-2 rounded">
                    <strong>Nota:</strong> {pedido.notas}
                  </div>
                )}
              </div>

              <button
                onClick={() => aceptarPedido(pedido.id)}
                className="w-full bg-black text-white font-bold text-lg py-4 rounded-xl active:scale-95 transition-transform uppercase tracking-wider shadow-md"
              >
                Tomar Pedido
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
