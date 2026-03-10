export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Witaj w panelu! 👋</h1>
        <p className="text-gray-500 mt-2">Oto podsumowanie Twojego biznesu.</p>
      </header>

      {/* Przykładowe kafelki ze statystykami */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Nowe wiadomości</h3>
          <p className="text-3xl font-bold mt-2">14</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Aktywne widgety</h3>
          <p className="text-3xl font-bold mt-2">2</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Status abonamentu</h3>
          <p className="text-lg font-bold text-green-600 mt-2">Aktywny (Pro)</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[300px]">
        <h2 className="text-xl font-semibold mb-4">Twój kod do osadzenia</h2>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<script src="https://panel.kasperjanowski.com/chat-widget.js" data-client-id="TWOJE_ID"></script>`}
        </pre>
      </div>
    </div>
  );
}