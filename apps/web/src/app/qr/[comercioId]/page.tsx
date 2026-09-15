'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

export default function PedidoQRCliente() {
  const params = useParams();
  const router = useRouter();
  const comercioId = params.comercioId as string; // UUID (qrToken)
  
  const [formData, setFormData] = useState({
    descripcion: '',
    direccionEntrega: '',
    notas: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${API_URL}/api/v1/pedidos/qr/${comercioId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/qr/tracking/${data.data.id}`);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full border-t-8 border-blue-600">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Pedido Solicitado!</h2>
          <p className="text-gray-600 mb-6">
            Un conductor de <strong className="text-blue-600">Rodando Sueños</strong> está en camino para recoger tu paquete.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="w-full font-bold bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200"
          >
            Enviar otro pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col p-4 sm:p-8">
      <div className="max-w-md mx-auto w-full">
        {/* Header App */}
        <div className="text-center mb-8 mt-4">
          <h1 className="text-3xl font-black text-white tracking-tight">Rodando Sueños</h1>
          <p className="text-blue-100 mt-2 font-medium">Servicio Express Garantizado</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
            ¿Qué necesitas enviar?
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Descripción del paquete o mandado
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 2 bultos de cemento, llaves, medicinas..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.descripcion}
                onChange={e => setFormData({...formData, descripcion: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Dirección de entrega
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Calle 45 # 12-34, Barrio..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.direccionEntrega}
                onChange={e => setFormData({...formData, direccionEntrega: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Notas para el conductor (Opcional)
              </label>
              <textarea
                placeholder="Timbrar en el segundo piso, cobrar $15.000..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-24 resize-none"
                value={formData.notas}
                onChange={e => setFormData({...formData, notas: e.target.value})}
              />
            </div>

            {status === 'error' && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                Hubo un error al crear el pedido. Revisa tu conexión.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-70 mt-4 text-lg"
            >
              {status === 'loading' ? 'Solicitando...' : 'Solicitar Domiciliario Ahora'}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-6 text-white/80 text-sm">
          <p>Tu paquete viaja seguro y respaldado.</p>
        </div>
      </div>
    </div>
  );
}
