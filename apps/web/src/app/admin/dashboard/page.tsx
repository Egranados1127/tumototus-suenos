'use client';
import { API_URL } from '@/lib/api';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [resumen, setResumen] = useState<any>(null);

  useEffect(() => {
    fetch('${API_URL}/api/v1/finanzas/resumen')
      .then(res => res.json())
      .then(data => setResumen(data))
      .catch(console.error);
  }, []);

  if (!resumen) return <div className="p-8">Cargando dashboard...</div>;
  if (resumen.statusCode) return <div className="p-8 text-red-500">Error: No autorizado o falló el backend.</div>;

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
