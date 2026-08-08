import PatientLayout from "../../layouts/PatientLayout";
import { User, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";

function PatientProfilePage() {
  const { currentUser } = useAuth();
  const { findPatient } = useAppData();

  const patient = findPatient(currentUser?.id);

  return (
    <PatientLayout>
      <div className="p-10 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Profile</h1>
          <p className="text-slate-500 mt-2">Your account details in Lifeline.</p>
        </div>

        <div className="bg-white border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <User size={36} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{currentUser?.name}</h2>
              <p className="text-green-600 font-mono text-sm mt-0.5">{currentUser?.displayId}</p>
              <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                PATIENT
              </span>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            {[
              { label: "Patient ID", value: currentUser?.displayId, mono: true },
              { label: "Full Name", value: patient?.name },
              { label: "Blood Group", value: patient?.bloodGroup },
              { label: "Role", value: "Patient" },
              { label: "Portal", value: "Patient Portal (/patient)" },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b last:border-0">
                <span className="text-sm text-slate-500">{row.label}</span>
                <span className={`text-sm font-semibold text-slate-800 ${row.mono ? "font-mono" : ""}`}>
                  {row.value || "—"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <ShieldCheck size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              As a patient, you can view your verified medical reports, manage doctor access requests,
              and control who can see your medical history. You cannot upload official medical reports.
            </p>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}

export default PatientProfilePage;
