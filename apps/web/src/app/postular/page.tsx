'use client';
import { API_URL } from '@/lib/api';
import { useState } from 'react';

const COLORES_PLAZO: Record<number, { border: string; badge: string; badgeText: string }> = {
  6:  { border: 'border-gray-200',   badge: 'bg-gray-100 text-gray-600',      badgeText: 'Pago rápido'   },
  12: { border: 'border-blue-300',   badge: 'bg-blue-100 text-blue-700',       badgeText: 'Popular'       },
  18: { border: 'border-yellow-400', badge: 'bg-yellow-400 text-yellow-900',   badgeText: '⭐ Recomendado' },
};

export default function PostulacionConductor() {
  const [valorMoto, setValorMoto]       = useState(6_000_000);
  const [simulaciones, setSimulaciones] = useState<any[]>([]);
  const [loading, setLoading]           = useState(false);
  const [errorApi, setErrorApi]         = useState('');

  const simular = async () => {
    setLoading(true);
    setErrorApi('');
    try {
      const res = await fetch(`${API_URL}/api/v1/contratos/simular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valorMoto }),
      });
      if (res.ok) {
        setSimulaciones(await res.json());
      } else {
        setErrorApi('El servidor está iniciando, espera 30 segundos e intenta de nuevo.');
      }
    } catch {
      setErrorApi('Sin conexión. Verifica tu internet.');
    } finally {
      setLoading(false);
    }
  };

  const [planSeleccionado, setPlanSeleccionado] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', cedula: '', telefono: '', ciudad: 'Bogotá', direccion: '',
  });
  const [enviando, setEnviando]   = useState(false);
  const [enviado, setEnviado]     = useState(false);

  const handlePostular = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/postulaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          motoDeseada: `Boxer CT 100 — $${valorMoto.toLocaleString('es-CO')}`,
          plazoDeseado: planSeleccionado.plazoMeses,
        }),
      });
      if (res.ok) {
        setEnviado(true);
        setPlanSeleccionado(null);
      } else {
        const err = await res.json();
        alert(`Error: ${err.message ?? 'Intenta de nuevo'}`);
      }
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">¡Solicitud Enviada!</h2>
          <p className="text-gray-500 mb-6">Un asesor de TuMotoTus Sueños te contactará en menos de 24 horas para validar tus documentos.</p>
          <button onClick={() => { setEnviado(false); setSimulaciones([]); }}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
            Simular otro plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col">

      {/* Modal de formulario */}
      {planSeleccionado && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 my-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <div className="bg-blue-100 p-2 rounded-xl"><span className="text-2xl">🛵</span></div>
              <div>
                <h2 className="text-xl font-black text-gray-800">Completa tu Solicitud</h2>
                <p className="text-sm text-gray-500">Plan {planSeleccionado.plazoMeses} meses · ${planSeleccionado.cuotaMensual.toLocaleString('es-CO')}/mes</p>
              </div>
            </div>

            <form onSubmit={handlePostular} className="space-y-3">
              {[
                { label: 'Nombres',          key: 'nombres',    type: 'text' },
                { label: 'Apellidos',         key: 'apellidos',  type: 'text' },
                { label: 'Cédula',            key: 'cedula',     type: 'text' },
                { label: 'Teléfono / WhatsApp', key: 'telefono', type: 'tel'  },
                { label: 'Dirección',          key: 'direccion', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
                  <input required type={type}
                    className="w-full border-2 border-gray-100 focus:border-blue-500 rounded-xl px-3 py-2.5 outline-none bg-gray-50 focus:bg-white transition"
                    value={(formData as any)[key]}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })} />
                </div>
              ))}

              <div className="border-t pt-4">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><span>📸</span> Documentos (KYC)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Cédula (Frontal)', 'Licencia de conducción', 'Recibo público', 'Selfie (Rostro)'].map((doc, i) => (
                    <div key={doc}>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{doc}</label>
                      <input type="file" accept="image/*" capture={i === 3 ? 'user' : undefined}
                        className="w-full text-xs border-2 border-dashed border-gray-200 rounded-lg p-1.5 bg-gray-50" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-xl text-xs text-blue-700 border border-blue-100">
                Al enviar autorizas el tratamiento de tus datos personales para validación de antecedentes y score crediticio. Ley 1581 de 2012.
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setPlanSeleccionado(null)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200">
                  Cancelar
                </button>
                <button type="submit" disabled={enviando}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-60">
                  {enviando ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="px-4 py-4 flex items-center gap-2">
        <span className="text-2xl">🛵</span>
        <div>
          <p className="text-white font-black text-sm">TuMotoTus Sueños</p>
          <p className="text-blue-200 text-xs">Simulador de Plan RTO</p>
        </div>
      </header>

      {/* Contenido */}
      <div className="flex-1 bg-white rounded-t-3xl px-4 pt-6 pb-10">
        <div className="max-w-xl mx-auto">

          <h1 className="text-2xl font-black text-gray-800 mb-1">Simula tu Plan</h1>
          <p className="text-gray-500 text-sm mb-6">
            Arrastra para elegir el valor de la moto. El plan incluye matrícula, SOAT, GPS y seguro.
          </p>

          {/* Slider */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-5 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Valor de la moto</p>
              <p className="text-2xl font-black text-blue-600">${valorMoto.toLocaleString('es-CO')}</p>
            </div>
            <input type="range" min="4000000" max="15000000" step="500000"
              value={valorMoto}
              onChange={e => { setValorMoto(Number(e.target.value)); setSimulaciones([]); }}
              className="w-full h-2 bg-blue-200 rounded-full appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>$4 millones</span>
              <span className="text-blue-500 font-bold">Boxer CT 100 ≈ $6M ↑</span>
              <span>$15 millones</span>
            </div>

            <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
              <p className="text-xs font-bold text-gray-500 mb-2">Capital total que financias:</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Moto</span><span>${valorMoto.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Matrícula + SOAT + Seguro + GPS + Casco</span><span>$1.970.000</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-800 mt-1">
                <span>Total a financiar</span>
                <span>${(valorMoto + 1_970_000).toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>

          <button onClick={simular} disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-60 text-lg mb-6">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Calculando...
              </span>
            ) : '📊 Ver mis opciones de pago'}
          </button>

          {errorApi && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm mb-4 flex gap-2">
              <span>⚠️</span><p>{errorApi}</p>
            </div>
          )}

          {/* Resultados */}
          {simulaciones.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-gray-800">Tus 3 Opciones (6 · 12 · 18 meses)</h3>

              {simulaciones.map((sim) => {
                const colores = COLORES_PLAZO[sim.plazoMeses];
                return (
                  <div key={sim.plazoMeses}
                    className={`bg-white rounded-2xl p-5 border-2 ${colores.border} shadow-md relative`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-3xl font-black text-gray-800">{sim.plazoMeses} <span className="text-lg text-gray-500">meses</span></h4>
                        <p className="text-xs text-gray-400">{sim.plazoMeses * 30} días</p>
                      </div>
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${colores.badge}`}>
                        {colores.badgeText}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400 font-bold">Por día</p>
                        <p className="text-lg font-black text-blue-600">${sim.cuotaDiaria.toLocaleString('es-CO')}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400 font-bold">Por semana</p>
                        <p className="text-lg font-black text-blue-600">${sim.cuotaSemanal.toLocaleString('es-CO')}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400 font-bold">Por mes</p>
                        <p className="text-lg font-black text-blue-600">${sim.cuotaMensual.toLocaleString('es-CO')}</p>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 flex justify-between mb-4 px-1">
                      <span>Abono moto/día: <strong className="text-gray-600">${sim.desglose.cuotaCapitalDiaria.toLocaleString('es-CO')}</strong></span>
                      <span>Alquiler/día: <strong className="text-gray-600">${sim.desglose.cuotaAlquilerDiaria.toLocaleString('es-CO')}</strong></span>
                    </div>

                    <button onClick={() => setPlanSeleccionado(sim)}
                      className={`w-full font-black py-3 rounded-xl transition ${
                        sim.recomendado
                          ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}>
                      {sim.recomendado ? '⭐ Postularme a este plan' : 'Postularme a este plan'}
                    </button>
                  </div>
                );
              })}

              <div className="bg-blue-50 p-4 rounded-2xl text-sm text-blue-800 border border-blue-100">
                <strong>💡 ¿Por qué el plan de 18 meses es el mejor?</strong>
                <p className="mt-1 text-blue-600">Pagas la cuota diaria más baja, tienes más margen para cubrir tus gastos y al finalizar la moto es 100% tuya en excelentes condiciones.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
