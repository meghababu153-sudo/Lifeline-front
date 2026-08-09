import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import DoctorLayout from "../../layouts/DoctorLayout";
import { ClipboardList, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";

// ─── Sub-form ────────────────────────────────────────────────────────────────

function NewRequestForm({ currentUser, patients, myRequests, createAccessRequest }) {
  const [selectedId, setSelectedId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedId) return;
    createAccessRequest(selectedId, { id: currentUser.id, name: currentUser.name });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setSelectedId("");
  };

  const existingRequest = myRequests.find(
    (r) => r.patientId === selectedId && r.status !== "DENIED"
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-48">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Patient</label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Select a patient...</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.id})
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={!selectedId || !!existingRequest || submitted}
        className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50 text-sm"
      >
        {submitted
          ? "✓ Request Sent"
          : existingRequest
          ? `Already ${existingRequest.status}`
          : "Send Access Request"}
      </button>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function DoctorAccessRequestsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const {
    getAccessRequestsForDoctor,
    findPatient,
    createAccessRequest,
    patients,
  } = useAppData();

  const myRequests = getAccessRequestsForDoctor(currentUser.id);

  const getStatusBadge = (status) => {
    if (status === "PENDING") return "bg-orange-100 text-orange-700";
    if (status === "APPROVED") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  const getStatusIcon = (status) => {
    if (status === "APPROVED") return <CheckCircle size={14} className="inline mr-1" />;
    if (status === "DENIED") return <XCircle size={14} className="inline mr-1" />;
    return <Clock size={14} className="inline mr-1" />;
  };

  return (
    <DoctorLayout>
      <div className="p-10">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Access Requests</h1>
          <p className="text-slate-500 mt-2">
            Manage your requests to access previous patient medical records.
          </p>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 text-sm text-blue-700">
          <strong>How it works:</strong> When you request access to a patient's previous medical records,
          the patient receives the request and must approve it. You can only view their full history after
          approval. You always have access to reports <em>you</em> uploaded directly.
        </div>

        {/* New request */}
        <div className="bg-white border rounded-3xl p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-5">
            Request Access to a Patient's Records
          </h2>
          <NewRequestForm
            currentUser={currentUser}
            patients={patients}
            myRequests={myRequests}
            createAccessRequest={createAccessRequest}
          />
        </div>

        {/* Existing requests */}
        <div className="bg-white border rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Your Requests</h2>

          {myRequests.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <ClipboardList size={40} className="mx-auto mb-3 opacity-40" />
              <p>No access requests made yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => {
                const patient = findPatient(req.patientId);
                return (
                  <div
                    key={req.requestId}
                    className="flex items-center gap-5 p-5 border rounded-2xl hover:bg-slate-50 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800">
                        {patient?.name || req.patientId}
                      </p>
                      <p className="text-xs font-mono text-slate-500 mt-0.5">
                        {req.patientId}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Requested:{" "}
                        {new Date(req.requestedAt).toLocaleString("en-IN")}
                      </p>
                      {req.approvedAt && (
                        <p className="text-xs text-slate-400">
                          Responded:{" "}
                          {new Date(req.approvedAt).toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right flex flex-col items-end gap-2">
                      <span
                        className={`text-xs font-semibold px-4 py-2 rounded-full ${getStatusBadge(req.status)}`}
                      >
                        {getStatusIcon(req.status)}
                        {req.status}
                      </span>
                      {req.expiresAt && req.status === "APPROVED" && (
                        <p className="text-xs text-slate-400">
                          Expires:{" "}
                          {new Date(req.expiresAt).toLocaleDateString("en-IN")}
                        </p>
                      )}
                      {req.status === "APPROVED" && (
                        <button
                          onClick={() =>
                            navigate("/doctor/patients", {
                              state: { autoSelectPatientId: req.patientId },
                            })
                          }
                          className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                        >
                          View Records
                          <ChevronRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </DoctorLayout>
  );
}

export default DoctorAccessRequestsPage;
