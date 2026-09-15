'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ConductorDashboard() {
  const [contrato, setContrato] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simularemos la llamada con un auth token (hardcodeado o desde localStorage)
    const fetchContrato = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/v1/contratos/mi-contrato', {
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}` 
          }
        });
        if (res.ok) {
          const data = await res.json();
          setContrato(data);
        } else {
          setError('No tienes un contrato activo');
        }
      } catch (e) {
        setError('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchContrato();
  }, []);

  if (loading) return <div className="p-8">Cargando progreso...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">Rodando Sueños</h1>
          <p className="text-sm opacity-80 mt-1">TuMotoTusSueños</p>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-bold mb-1">{contrato.vehiculo}</h2>
          <span className={`inline-block px-3 py-1 text-sm rounded-full font-semibold ${
            contrato.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            Estado: {contrato.estado}
          </span>

          <div className="mt-6 text-center">
            <span className="inline-block bg-yellow-100 text-yellow-800 font-black px-6 py-2 rounded-full text-lg border-2 border-yellow-300 shadow-sm uppercase tracking-wide">
              Plazo Fijo: {contrato.plazoMeses} Meses
            </span>
            <p className="text-xs text-gray-500 mt-2 font-medium">Recuerda: Tu moto se libera al 100% de los pagos. No hay prórrogas.</p>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span>Progreso de pago</span>
              <span>{contrato.porcentajeAvance}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-1000 shadow-md" 
                style={{ width: `${contrato.porcentajeAvance}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-xs text-gray-500 uppercase font-bold">Abonado</p>
              <p className="text-lg font-bold text-green-600">
                ${contrato.totalPagado.toLocaleString('es-CO')}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-xs text-gray-500 uppercase font-bold">Por Pagar</p>
              <p className="text-lg font-bold text-red-500">
                ${contrato.saldoPendiente.toLocaleString('es-CO')}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center col-span-2">
              <p className="text-xs text-gray-500 uppercase font-bold">Cuota Diaria</p>
              <p className="text-xl font-bold text-blue-800">
                ${contrato.cuotaDiaria.toLocaleString('es-CO')}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/conductor/pagar">
              <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700">
                Reportar Pago Diario
              </button>
            </Link>
          </div>

          <div className="mt-10 border-t pt-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📅</span> Tu Historial de Pagos
            </h3>
            <div className="space-y-3">
              {contrato.totalPagado > 0 ? (
                <div className="bg-gray-50 border p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-gray-700">Abono Reciente</p>
                    <p className="text-xs text-gray-500">Subido vía App</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-bold">+${contrato.cuotaDiaria.toLocaleString('es-CO')}</p>
                    <span className="text-[10px] bg-green-100 text-green-800 px-2 py-1 rounded">APROBADO</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center italic">Aún no tienes pagos registrados.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
