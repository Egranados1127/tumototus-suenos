'use client';

import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface ProgresoContratoProps {
  vehiculo: string;
  placa: string;
  porcentajeAvance: number;
  totalPagado: number;
  precioTotal: number;
  saldoPendiente: number;
  cuotaDiaria: number;
  estado: 'ACTIVO' | 'EN_MORA' | 'SUSPENDIDO' | 'LIBERADO';
  diasEnMora: number;
  fechaEstimadaLibre: string;
}

const estadoConfig = {
  ACTIVO:    { color: 'bg-green-100 text-green-800',  icono: CheckCircle,    label: '✅ Al día' },
  EN_MORA:   { color: 'bg-red-100 text-red-800',      icono: AlertTriangle,  label: '⚠️ En mora' },
  SUSPENDIDO:{ color: 'bg-gray-100 text-gray-800',    icono: Clock,          label: '⏸️ Suspendido' },
  LIBERADO:  { color: 'bg-blue-100 text-blue-800',    icono: CheckCircle,    label: '🎉 ¡Moto tuya!' },
};

export function ProgresoContrato({
  vehiculo, placa, porcentajeAvance, totalPagado,
  precioTotal, saldoPendiente, cuotaDiaria,
  estado, diasEnMora, fechaEstimadaLibre,
}: ProgresoContratoProps) {
  const cfg = estadoConfig[estado];
  const diasRestantes = Math.ceil(saldoPendiente / cuotaDiaria);
  const avanceRedondeado = Math.floor(porcentajeAvance);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold">{vehiculo}</h2>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
        <p className="text-blue-200 text-sm">Placa: {placa}</p>
      </div>

      <div className="p-5 space-y-5">
        {/* Barra de progreso */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Progreso hacia la propiedad
            </span>
            <span className="text-2xl font-bold text-blue-600">{avanceRedondeado}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                estado === 'EN_MORA' ? 'bg-red-500' :
                estado === 'LIBERADO' ? 'bg-green-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(avanceRedondeado, 100)}%` }}
            />
          </div>
        </div>

        {/* Alerta de mora */}
        {estado === 'EN_MORA' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 font-semibold text-sm">
              ⚠️ Llevas {diasEnMora} día{diasEnMora !== 1 ? 's' : ''} en mora
            </p>
            <p className="text-red-600 text-xs mt-1">
              Realiza un pago hoy para evitar intereses adicionales
            </p>
          </div>
        )}

        {/* Mensaje de liberación */}
        {estado === 'LIBERADO' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-700 font-bold">🎉 ¡La moto es tuya!</p>
            <p className="text-green-600 text-sm mt-1">Acércate a recoger tus documentos</p>
          </div>
        )}

        {/* Resumen financiero */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">💰 Total pagado</p>
            <p className="font-bold text-gray-900 text-sm">
              ${totalPagado.toLocaleString('es-CO')} COP
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">📉 Saldo pendiente</p>
            <p className="font-bold text-gray-900 text-sm">
              ${saldoPendiente.toLocaleString('es-CO')} COP
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs text-blue-600 mb-1">📅 Cuota diaria</p>
            <p className="font-bold text-blue-700 text-sm">
              ${cuotaDiaria.toLocaleString('es-CO')} COP
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">⏱️ Días restantes</p>
            <p className="font-bold text-gray-900 text-sm">
              {estado === 'LIBERADO' ? '0' : `~${diasRestantes}`} días
            </p>
          </div>
        </div>

        {/* Fecha estimada */}
        {estado !== 'LIBERADO' && (
          <p className="text-xs text-gray-400 text-center">
            Fecha estimada de liberación: {new Date(fechaEstimadaLibre).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  );
}
