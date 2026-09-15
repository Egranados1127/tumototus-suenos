import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 font-sans flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 backdrop-blur text-white p-2 rounded-xl">
            <span className="text-2xl">🛵</span>
          </div>
          <h1 className="text-xl font-black text-white">
            TuMoto<span className="text-yellow-300">TusSueños</span>
          </h1>
        </div>
        <Link
          href="/conductor/pedidos"
          className="text-xs font-bold bg-white/20 text-white hover:bg-white/30 px-3 py-2 rounded-lg transition-colors backdrop-blur"
        >
          Soy Conductor →
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8 text-center">
        <div className="max-w-md mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white text-xs font-bold px-4 py-2 rounded-full border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Plataforma activa · Colombia
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Estrena tu moto.<br />
            <span className="text-yellow-300">Trabaja para ti.</span>
          </h2>

          <p className="text-lg text-blue-100">
            El modelo Rent-to-Own más transparente de Colombia. Sin cuotas escondidas, sin letra pequeña.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 py-4">
            {[
              { v: '3-12', u: 'meses', l: 'Plazos flexibles' },
              { v: '0%', u: '', l: 'Cuota inicial' },
              { v: '100%', u: '', l: 'Tuya al final' },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/20">
                <p className="text-2xl font-black text-yellow-300">{s.v}<span className="text-sm">{s.u}</span></p>
                <p className="text-xs text-blue-200 mt-1">{s.l}</p>
              </div>
            ))}
          </div>

          {/* CTA principal */}
          <Link
            href="/postular"
            className="block w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-lg px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-yellow-500/30 hover:scale-105"
          >
            🏍️ Simular mi Plan Ahora
          </Link>

          {/* QR Demo */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20">
            <p className="text-xs text-blue-200 font-bold uppercase tracking-widest mb-3">
              📦 ¿Necesitas un domicilio?
            </p>
            <Link
              href="/qr/demo-comercio-123"
              className="block w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
            >
              Pedir domiciliario ahora
            </Link>
          </div>
        </div>
      </main>

      {/* Footer discreto con acceso admin */}
      <footer className="text-center py-3 text-xs text-blue-300">
        <span>© 2026 TuMotoTus Sueños · </span>
        <Link href="/admin/dashboard" className="hover:text-white underline underline-offset-2">
          Equipo
        </Link>
      </footer>
    </div>
  );
}
