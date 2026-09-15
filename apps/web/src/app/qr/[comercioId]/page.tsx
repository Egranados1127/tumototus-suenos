'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

const TIPOS_SERVICIO = [
  { id: 'paquete', icon: '📦', label: 'Paquete' },
  { id: 'mercado', icon: '🛒', label: 'Mercado' },
  { id: 'documentos', icon: '📄', label: 'Documentos' },
  { id: 'comida', icon: '🍕', label: 'Comida' },
];

export default function PedidoQRCliente() {
  const params = useParams();
  const router = useRouter();
  const comercioId = params.comercioId as string;

  const [tipoSeleccionado, setTipoSeleccionado] = useState('paquete');
  const [formData, setFormData] = useState({ descripcion: '', direccionEntrega: '', notas: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [pedidoCreado, setPedidoCreado] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_URL}/api/v1/pedidos/qr/${comercioId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descripcion: `[${tipoSeleccionado.toUpperCase()}] ${formData.descripcion}`,
          direccionEntrega: formData.direccionEntrega,
          notas: formData.notas,
        }),
      });

      const data = await res.json();

      if (res.ok && data?.id) {
        router.push(`/qr/tracking/${data.id}`);
      } else if (res.status >= 500) {
        setErrorMsg('El servidor está iniciando. Espera 30 segundos e intenta de nuevo.');
        setStatus('error');
      } else {
        setErrorMsg(data?.message ?? 'Error al crear el pedido. Intenta de nuevo.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Sin conexión. Verifica tu internet e intenta de nuevo.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col">
      {/* Header de confianza */}
      <header className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛵</span>
          <div>
            <p className="text-white font-black text-sm leading-none">TuMotoTus Sueños</p>
            <p className="text-blue-200 text-xs">Servicio certificado</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-green-500/20 text-green-300 text-xs font-bold px-3 py-1 rounded-full border border-green-400/30">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
          En línea
        </div>
      </header>

      {/* Garantía visual */}
      <div className="mx-4 mb-4 bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/20 flex gap-3">
        <div className="text-2xl">🔒</div>
        <div>
          <p className="text-white font-bold text-sm">Tu pedido está protegido</p>
          <p className="text-blue-200 text-xs">Conductor verificado · Seguro incluido · Soporte 24/7</p>
        </div>
      </div>

      {/* Tarjeta del formulario */}
      <div className="flex-1 bg-white rounded-t-3xl px-5 pt-6 pb-10 shadow-2xl">
        <h2 className="text-xl font-black text-gray-800 mb-1">¿Qué necesitas enviar?</h2>
        <p className="text-gray-500 text-sm mb-5">Completa el formulario y un conductor llegará pronto.</p>

        {/* Tipo de servicio */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Tipo de servicio
          </label>
          <div className="grid grid-cols-4 gap-2">
            {TIPOS_SERVICIO.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTipoSeleccionado(t.id)}
                className={`flex flex-col items-center gap-1 py-3 rounded-2xl border-2 transition-all ${
                  tipoSeleccionado === t.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-100 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{t.icon}</span>
                <span className={`text-xs font-bold ${tipoSeleccionado === t.id ? 'text-blue-600' : 'text-gray-500'}`}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Descripción del pedido *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Caja de medicamentos, ropa, llaves..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              📍 Dirección de entrega *
            </label>
            <input
              type="text"
              required
              placeholder="Calle 45 # 12-34, Barrio Centro..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800"
              value={formData.direccionEntrega}
              onChange={(e) => setFormData({ ...formData, direccionEntrega: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              💬 Instrucciones para el conductor
              <span className="text-gray-400 ml-1 normal-case">(opcional)</span>
            </label>
            <textarea
              placeholder="Timbrar en el piso 2, cobrar $15.000, es urgente..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white resize-none h-20 text-gray-800"
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            />
          </div>

          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm flex gap-2 items-start">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="font-bold">No se pudo crear el pedido</p>
                <p className="text-red-500 text-xs mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all disabled:opacity-60 text-lg mt-2"
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Asignando conductor...
              </span>
            ) : (
              '🛵 Solicitar Domiciliario Ahora'
            )}
          </button>
        </form>

        {/* Trust badges */}
        <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-gray-100">
          {['✅ Conductores verificados', '⚡ Respuesta rápida', '💬 Chat en tiempo real'].map((b) => (
            <p key={b} className="text-xs text-gray-400 font-medium text-center">{b}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
