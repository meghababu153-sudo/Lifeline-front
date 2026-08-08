import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PatientLayout from "../../layouts/PatientLayout";
import { AlertOctagon, Phone, Pill, Heart, AlertTriangle, ShieldCheck, User } from "lucide-react";

function EmergencyProfilePage() {
  const { currentUser } = useAuth();
  const { getEmergencyProfile, findPatient } = useAppData();

  const profile = getEmergencyProfile(currentUser.id);
  const patient = findPatient(currentUser.id);

  if (!profile) return null;

  return (
    <PatientLayout>
      <div className="p-10 max-w-2xl">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
            <AlertOctagon size={32} className="text-red-600" />
            Emergency Profile
          </h1>
          <p className="text-slate-500 mt-2">
            Critical health information for emergency responders and healthcare providers.
          </p>
        </div>

        {/* Emergency card — styled for quick readability */}
        <div className="bg-red-600 text-white rounded-3xl p-8 mb-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <AlertOctagon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-red-200 text-sm font-medium">Emergency Medical Profile</p>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/15 rounded-2xl p-4">
              <p className="text-red-200 text-xs font-semibold mb-1">Blood Group</p>
              <p className="text-3xl font-black">{profile.bloodGroup || "Unknown"}</p>
            </div>
            <div className="bg-white/15 rounded-2xl p-4">
              <p className="text-red-200 text-xs font-semibold mb-1">Date of Birth</p>
              <p className="text-lg font-bold">
                {profile.dob ? new Date(profile.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
              </p>
              <p className="text-red-200 text-xs mt-0.5">
                {profile.dob ? `Age: ${new Date().getFullYear() - new Date(profile.dob).getFullYear()}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white border-2 border-red-200 rounded-2xl p-6 mb-4 shadow-sm">
          <h3 className="font-bold text-red-700 flex items-center gap-2 mb-4">
            <AlertTriangle size={18} /> Allergies
          </h3>
          {profile.allergies?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((a, i) => (
                <span key={i} className="bg-red-100 text-red-700 font-semibold text-sm px-4 py-2 rounded-full border border-red-200">
                  ⚠ {a}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No known allergies recorded.</p>
          )}
        </div>

        {/* Conditions */}
        <div className="bg-white border rounded-2xl p-6 mb-4 shadow-sm">
          <h3 className="font-bold text-purple-700 flex items-center gap-2 mb-4">
            <Heart size={18} /> Medical Conditions
          </h3>
          {profile.conditions?.length > 0 ? (
            <div className="space-y-2">
              {profile.conditions.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-700">{c}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No conditions recorded.</p>
          )}
        </div>

        {/* Current Medications */}
        <div className="bg-white border rounded-2xl p-6 mb-4 shadow-sm">
          <h3 className="font-bold text-green-700 flex items-center gap-2 mb-4">
            <Pill size={18} /> Current Medications
          </h3>
          {profile.currentMedications?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.currentMedications.map((m, i) => (
                <span key={i} className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full border border-green-200">
                  {m}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No medications recorded.</p>
          )}
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-blue-700 flex items-center gap-2 mb-4">
            <Phone size={18} /> Emergency Contacts
          </h3>
          {profile.emergencyContacts?.length > 0 ? (
            <div className="space-y-3">
              {profile.emergencyContacts.map((c, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.relation}</p>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    <Phone size={13} />
                    {c.phone}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No emergency contacts recorded.</p>
          )}
        </div>

        <div className="mt-6 flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <ShieldCheck size={18} className="text-slate-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500">
            This profile is compiled from your verified medical reports and account information.
            Keep your doctor informed of any changes to your medications, allergies, or conditions.
          </p>
        </div>

      </div>
    </PatientLayout>
  );
}

export default EmergencyProfilePage;
