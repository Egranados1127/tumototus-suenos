'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function RegistrarPagoPage() {
  const params = useParams();
  const contratoId = params.id as string;
  const [valor, setValor] = useState(16250);
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [nota, setNota] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);

  const registrarPago = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Nota: En producción, aquí se enviaría también la foto (FormData)
      const res = await fetch(`http://localhost:3001/api/v1/contratos/${contratoId}/liquidaciones`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ valor, metodoPago, nota })
      });
      
      if (res.ok) {
        const data = await res.json();
        setMensaje(data.mensajeEstado);
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Registrar Pago Diario</h1>
      
      {mensaje && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {mensaje}
        </div>
      )}

      <form onSubmit={registrarPago} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Valor a pagar (COP)</label>
          <input 
            type="number" 
            required
            className="w-full border rounded p-2"
            value={valor}
            onChange={e => setValor(Number(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Método de Pago</label>
          <select 
            className="w-full border rounded p-2"
            value={metodoPago}
            onChange={e => setMetodoPago(e.target.value)}
          >
            <option value="EFECTIVO">Efectivo</option>
            <option value="NEQUI">Nequi</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="WOMPI">Wompi (Pasarela)</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Comprobante (Foto)</label>
          <input type="file" className="w-full border rounded p-2" accept="image/*" />
          <p className="text-xs text-gray-500 mt-1">Sube la captura de pantalla si fue Nequi o transferencia.</p>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Nota (Opcional)</label>
          <input 
            type="text" 
            className="w-full border rounded p-2"
            value={nota}
            onChange={e => setNota(e.target.value)}
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white rounded py-2 font-bold hover:bg-blue-700"
        >
          Registrar Liquidación
        </button>
      </form>
    </div>
  );
}
