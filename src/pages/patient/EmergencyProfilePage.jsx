import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PatientLayout from "../../layouts/PatientLayout";
import {
  AlertOctagon, Phone, Pill, Heart, AlertTriangle, ShieldCheck,
  User, Users, ChevronDown, ChevronUp, CalendarDays, Droplets,
  ClipboardList, Stethoscope,
} from "lucide-react";

// ── Expandable family member card ─────────────────────────────────────────────
function FamilyMemberCard({ member }) {
  const [open, setOpen] = useState(false);

  const age = member.dob
    ? new Date().getFullYear() - new Date(member.dob).getFullYear()
    : null;

  const hasHealth = member.conditions?.length > 0 || member.medications?.length > 0 || member.allergies?.length > 0;

  return (
    <div className="border rounded-2xl overflow-hidden">
      {/* Header row — always visible */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition text-left"
      >
        <div className="w-11 h-11 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
          <User size={20} className="text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800">{member.name}</p>
          <p className="text-sm text-slate-500">
            {member.relation}
            {age && <span className="ml-2 text-slate-400">· Age {age}</span>}
            {member.bloodGroup && (
              <span className="ml-2 inline-flex items-center gap-1 text-red-600 font-medium">
                <Droplets size={11} /> {member.bloodGroup}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {hasHealth && (
            <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
              Health data
            </span>
          )}
          {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-5 pb-5 pt-1 border-t bg-slate-50 space-y-4">

          {/* Quick facts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {member.dob && (
              <div className="bg-white border rounded-xl p-3">
                <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                  <CalendarDays size={11} /> Date of Birth
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {new Date(member.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            )}
            {member.bloodGroup && (
              <div className="bg-white border rounded-xl p-3">
                <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                  <Droplets size={11} /> Blood Group
                </p>
                <p className="text-xl font-black text-red-600">{member.bloodGroup}</p>
              </div>
            )}
            {member.lastCheckup && (
              <div className="bg-white border rounded-xl p-3">
                <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                  <Stethoscope size={11} /> Last Checkup
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {new Date(member.lastCheckup).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            )}
          </div>

          {/* Conditions */}
          {member.conditions?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-purple-700 flex items-center gap-1.5 mb-2">
                <Heart size={12} /> Conditions
              </p>
              <div className="flex flex-wrap gap-2">
                {member.conditions.map((c, i) => (
                  <span key={i} className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-medium px-3 py-1.5 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergies */}
          {member.allergies?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-700 flex items-center gap-1.5 mb-2">
                <AlertTriangle size={12} /> Allergies
              </p>
              <div className="flex flex-wrap gap-2">
                {member.allergies.map((a, i) => (
                  <span key={i} className="bg-red-50 text-red-700 border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                    ⚠ {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Medications */}
          {member.medications?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-700 flex items-center gap-1.5 mb-2">
                <Pill size={12} /> Medications
              </p>
              <div className="flex flex-wrap gap-2">
                {member.medications.map((m, i) => (
                  <span key={i} className="bg-green-50 text-green-700 border border-green-200 text-xs font-medium px-3 py-1.5 rounded-full">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {member.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1.5">
                <ClipboardList size={12} /> Notes
              </p>
              <p className="text-sm text-slate-700">{member.notes}</p>
            </div>
          )}

          {/* Contact */}
          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
            >
              <Phone size={13} /> {member.phone}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function EmergencyProfilePage() {
  const { currentUser } = useAuth();
  const { getEmergencyProfile, getFamilyMembers } = useAppData();

  const profile = getEmergencyProfile(currentUser.id);
  const familyMembers = getFamilyMembers(currentUser.id);

  if (!profile) return null;

  return (
    <PatientLayout>
      <div className="p-10 max-w-2xl">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
            <AlertOctagon size={32} className="text-red-600" />
            Emergency &amp; Family
          </h1>
          <p className="text-slate-500 mt-2">
            Critical health information for emergency responders, plus your family health centre.
          </p>
        </div>

        {/* ── Emergency card ──────────────────────────────────────── */}
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
                {profile.dob
                  ? new Date(profile.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                  : "—"}
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
        <div className="bg-white border rounded-2xl p-6 mb-6 shadow-sm">
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

        {/* ── Family Centre ────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users size={18} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Family Health Centre</h2>
              <p className="text-sm text-slate-500">Monitor your family members' health profiles in one place.</p>
            </div>
          </div>

          {familyMembers.length === 0 ? (
            <div className="bg-white border rounded-2xl p-8 text-center text-slate-400">
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No family members added yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {familyMembers.map((member) => (
                <FamilyMemberCard key={member.memberId} member={member} />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
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
