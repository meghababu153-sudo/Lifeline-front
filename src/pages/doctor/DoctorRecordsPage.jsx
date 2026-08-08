import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import DoctorLayout from "../../layouts/DoctorLayout";
import { FileText, User, Calendar } from "lucide-react";

function DoctorRecordsPage() {
  const { currentUser } = useAuth();
  const { reports, accessRequests, findPatient } = useAppData();

  // All reports that this doctor has access to (own uploads + approved access)
  const ownReports = reports.filter((r) => r.uploadedBy === currentUser.id);

  // Approved access grants
  const approvedAccess = accessRequests.filter(
    (req) => req.doctorId === currentUser.id && req.status === "APPROVED"
  );

  const accessibleFromApproval = reports.filter((r) =>
    approvedAccess.some((req) => req.patientId === r.patientId)
  ).filter((r) => !ownReports.some((own) => own.reportId === r.reportId));

  const allAccessible = [...ownReports, ...accessibleFromApproval];

  return (
    <DoctorLayout>
      <div className="p-10">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Medical Records</h1>
          <p className="text-slate-500 mt-2">
            Reports you uploaded + records you have been granted access to.
          </p>
        </div>

        {allAccessible.length === 0 ? (
          <div className="bg-white rounded-3xl border p-12 text-center text-slate-400">
            <FileText size={48} className="mx-auto mb-4 opacity-30" />
            <h2 className="text-xl font-semibold text-slate-600 mb-2">No records yet</h2>
            <p>Upload a patient report to see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allAccessible.map((r) => {
              const patient = findPatient(r.patientId);
              return (
                <div key={r.reportId} className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-5">
                    <div className="bg-blue-100 p-4 rounded-2xl shrink-0">
                      <FileText size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900">{r.fileName}</h3>
                      <div className="flex flex-wrap gap-4 mt-1.5 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <User size={13} />
                          {patient?.name || r.patientId} &nbsp;(<span className="font-mono">{r.patientId}</span>)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          {new Date(r.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span>{r.reportType}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                        {r.status}
                      </span>
                      {r.uploadedBy !== currentUser.id && (
                        <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
                          Approved Access
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-5 pt-5 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-500">
                    <div>
                      <p className="font-semibold text-slate-700 mb-0.5">Report ID</p>
                      <p className="font-mono">{r.reportId}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 mb-0.5">Uploaded By</p>
                      <p className="font-mono">{r.uploadedBy}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 mb-0.5">Uploader Role</p>
                      <p>{r.uploaderRole}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 mb-0.5">Verification</p>
                      <p className="text-green-600 font-semibold">{r.status}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </DoctorLayout>
  );
}

export default DoctorRecordsPage;
