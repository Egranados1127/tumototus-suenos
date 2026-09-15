'use client';
import { useState } from 'react';

export default function NuevoContratoPage() {
  const [valorMoto, setValorMoto] = useState(4500000);
  const [porcentajeGanancia, setPorcentajeGanancia] = useState(30);
  const [simulaciones, setSimulaciones] = useState<any[]>([]);

  const simular = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/contratos/simular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valorMoto, porcentajeGanancia, plazosASimular: [12, 18, 24] })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulaciones(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Nuevo Contrato - Simulador RTO</h1>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Parámetros</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Valor Comercial Moto (COP)</label>
            <input 
              type="number" 
              className="w-full border rounded p-2"
              value={valorMoto}
              onChange={e => setValorMoto(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Ganancia Esperada (%)</label>
            <input 
              type="number" 
              className="w-full border rounded p-2"
              value={porcentajeGanancia}
              onChange={e => setPorcentajeGanancia(Number(e.target.value))}
            />
          </div>
          <button 
            onClick={simular}
            className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
          >
            Simular Cuotas
          </button>
        </div>

        <div>
          {simulaciones.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Opciones para el Conductor</h2>
              <div className="space-y-4">
                {simulaciones.map(sim => (
                  <div key={sim.plazoMeses} className="border rounded p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold">{sim.plazoMeses} meses</p>
                      <p className="text-sm text-gray-500">Precio total: ${sim.precioTotal.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">${sim.cuotaDiaria.toLocaleString()} / día</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
