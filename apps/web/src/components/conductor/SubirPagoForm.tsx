'use client';

import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Camera } from 'lucide-react';

interface ProgresoContrato {
  contratoId: string;
  vehiculo: string;
  placa: string;
  cuotaDiaria: number;
  totalPagado: number;
  precioTotal: number;
  porcentajeAvance: number;
  saldoPendiente: number;
  estado: 'ACTIVO' | 'EN_MORA' | 'SUSPENDIDO' | 'LIBERADO';
  diasEnMora: number;
  fechaEstimadaLibre: string;
}

interface SubirPagoFormProps {
  contrato: ProgresoContrato;
  onExito: (resultado: any) => void;
}

export function SubirPagoForm({ contrato, onExito }: SubirPagoFormProps) {
  const [valor, setValor] = useState(contrato.cuotaDiaria);
  const [metodoPago, setMetodoPago] = useState<string>('NEQUI');
  const [nota, setNota] = useState('');
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seleccionarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('La foto no puede superar 5MB');
      return;
    }
    setComprobante(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
  };

  const enviar = async () => {
    if (!comprobante && metodoPago !== 'EFECTIVO') {
      setError('Debes subir el comprobante de pago');
      return;
    }
    setEnviando(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('valor', String(valor));
      form.append('metodoPago', metodoPago);
      if (nota) form.append('nota', nota);
      if (comprobante) form.append('comprobante', comprobante);

      const token = localStorage.getItem('accessToken');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/contratos/${contrato.contratoId}/liquidaciones`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Error al registrar el pago');
      }

      const resultado = await res.json();
      onExito(resultado);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Valor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor a pagar (COP)
        </label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          min={1000}
        />
        <p className="text-xs text-gray-500 mt-1">
          Cuota diaria: ${contrato.cuotaDiaria.toLocaleString('es-CO')} COP
        </p>
      </div>

      {/* Método de pago */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Método de pago</label>
        <div className="grid grid-cols-2 gap-2">
          {['NEQUI', 'TRANSFERENCIA', 'EFECTIVO', 'WOMPI'].map((m) => (
            <button
              key={m}
              onClick={() => setMetodoPago(m)}
              className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                metodoPago === m
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {m === 'NEQUI' ? '📱 Nequi' : m === 'TRANSFERENCIA' ? '🏦 Transferencia' : m === 'EFECTIVO' ? '💵 Efectivo' : '💳 Wompi'}
            </button>
          ))}
        </div>
      </div>

      {/* Subir comprobante */}
      {metodoPago !== 'EFECTIVO' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foto del comprobante {metodoPago !== 'EFECTIVO' && <span className="text-red-500">*</span>}
          </label>
          <label className="block w-full cursor-pointer">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Comprobante" className="w-full rounded-lg object-cover max-h-48" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                  <span className="text-white ml-2 text-sm">Cambiar foto</span>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Toca para tomar o subir foto</p>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG o WebP — máx. 5MB</p>
              </div>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="hidden"
              onChange={seleccionarFoto}
            />
          </label>
        </div>
      )}

      {/* Nota opcional */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nota (opcional)</label>
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Ej: Pago del día lunes..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Botón enviar */}
      <button
        onClick={enviar}
        disabled={enviando}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {enviando ? '⏳ Registrando pago...' : `💸 Registrar $${valor.toLocaleString('es-CO')} COP`}
      </button>
    </div>
  );
}
