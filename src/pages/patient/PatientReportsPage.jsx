import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PatientLayout from "../../layouts/PatientLayout";
import {
  FileText,
  ShieldCheck,
  Lock,
  Eye,
  Calendar,
  Stethoscope,
} from "lucide-react";
import OTPVerificationModal from "../../components/patient/OTPVerificationModal";

function PatientReportsPage() {
  const { currentUser } = useAuth();
  const { getPatientReports, addAuditLog } = useAppData();

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [unlockedReports, setUnlockedReports] = useState(new Set());

  const reports = getPatientReports(currentUser.id);

  const handleViewReport = (report) => {
    if (unlockedReports.has(report.reportId)) {
      // Already OTP-verified this session — allow direct view
      recordView(report);
      return;
    }
    setSelectedReport(report);
    setOtpModalOpen(true);
  };

  const recordView = (report) => {
    addAuditLog({
      userId: currentUser.id,
      role: "PATIENT",
      action: "REPORT_VIEWED",
      details: `Viewed report ${report.fileName}`,
      reportId: report.reportId,
    });
  };

  const handleOTPSuccess = () => {
    setOtpModalOpen(false);
    if (selectedReport) {
      setUnlockedReports((prev) => new Set([...prev, selectedReport.reportId]));
      recordView(selectedReport);
    }
  };

  return (
    <PatientLayout>
      <div className="p-10">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">My Medical Reports</h1>
          <p className="text-slate-500 mt-2">Verified medical documents uploaded by your doctors.</p>
        </div>

        {/* No-upload notice */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
          <Lock size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700">
            <strong>Official medical reports cannot be uploaded by patients.</strong>
            {" "}Only authorized doctors can upload official records into the system.
            This ensures all documents are genuine and prevents fake medical records.
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white border rounded-3xl p-12 text-center text-slate-400">
            <FileText size={48} className="mx-auto mb-4 opacity-30" />
            <h2 className="text-xl font-semibold text-slate-600 mb-2">No Reports Yet</h2>
            <p>Your doctor will upload reports to your account after your consultation.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {reports.map((r) => {
              const isUnlocked = unlockedReports.has(r.reportId);
              return (
                <div key={r.reportId} className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start gap-5">
                    <div className="bg-green-100 p-4 rounded-2xl shrink-0">
                      <FileText size={20} className="text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-900">{r.fileName}</h3>
                          <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={13} />
                              {new Date(r.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                            <span>{r.reportType}</span>
                            <span className="flex items-center gap-1.5">
                              <Stethoscope size={13} />
                              {r.uploaderName}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                            <ShieldCheck size={12} />
                            {r.status}
                          </span>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-500">
                        <div>
                          <p className="font-semibold text-slate-600 mb-0.5">Report ID</p>
                          <p className="font-mono">{r.reportId}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-600 mb-0.5">Uploaded By</p>
                          <p className="font-mono">{r.uploadedBy}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-600 mb-0.5">Role</p>
                          <p>{r.uploaderRole}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-600 mb-0.5">Verification</p>
                          <p className="text-green-600 font-semibold">{r.status}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => handleViewReport(r)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                            isUnlocked
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {isUnlocked ? (
                            <>
                              <Eye size={15} /> View Report
                            </>
                          ) : (
                            <>
                              <Lock size={15} /> Verify & View (OTP)
                            </>
                          )}
                        </button>
                      </div>

                      {/* AI Summary */}
                      {r.summary && r.summary.length > 0 && isUnlocked && (
                        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                          <p className="text-xs font-semibold text-blue-700 mb-2">Report Summary</p>
                          <ul className="space-y-1.5">
                            {r.summary.map((s, i) => (
                              <li key={i} className="text-sm text-slate-700">{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* OTP Modal */}
        {otpModalOpen && selectedReport && (
          <OTPVerificationModal
            patientId={currentUser.id}
            onSuccess={handleOTPSuccess}
            onClose={() => { setOtpModalOpen(false); setSelectedReport(null); }}
          />
        )}

      </div>
    </PatientLayout>
  );
}

export default PatientReportsPage;
