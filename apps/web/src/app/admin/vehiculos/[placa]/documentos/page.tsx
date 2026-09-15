'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function DocumentosVehiculoPage() {
  const params = useParams();
  const placa = params.placa as string;
  const [tipo, setTipo] = useState('SOAT');
  const [fechaExpedicion, setFechaExpedicion] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [mensaje, setMensaje] = useState('');

  const subirDocumento = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/api/v1/vehiculos/${placa}/documentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Mock para form-data sin archivo real
        body: JSON.stringify({ tipo, fechaExpedicion, fechaVencimiento })
      });
      if (res.ok) {
        setMensaje('Documento guardado exitosamente');
      } else {
        const error = await res.json();
        setMensaje(`Error: ${error.message}`);
      }
    } catch (e) {
      console.error(e);
      setMensaje('Error de conexión');
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Subir Documento - {placa}</h1>
      {mensaje && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          {mensaje}
        </div>
      )}
      <form onSubmit={subirDocumento} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tipo de Documento</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)} className="w-full border rounded p-2">
            <option value="SOAT">SOAT</option>
            <option value="TECNICOMECANICA">Tecnomecánica</option>
            <option value="SEGURO_TODO_RIESGO">Seguro Todo Riesgo</option>
            <option value="TARJETA_PROPIEDAD">Tarjeta de Propiedad</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fecha Expedición</label>
          <input 
            type="date" 
            required 
            value={fechaExpedicion} 
            onChange={e => setFechaExpedicion(e.target.value)} 
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fecha Vencimiento</label>
          <input 
            type="date" 
            required 
            value={fechaVencimiento} 
            onChange={e => setFechaVencimiento(e.target.value)} 
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Archivo PDF o Imagen</label>
          <input type="file" className="w-full border rounded p-2" accept=".pdf,image/*" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 font-bold">
          Subir a MinIO
        </button>
      </form>
    </div>
  );
}
