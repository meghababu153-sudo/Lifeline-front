import Sidebar from "../components/dashboard/Sidebar";

function Dashboard() {
  return (
    <div className="flex bg-slate-100">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-5xl font-bold">
          Dashboard
        </h1>

        <p className="text-slate-600 mt-4">
          Welcome to Lifeline.
        </p>
      </main>
    </div>
  );
}

export default Dashboard;