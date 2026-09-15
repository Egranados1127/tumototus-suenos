'use client';
import { API_URL } from '@/lib/api';
import { useState } from 'react';

export default function PostulacionConductor() {
  const [valorMoto, setValorMoto] = useState(5000000);
  const [simulaciones, setSimulaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const simular = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/contratos/simular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valorMoto })
      });
      if (res.ok) {
        setSimulaciones(await res.json());
      }
    } finally {
      setLoading(false);
    }
  };

  const [planSeleccionado, setPlanSeleccionado] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', cedula: '', telefono: '', ciudad: 'Bogotá', direccion: ''
  });
  const [enviando, setEnviando] = useState(false);

  const handlePostular = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const payload = {
        ...formData,
        motoDeseada: `Moto de $${valorMoto.toLocaleString('es-CO')}`,
        plazoDeseado: planSeleccionado.plazoMeses
      };
      
      const res = await fetch(`${API_URL}/api/v1/postulaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert('¡Postulación enviada con éxito! Un administrador revisará tus documentos.');
        setPlanSeleccionado(null);
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4 sm:p-8">
      {/* Modal de Formulario */}
      {planSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 my-8">
            <h2 className="text-2xl font-bold mb-1">Completa tu Solicitud</h2>
            <p className="text-gray-500 text-sm mb-4">Plan elegido: {planSeleccionado.plazoMeses} meses</p>
            
            <form onSubmit={handlePostular} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">Nombres</label>
                <input required type="text" className="w-full border p-2 rounded mt-1" value={formData.nombres} onChange={e => setFormData({...formData, nombres: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Apellidos</label>
                <input required type="text" className="w-full border p-2 rounded mt-1" value={formData.apellidos} onChange={e => setFormData({...formData, apellidos: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Cédula</label>
                <input required type="text" className="w-full border p-2 rounded mt-1" value={formData.cedula} onChange={e => setFormData({...formData, cedula: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Teléfono</label>
                <input required type="text" className="w-full border p-2 rounded mt-1" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Dirección Completa</label>
                <input required type="text" className="w-full border p-2 rounded mt-1" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
              </div>

              {/* Sección de Documentos KYC */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">📸</span> Documentos Requeridos (KYC)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700">Foto Cédula (Frontal)</label>
                    <input type="file" accept="image/*" className="w-full text-xs border p-1 rounded mt-1" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700">Foto Licencia</label>
                    <input type="file" accept="image/*" className="w-full text-xs border p-1 rounded mt-1" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700">Recibo Público</label>
                    <input type="file" accept="image/*" className="w-full text-xs border p-1 rounded mt-1" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700">Selfie (Rostro)</label>
                    <input type="file" accept="image/*" className="w-full text-xs border p-1 rounded mt-1" capture="user" />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 border border-blue-100">
                Al enviar, aceptas que procesemos tus datos para validar tus antecedentes y score crediticio.
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setPlanSeleccionado(null)} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-300">Cancelar</button>
                <button type="submit" disabled={enviando} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
                  {enviando ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto w-full">
        
        <div className="text-center mb-8 mt-4">
          <h1 className="text-4xl font-black text-blue-600 tracking-tight">Postúlate como Conductor</h1>
          <p className="text-gray-600 mt-2 font-medium">Lleva una moto trabajando y conviértete en propietario.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Simula tu Plan</h2>
          <p className="text-sm text-gray-500 mb-6">Elige el valor comercial aproximado de la moto que quieres sacar.</p>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Valor de la Moto: ${valorMoto.toLocaleString('es-CO')}
            </label>
            <input 
              type="range" 
              min="3000000" 
              max="15000000" 
              step="500000"
              value={valorMoto} 
              onChange={(e) => setValorMoto(Number(e.target.value))}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>$3 Millones</span>
              <span>$15 Millones</span>
            </div>
          </div>

          <button 
            onClick={simular}
            className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition"
          >
            {loading ? 'Calculando...' : 'Ver Opciones de Pago'}
          </button>
        </div>

        {simulaciones.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 ml-2">Tus Opciones (3 a 12 Meses)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {simulaciones.map((sim, i) => (
                <div key={i} className={`bg-white rounded-2xl p-5 border-2 ${sim.plazoMeses === 12 ? 'border-blue-500 shadow-blue-100' : 'border-gray-100'} shadow-lg relative`}>
                  {sim.plazoMeses === 12 && (
                    <span className="absolute -top-3 left-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      MÁS POPULAR
                    </span>
                  )}
                  <h4 className="text-2xl font-black text-gray-800 mb-1">{sim.plazoMeses} Meses</h4>
                  <p className="text-sm text-gray-500 mb-4 border-b pb-4">Plan a {sim.plazoMeses * 30} días</p>
                  
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase">Cuota Diaria Todo Incluido</p>
                    <p className="text-3xl font-bold text-blue-600">${sim.cuotaDiaria.toLocaleString('es-CO')}</p>
                  </div>
                  
                  <button 
                    onClick={() => setPlanSeleccionado(sim)}
                    className="w-full bg-blue-50 text-blue-700 font-bold py-2 rounded-lg hover:bg-blue-100"
                  >
                    Postularme a este plan
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
              <strong>¿Cómo funciona el cálculo?</strong> A menor tiempo (ej: 3 meses), pagas la moto más rápido pero el alquiler diario sube por el riesgo. A mayor tiempo (12 meses), el alquiler diario es el más barato del mercado (aprox $13.300) dándote la cuota más suave.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
