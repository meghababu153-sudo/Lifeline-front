function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen p-6 flex flex-col">
      <h1 className="text-3xl font-bold text-blue-600 mb-10">
        Lifeline
      </h1>

      <nav className="space-y-3">
        <button className="w-full text-left px-4 py-3 rounded-xl bg-blue-100 text-blue-700 font-semibold">
          🏠 Dashboard
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-100">
          📅 Timeline
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-100">
          📄 Reports
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-100">
          💊 Medications
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-100">
          ⏰ Reminders
        </button>

        <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-100">
          ⚙️ Settings
        </button>
      </nav>

      <div className="mt-auto bg-slate-100 rounded-2xl p-4">
        <h3 className="font-semibold mb-2">
          Your data is secure
        </h3>

        <p className="text-sm text-slate-600">
          End-to-end encrypted and protected.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;