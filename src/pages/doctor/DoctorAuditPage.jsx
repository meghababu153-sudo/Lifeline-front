import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import DoctorLayout from "../../layouts/DoctorLayout";
import { Activity, Filter } from "lucide-react";
import { useState } from "react";

const ACTION_COLORS = {
  LOGIN: "bg-green-100 text-green-700",
  LOGOUT: "bg-slate-100 text-slate-600",
  SESSION_EXPIRED: "bg-orange-100 text-orange-700",
  REPORT_UPLOADED: "bg-blue-100 text-blue-700",
  ACCESS_REQUEST_CREATED: "bg-yellow-100 text-yellow-700",
  ACCESS_APPROVED: "bg-green-100 text-green-700",
  ACCESS_DENIED: "bg-red-100 text-red-700",
  REPORT_VIEWED: "bg-purple-100 text-purple-700",
};

function DoctorAuditPage() {
  const { currentUser } = useAuth();
  const { auditLogs } = useAppData();
  const [filter, setFilter] = useState("ALL");

  const myLogs = auditLogs.filter((l) => l.userId === currentUser.id);
  const filtered = filter === "ALL" ? myLogs : myLogs.filter((l) => l.action === filter);

  const uniqueActions = [...new Set(myLogs.map((l) => l.action))];

  return (
    <DoctorLayout>
      <div className="p-10">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Audit Log</h1>
          <p className="text-slate-500 mt-2">
            Every action you have performed in the system — recorded with timestamp.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Filter size={16} className="text-slate-400" />
          {["ALL", ...uniqueActions].map((a) => (
            <button
              key={a}
              onClick={() => setFilter(a)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                filter === a
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border p-12 text-center text-slate-400">
            <Activity size={48} className="mx-auto mb-4 opacity-30" />
            <p>No audit entries yet. Actions will appear here as you use the system.</p>
          </div>
        ) : (
          <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-slate-600 font-semibold">Log ID</th>
                  <th className="text-left px-6 py-4 text-slate-600 font-semibold">Action</th>
                  <th className="text-left px-6 py-4 text-slate-600 font-semibold">Details</th>
                  <th className="text-left px-6 py-4 text-slate-600 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((log) => (
                  <tr key={log.logId} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{log.logId}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${ACTION_COLORS[log.action] || "bg-slate-100 text-slate-600"}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{log.details}</td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </DoctorLayout>
  );
}

export default DoctorAuditPage;
