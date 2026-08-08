import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PatientLayout from "../../layouts/PatientLayout";
import { ClipboardList, CheckCircle, XCircle, Clock } from "lucide-react";

function PatientAccessRequestsPage() {
  const { currentUser } = useAuth();
  const {
    getAccessRequestsForPatient,
    respondToAccessRequest,
    addAuditLog,
    findDoctor,
  } = useAppData();

  const requests = getAccessRequestsForPatient(currentUser.id);
  const [responding, setResponding] = useState(null);

  const handleRespond = (requestId, decision, doctorId) => {
    setResponding(requestId);
    setTimeout(() => {
      respondToAccessRequest(requestId, decision, currentUser.id);
      addAuditLog({
        userId: currentUser.id,
        role: "PATIENT",
        action: decision === "APPROVED" ? "ACCESS_APPROVED" : "ACCESS_DENIED",
        details: `Patient ${decision.toLowerCase()} access request ${requestId} from doctor ${doctorId}`,
        requestId,
        doctorId,
      });
      setResponding(null);
    }, 600);
  };

  const pending = requests.filter((r) => r.status === "PENDING");
  const resolved = requests.filter((r) => r.status !== "PENDING");

  const getStatusBadge = (status) => {
    if (status === "PENDING") return "bg-orange-100 text-orange-700";
    if (status === "APPROVED") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <PatientLayout>
      <div className="p-10">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Access Requests</h1>
          <p className="text-slate-500 mt-2">
            Review requests from doctors who want to access your previous medical records.
          </p>
        </div>

        {/* Pending */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Pending Requests
            {pending.length > 0 && (
              <span className="ml-2 bg-orange-100 text-orange-700 text-sm px-2.5 py-0.5 rounded-full font-semibold">
                {pending.length}
              </span>
            )}
          </h2>

          {pending.length === 0 ? (
            <div className="bg-white border rounded-2xl p-8 text-center text-slate-400">
              <CheckCircle size={40} className="mx-auto mb-3 opacity-30 text-green-400" />
              <p>No pending requests.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map((req) => {
                const doctor = findDoctor(req.doctorId);
                return (
                  <div key={req.requestId} className="bg-white border border-orange-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-900 text-lg">
                          {req.doctorName}
                        </p>
                        <p className="text-sm font-mono text-slate-500">{req.doctorId}</p>
                        {doctor?.specialization && (
                          <p className="text-sm text-slate-500 mt-0.5">{doctor.specialization}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-2">
                          Requested: {new Date(req.requestedAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shrink-0">
                        <Clock size={12} />
                        Pending
                      </span>
                    </div>

                    <div className="mt-4 p-4 bg-slate-50 rounded-2xl text-sm text-slate-600">
                      <strong>{req.doctorName}</strong> is requesting access to view your full medical
                      history. You can approve or deny this request.
                      If approved, access will expire in 7 days.
                    </div>

                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() => handleRespond(req.requestId, "APPROVED", req.doctorId)}
                        disabled={responding === req.requestId}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 text-sm"
                      >
                        <CheckCircle size={16} />
                        Approve Access
                      </button>
                      <button
                        onClick={() => handleRespond(req.requestId, "DENIED", req.doctorId)}
                        disabled={responding === req.requestId}
                        className="flex items-center gap-2 bg-red-100 text-red-700 px-6 py-3 rounded-xl font-semibold hover:bg-red-200 transition disabled:opacity-50 text-sm"
                      >
                        <XCircle size={16} />
                        Deny
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* History */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Request History</h2>

          {resolved.length === 0 ? (
            <div className="bg-white border rounded-2xl p-8 text-center text-slate-400">
              <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
              <p>No resolved requests yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resolved.map((req) => (
                <div key={req.requestId} className="bg-white border rounded-2xl p-5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800">{req.doctorName}</p>
                    <p className="text-xs font-mono text-slate-500">{req.doctorId}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(req.requestedAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getStatusBadge(req.status)}`}>
                    {req.status === "APPROVED" ? <CheckCircle size={12} className="inline mr-1" /> : <XCircle size={12} className="inline mr-1" />}
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </PatientLayout>
  );
}

export default PatientAccessRequestsPage;
