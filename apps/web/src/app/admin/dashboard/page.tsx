'use client';
import { API_URL } from '@/lib/api';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const ADMIN_PIN = '1234';

export default function AdminDashboardPage() {
  const [pin, setPin] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [resumen, setResumen] = useState<any>(null);
  const [cargando, setCargando] = useState(false);
  const [apiError, setApiError] = useState('');

  const verificarPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setAutenticado(true);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  useEffect(() => {
    if (!autenticado) return;
    setCargando(true);
    fetch(`${API_URL}/api/v1/finanzas/resumen`)
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => setResumen(data))
      .catch(err => setApiError(err === 503 ? 'Servidor iniciando, recarga en 30s' : 'Backend no disponible'))
      .finally(() => setCargando(false));
  }, [autenticado]);

  // Pantalla de PIN
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-2xl font-black text-gray-800 mb-1">Acceso Restringido</h1>
          <p className="text-gray-500 text-sm mb-6">Panel administrativo de TuMotoTus Sueños</p>
          <form onSubmit={verificarPin} className="space-y-4">
            <input
              type="password"
              placeholder="PIN de acceso"
              maxLength={4}
              className={`w-full text-center text-2xl font-bold tracking-[0.5em] px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                pinError ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'
              }`}
              value={pin}
              onChange={e => setPin(e.target.value)}
            />
            {pinError && <p className="text-red-500 text-sm font-bold">PIN incorrecto</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Entrar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (cargando) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin text-5xl mb-4">⚙️</div>
        <p className="text-gray-600 font-bold">Cargando métricas...</p>
        <p className="text-gray-400 text-sm">El servidor puede tardar 30 segundos si estaba inactivo</p>
      </div>
    </div>
  );

  if (apiError) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow text-center max-w-sm">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="font-bold text-gray-700">{apiError}</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">
          Reintentar
        </button>
      </div>
    </div>
  );

  if (!resumen) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard General</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Ingresos Totales</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            ${resumen.totalIngresos.toLocaleString('es-CO')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Capital en Calle (Saldo)</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            ${resumen.saldoPendienteGlobal.toLocaleString('es-CO')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Contratos Activos</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {resumen.contratosActivos}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Motos en Mora</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {resumen.contratosEnMora}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PANEL IZQUIERDO: Bandeja de Postulaciones (Nuevos) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gray-800 p-4 flex justify-between items-center">
              <h2 className="text-white font-bold flex items-center">
                <span className="mr-2">📥</span> Bandeja de Aprobaciones (Nuevos Conductores)
              </h2>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">2 Pendientes</span>
            </div>
            
            <div className="divide-y">
              {/* Mock Solicitud 1 */}
              <div className="p-4 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Carlos Mario Ramírez</p>
                  <p className="text-sm text-gray-500">C.C. 1.020.334.556 • Tel: 301-555-1234</p>
                  <div className="mt-2 flex gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold">Yamaha FZ</span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-semibold">Plan: 12 Meses</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href="/admin/dashboard/solicitud">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded shadow w-full">
                      Ver Expediente
                    </button>
                  </Link>
                  <button className="text-red-500 hover:text-red-700 text-sm font-bold py-1 px-4">
                    Rechazar
                  </button>
                </div>
              </div>

              {/* Mock Solicitud 2 */}
              <div className="p-4 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Luis Fernando Gómez</p>
                  <p className="text-sm text-gray-500">C.C. 80.123.456 • Tel: 310-444-9876</p>
                  <div className="mt-2 flex gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold">Boxer CT 100</span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-semibold">Plan: 6 Meses</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href="/admin/dashboard/solicitud">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded shadow w-full">
                      Ver Expediente
                    </button>
                  </Link>
                  <button className="text-red-500 hover:text-red-700 text-sm font-bold py-1 px-4">
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: Gestión de Flota / Usuarios */}
        <div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-gray-800 p-4">
              <h2 className="text-white font-bold flex items-center">
                <span className="mr-2">🏍️</span> Flota en Calle
              </h2>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3 pb-3 border-b">
                <div>
                  <p className="font-bold text-gray-800 text-sm">Yamaha FZ (ABC123D)</p>
                  <p className="text-xs text-green-600 font-bold">● AL DÍA</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Conductor:</p>
                  <p className="text-sm font-semibold">Juan Perez</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3 pb-3 border-b">
                <div>
                  <p className="font-bold text-gray-800 text-sm">Honda CB125 (XYZ987)</p>
                  <p className="text-xs text-red-600 font-bold">● EN MORA (2 días)</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Conductor:</p>
                  <p className="text-sm font-semibold">Andrés Soto</p>
                </div>
              </div>

              <button className="w-full text-blue-600 text-sm font-bold hover:underline mt-2">
                Ver todos los usuarios...
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-xl shadow text-white">
            <h2 className="text-lg font-bold mb-2">Motos Liberadas</h2>
            <div className="flex items-center">
              <span className="text-5xl font-black mr-4">{resumen.contratosLiberados}</span>
              <p className="text-sm text-blue-100 leading-tight">
                Conductores han cumplido su sueño de tener moto propia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
