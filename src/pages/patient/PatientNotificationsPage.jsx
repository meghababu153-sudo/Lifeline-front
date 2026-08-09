import { useState, useEffect } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import { Bell, FileText, ClipboardList, Pill, CalendarDays, ClipboardCheck, CheckCircle, AlertTriangle, KeyRound, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import { Link } from "react-router-dom";

const TYPE_META = {
  report:       { color: "bg-green-50 border-green-200", dot: "bg-green-500", icon: FileText, label: "New Report" },
  request:      { color: "bg-orange-50 border-orange-200", dot: "bg-orange-500", icon: ClipboardList, label: "Access Request" },
  approved:     { color: "bg-blue-50 border-blue-200", dot: "bg-blue-500", icon: CheckCircle, label: "Access Approved" },
  denied:       { color: "bg-red-50 border-red-200", dot: "bg-red-500", icon: AlertTriangle, label: "Access Denied" },
  medication:   { color: "bg-purple-50 border-purple-200", dot: "bg-purple-500", icon: Pill, label: "Medication Reminder" },
  appointment:  { color: "bg-indigo-50 border-indigo-200", dot: "bg-indigo-500", icon: CalendarDays, label: "Appointment" },
  careplan:     { color: "bg-amber-50 border-amber-200", dot: "bg-amber-500", icon: ClipboardCheck, label: "Care Plan" },
};

// ── Live OTP banner shown to the patient when the doctor generates a code ─────
function OTPBanner({ patientId }) {
  const { otpStore } = useAppData();
  const entry = otpStore[patientId];
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Keep a live countdown
  useEffect(() => {
    if (!entry || entry.used) return;
    const update = () => {
      const left = Math.max(0, Math.round((new Date(entry.expiresAt) - new Date()) / 1000));
      setSecondsLeft(left);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [entry]);

  if (!entry || entry.used || secondsLeft <= 0) return null;

  const mm = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const ss = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <div className="bg-blue-600 text-white rounded-2xl p-5 mb-8 flex items-start gap-4">
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
        <KeyRound size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-base">Your doctor has requested an upload OTP</p>
        <p className="text-blue-100 text-sm mt-0.5">
          Read this code back to your doctor so they can upload your report.
          Do not share it with anyone else.
        </p>
        <div className="mt-3 flex items-center gap-4">
          <span className="font-mono text-4xl font-bold tracking-[0.25em] bg-white/15 px-5 py-2 rounded-xl">
            {entry.code}
          </span>
          <div className="text-sm">
            <div className={`flex items-center gap-1 font-mono font-semibold ${secondsLeft < 60 ? "text-red-300" : "text-blue-200"}`}>
              <Clock size={13} />
              {mm}:{ss}
            </div>
            <p className="text-blue-300 text-xs mt-0.5">remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PatientNotificationsPage() {
  const { currentUser } = useAuth();
  const {
    getPatientReports, getAccessRequestsForPatient, getPatientAppointments,
    getPatientMedications, getPatientCarePlan,
  } = useAppData();

  const reports = getPatientReports(currentUser.id);
  const requests = getAccessRequestsForPatient(currentUser.id);
  const appointments = getPatientAppointments(currentUser.id);
  const medications = getPatientMedications(currentUser.id);
  const carePlan = getPatientCarePlan(currentUser.id);

  const notifications = [
    // New reports
    ...reports.map((r) => ({
      id: r.reportId,
      type: "report",
      title: "New Report Available",
      body: `${r.uploaderName} uploaded "${r.fileName.replace(/_/g, " ")}" to your account.`,
      time: r.uploadedAt,
      link: "/patient/reports",
    })),

    // Pending access requests
    ...requests.filter((r) => r.status === "PENDING").map((r) => ({
      id: r.requestId,
      type: "request",
      title: "Access Request Received",
      body: `${r.doctorName} is requesting access to your previous medical records.`,
      time: r.requestedAt,
      link: "/patient/access-requests",
    })),

    // Approved requests
    ...requests.filter((r) => r.status === "APPROVED").map((r) => ({
      id: `${r.requestId}-approved`,
      type: "approved",
      title: "Access Request Approved",
      body: `You approved ${r.doctorName}'s access to your records. Access expires soon.`,
      time: r.approvedAt,
      link: "/patient/access-requests",
    })),

    // Upcoming appointments
    ...appointments.filter((a) => a.status === "Upcoming").map((a) => ({
      id: a.appointmentId,
      type: "appointment",
      title: "Upcoming Appointment",
      body: `${a.type} with ${a.doctorName} on ${a.date} at ${a.time} — ${a.location}.`,
      time: new Date(a.date + "T" + "09:00:00").toISOString(),
      link: "/patient/appointments",
    })),

    // Medication refill reminders (within 30 days)
    ...medications.filter((m) => {
      if (!m.refillDate) return false;
      const days = Math.ceil((new Date(m.refillDate) - new Date()) / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 30;
    }).map((m) => {
      const days = Math.ceil((new Date(m.refillDate) - new Date()) / (1000 * 60 * 60 * 24));
      return {
        id: `refill-${m.reportId}-${m.name}`,
        type: "medication",
        title: "Medication Refill Reminder",
        body: `${m.name} (${m.dosage}) refill due in ${days} day${days !== 1 ? "s" : ""} on ${new Date(m.refillDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}.`,
        time: new Date(m.refillDate).toISOString(),
        link: "/patient/medications",
      };
    }),

    // Overdue care plan items
    ...carePlan.filter((c) => c.dueDate && c.status !== "Completed" && new Date(c.dueDate) < new Date()).map((c) => ({
      id: `careplan-${c.itemId}`,
      type: "careplan",
      title: "Care Plan Item Overdue",
      body: `"${c.title}" was due on ${new Date(c.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}. Please review your care plan.`,
      time: c.dueDate + "T00:00:00Z",
      link: "/patient/care-plan",
    })),

  ].filter((n) => n.time).sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <PatientLayout>
      <div className="p-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-2">
            All recent activity across your Lifeline account.
          </p>
        </div>

        {/* Live OTP banner — appears when a doctor-generated OTP is pending */}
        <OTPBanner patientId={currentUser.id} />

        {notifications.length === 0 ? (
          <div className="bg-white border rounded-3xl p-12 text-center text-slate-400">
            <Bell size={48} className="mx-auto mb-4 opacity-30" />
            <p>No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => {
              const meta = TYPE_META[n.type] || TYPE_META.report;
              const Icon = meta.icon;
              return (
                <Link key={n.id} to={n.link || "#"}>
                  <div className={`flex items-start gap-4 border rounded-2xl p-5 hover:opacity-90 transition ${meta.color}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${meta.dot}`}>
                      <Icon size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className="font-semibold text-slate-800 text-sm">{n.title}</p>
                        <p className="text-xs text-slate-500 shrink-0">
                          {new Date(n.time).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{n.body}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PatientLayout>
  );
}

export default PatientNotificationsPage;
