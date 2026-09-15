'use client';
import { API_URL } from '@/lib/api';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConductorPagarPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contratoId, setContratoId] = useState('');
  const [cuotaDiaria, setCuotaDiaria] = useState(0);
  
  const [foto, setFoto] = useState<File | null>(null);
  const [metodoPago, setMetodoPago] = useState('NEQUI');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Para MVP, obtenemos el contrato
    fetch(`${API_URL}/api/v1/contratos/mi-contrato`)
      .then(res => res.json())
      .then(data => {
        setContratoId(data.contratoId);
        setCuotaDiaria(data.cuotaDiaria);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foto) {
      alert("Por favor adjunta la foto del comprobante");
      return;
    }
    if (!contratoId) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('valor', cuotaDiaria.toString());
    formData.append('metodoPago', metodoPago);
    formData.append('comprobante', foto);
    formData.append('nota', 'Pago reportado desde App Conductor');

    try {
      const res = await fetch(`${API_URL}/api/v1/contratos/${contratoId}/liquidaciones`, {
        method: 'POST',
        body: formData,
        // Authorization: Bearer TOKEN iría aquí
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        alert("Hubo un error al registrar el pago");
      }
    } catch (err) {
      alert("Error de red");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 max-w-md mx-auto min-h-screen bg-green-50 flex flex-col justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center border-t-4 border-green-500 w-full">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Registrado!</h2>
          <p className="text-gray-600 mb-6">Tu comprobante se ha subido exitosamente. Sigue así para liberar tu moto.</p>
          <button 
            onClick={() => router.push('/conductor')}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold"
          >
            Volver a mi moto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col">
      <div className="flex items-center mb-6 mt-4">
        <button onClick={() => router.push('/conductor')} className="text-gray-500 p-2">
          ← Volver
        </button>
        <h1 className="text-xl font-bold ml-2">Reportar Pago Diario</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <p className="text-sm text-gray-500 mb-1">Valor de tu cuota de hoy:</p>
        <p className="text-3xl font-bold text-blue-600">${cuotaDiaria.toLocaleString('es-CO')}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex-1">
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Método de Pago</label>
          <select 
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="w-full border rounded-lg p-3 bg-gray-50"
          >
            <option value="NEQUI">Nequi</option>
            <option value="TRANSFERENCIA">Transferencia / Bancolombia</option>
            <option value="EFECTIVO">Efectivo (en oficina)</option>
          </select>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-2">Comprobante (Pantallazo)</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50"
          >
            {foto ? (
              <p className="text-green-600 font-bold">📸 {foto.name}</p>
            ) : (
              <div>
                <span className="text-3xl block mb-2">🖼️</span>
                <span className="text-blue-600 font-semibold">Sube el comprobante aquí</span>
              </div>
            )}
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !foto}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? 'Subiendo...' : 'Enviar Reporte'}
        </button>
      </form>
    </div>
  );
}
