import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-xl">
              <span className="text-xl">🛵</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-gray-900">TuMoto<span className="text-blue-600">TusSueños</span></h1>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/dashboard" className="text-sm font-bold text-gray-600 hover:text-blue-600 hidden md:block">
              Acceso Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
            Estás a un clic de <br />
            <span className="text-blue-600">estrenar tu moto</span>
          </h2>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            El modelo Rent-to-Own más justo de Colombia. Trabaja para ti mismo y conviértete en dueño de tu herramienta de trabajo en tiempo récord.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link 
              href="/postular" 
              className="bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-blue-700 shadow-xl shadow-blue-200 transition-transform hover:-translate-y-1"
            >
              Simular mi Crédito
            </Link>
            
            <Link 
              href="/conductor/pedidos" 
              className="bg-white text-gray-900 font-bold text-lg px-8 py-4 rounded-full border-2 border-gray-200 hover:border-gray-900 transition-colors"
            >
              Soy Conductor (Ingresar)
            </Link>
          </div>
        </div>

        {/* Demo QR Shortcut */}
        <div className="mt-24 pt-8 border-t border-gray-200 w-full max-w-lg">
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-4">Zona de Pruebas (Marketplace)</p>
          <Link href="/qr/demo-comercio-123" className="block w-full bg-gray-900 text-white rounded-xl p-4 font-bold text-sm hover:bg-gray-800">
            📸 Simular escanear QR de Cliente
          </Link>
        </div>
      </main>
    </div>
  );
}
