import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import DoctorLayout from "../../layouts/DoctorLayout";
import {
  Upload,
  ClipboardList,
  FileText,
  Users,
  Activity,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function DoctorDashboard() {
  const { currentUser } = useAuth();
  const {
    reports,
    accessRequests,
    auditLogs,
    patients,
  } = useAppData();

  if (!currentUser) return null;

  // Stats
  const myUploads = reports.filter((r) => r.uploadedBy === currentUser.id);
  const myRequests = accessRequests.filter((r) => r.doctorId === currentUser.id);
  const pendingRequests = myRequests.filter((r) => r.status === "PENDING");
  const approvedRequests = myRequests.filter((r) => r.status === "APPROVED");
  const recentUploads = [...myUploads].slice(0, 4);
  const recentLogs = auditLogs.filter((l) => l.userId === currentUser.id).slice(0, 5);

  const stats = [
    {
      label: "My Uploads",
      value: myUploads.length,
      icon: Upload,
      color: "bg-blue-100 text-blue-700",
      link: "/doctor/records",
    },
    {
      label: "Pending Requests",
      value: pendingRequests.length,
      icon: ClipboardList,
      color: "bg-orange-100 text-orange-700",
      link: "/doctor/access-requests",
    },
    {
      label: "Approved Access",
      value: approvedRequests.length,
      icon: CheckCircle,
      color: "bg-green-100 text-green-700",
      link: "/doctor/access-requests",
    },
    {
      label: "Total Patients",
      value: patients.length,
      icon: Users,
      color: "bg-purple-100 text-purple-700",
      link: "/doctor/patients",
    },
  ];

  return (
    <DoctorLayout>
      <div className="p-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">
            Good Day, {currentUser.name} 👋
          </h1>
          <p className="text-slate-500 mt-2">
            {currentUser.specialization} &nbsp;•&nbsp; <span className="font-mono text-sm">{currentUser.displayId}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <Link key={i} to={s.link}>
                <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition cursor-pointer">
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${s.color} mb-4`}>
                    <Icon size={14} className="mr-1.5" />
                    {s.label}
                  </div>
                  <p className="text-4xl font-bold text-slate-900">{s.value}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Recent Uploads */}
          <section className="bg-white rounded-3xl border shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Upload size={18} className="text-blue-600" /> Recent Uploads
                </h2>
                <p className="text-slate-500 text-sm mt-1">Reports you have uploaded</p>
              </div>
              <Link to="/doctor/upload" className="text-blue-600 text-sm font-semibold hover:underline">
                + New Upload
              </Link>
            </div>

            {recentUploads.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <FileText size={40} className="mx-auto mb-3 opacity-40" />
                <p>No uploads yet. Start by uploading a patient report.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentUploads.map((r) => (
                  <div key={r.reportId} className="flex items-center gap-4 p-4 border rounded-2xl hover:bg-slate-50 transition">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <FileText size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{r.fileName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {r.reportType} &nbsp;•&nbsp; Patient: <span className="font-mono">{r.patientId}</span>
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full shrink-0">
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Access Requests */}
          <section className="bg-white rounded-3xl border shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <ClipboardList size={18} className="text-orange-600" /> Access Requests
                </h2>
                <p className="text-slate-500 text-sm mt-1">Your requests for patient records</p>
              </div>
              <Link to="/doctor/access-requests" className="text-blue-600 text-sm font-semibold hover:underline">
                View All
              </Link>
            </div>

            {myRequests.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <ClipboardList size={40} className="mx-auto mb-3 opacity-40" />
                <p>No access requests yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.slice(0, 4).map((req) => (
                  <div key={req.requestId} className="flex items-center gap-4 p-4 border rounded-2xl">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">
                        Patient: <span className="font-mono">{req.patientId}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Requested: {formatDate(req.requestedAt)}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      req.status === "PENDING" ? "bg-orange-100 text-orange-700" :
                      req.status === "APPROVED" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Activity */}
          <section className="bg-white rounded-3xl border shadow-sm p-8 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Activity size={18} className="text-purple-600" /> Recent Activity
                </h2>
                <p className="text-slate-500 text-sm mt-1">Your latest actions in the system</p>
              </div>
              <Link to="/doctor/audit" className="text-blue-600 text-sm font-semibold hover:underline">
                Full Audit Log
              </Link>
            </div>

            {recentLogs.length === 0 ? (
              <p className="text-slate-400 text-center py-6">No activity recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.logId} className="flex items-center gap-4 py-3 border-b last:border-0">
                    <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-700 font-medium">{log.action}</p>
                      <p className="text-xs text-slate-400">{log.details}</p>
                    </div>
                    <p className="text-xs text-slate-400 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </DoctorLayout>
  );
}

export default DoctorDashboard;
