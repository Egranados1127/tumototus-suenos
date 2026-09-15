import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-xl">
              <span className="text-xl">🛵</span>
            </div>
            <h1 className="text-lg font-black tracking-tight text-gray-900">
              TuMoto<span className="text-blue-600">TusSueños</span>
            </h1>
          </div>
          <Link
            href="/admin/dashboard"
            className="text-xs font-bold bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg transition-colors"
          >
            ⚙️ Admin
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
            Estás a un clic de <br />
            <span className="text-blue-600">estrenar tu moto</span>
          </h2>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            El modelo Rent-to-Own más justo de Colombia. Trabaja para ti mismo y conviértete en dueño de tu moto.
          </p>

          {/* Botones principales */}
          <div className="flex flex-col gap-3 pt-4 w-full max-w-sm mx-auto">
            <Link
              href="/postular"
              className="bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-blue-700 shadow-xl shadow-blue-200 transition-transform hover:-translate-y-1 text-center"
            >
              🏍️ Simular mi Crédito
            </Link>

            <Link
              href="/conductor/pedidos"
              className="bg-white text-gray-900 font-bold text-lg px-8 py-4 rounded-full border-2 border-gray-200 hover:border-gray-900 transition-colors text-center"
            >
              🚀 Soy Conductor
            </Link>
          </div>
        </div>

        {/* Zona de pruebas */}
        <div className="mt-12 pt-6 border-t border-gray-200 w-full max-w-sm">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">
            Zona de Pruebas
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/qr/demo-comercio-123"
              className="block w-full bg-gray-900 text-white rounded-xl p-3 font-bold text-sm hover:bg-gray-800 text-center"
            >
              📸 Simular escanear QR (Cliente)
            </Link>
            <Link
              href="/admin/dashboard"
              className="block w-full bg-indigo-600 text-white rounded-xl p-3 font-bold text-sm hover:bg-indigo-700 text-center"
            >
              📊 Panel Administrativo
            </Link>
            <Link
              href="/conductor/pagar"
              className="block w-full bg-green-600 text-white rounded-xl p-3 font-bold text-sm hover:bg-green-700 text-center"
            >
              💳 Reportar Pago (Conductor)
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
