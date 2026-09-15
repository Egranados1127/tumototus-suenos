'use client';
import { useRouter } from 'next/navigation';

export default function ExpedienteSolicitud() {
  const router = useRouter();

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen bg-gray-50">
      <div className="flex items-center mb-6">
        <button onClick={() => router.push('/admin/dashboard')} className="text-gray-500 font-bold mr-4 hover:text-black">
          ← Volver a la Bandeja
        </button>
        <h1 className="text-3xl font-bold">Expediente de Postulación</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna Izquierda: Datos del Postulante */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow border-t-4 border-blue-600">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Carlos Mario Ramírez</h2>
            <div className="space-y-3 text-sm">
              <p><strong className="text-gray-600">Cédula:</strong> 1.020.334.556</p>
              <p><strong className="text-gray-600">Teléfono:</strong> 301-555-1234</p>
              <p><strong className="text-gray-600">Ciudad:</strong> Bogotá, DC</p>
              <p><strong className="text-gray-600">Dirección Residencia:</strong> Cra 45 # 12-34 Sur</p>
              <p><strong className="text-gray-600">Categoría Licencia:</strong> A2 (Moto)</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-gray-800 mb-3">Plan Solicitado</h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="font-bold text-blue-800 text-lg">Yamaha FZ</p>
              <p className="text-sm text-gray-600 mb-2">Plazo: 12 Meses</p>
              <p className="text-xs text-gray-500 uppercase font-bold">Cuota Diaria a Pagar:</p>
              <p className="text-2xl font-black text-green-600">$18.055</p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Documentos (KYC) y Contrato */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🔎</span> Verificación de Documentos (KYC)
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-3 text-center">
                <p className="text-sm font-bold text-gray-600 mb-2">Cédula (Frontal)</p>
                <div className="bg-gray-200 h-32 rounded flex items-center justify-center text-gray-400">
                  📷 Imagen Cédula
                </div>
                <button className="text-blue-600 text-xs font-bold mt-2 hover:underline">Ampliar</button>
              </div>
              <div className="border rounded-lg p-3 text-center">
                <p className="text-sm font-bold text-gray-600 mb-2">Licencia de Conducción</p>
                <div className="bg-gray-200 h-32 rounded flex items-center justify-center text-gray-400">
                  📷 Imagen Licencia
                </div>
                <button className="text-blue-600 text-xs font-bold mt-2 hover:underline">Ampliar</button>
              </div>
              <div className="border rounded-lg p-3 text-center">
                <p className="text-sm font-bold text-gray-600 mb-2">Recibo Público (Dirección)</p>
                <div className="bg-gray-200 h-32 rounded flex items-center justify-center text-gray-400">
                  📷 Imagen Recibo Luz
                </div>
                <button className="text-blue-600 text-xs font-bold mt-2 hover:underline">Ampliar</button>
              </div>
              <div className="border rounded-lg p-3 text-center">
                <p className="text-sm font-bold text-gray-600 mb-2">Selfie Validada</p>
                <div className="bg-gray-200 h-32 rounded flex items-center justify-center text-gray-400">
                  👤 Foto Rostro
                </div>
                <span className="text-xs bg-green-100 text-green-800 font-bold px-2 py-1 rounded-full mt-2 inline-block">Match 98%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Borrador del Contrato</h2>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">Listo para firma</span>
            </div>
            
            <div className="bg-gray-50 border p-4 rounded-lg h-40 overflow-y-auto text-xs text-gray-600 font-serif leading-relaxed mb-4">
              <strong>CONTRATO DE ARRENDAMIENTO CON OPCIÓN A COMPRA (RENT-TO-OWN)</strong><br/><br/>
              Entre los suscritos, por una parte TU MOTO TUS SUEÑOS S.A.S..., y por la otra CARLOS MARIO RAMIREZ, identificado con C.C. 1020334556, acuerdan celebrar el presente contrato sobre la motocicleta YAMAHA FZ, bajo las siguientes cláusulas:<br/><br/>
              PRIMERA: El arrendatario se obliga a pagar un canon diario integral de $18.055 COP durante un plazo exacto de 360 días...
              SEGUNDA: El incumplimiento de 2 o más cánones diarios facultará al arrendador a bloquear el vehículo por GPS...
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  alert("¡Contrato Aprobado! Se ha enviado el SMS al conductor para la firma digital.");
                  router.push('/admin/dashboard');
                }}
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 shadow-md transition"
              >
                ✅ Aprobar y Generar Contrato
              </button>
              <button className="flex-1 bg-red-100 text-red-700 font-bold py-3 rounded-lg hover:bg-red-200 transition">
                ❌ Rechazar Solicitud
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
