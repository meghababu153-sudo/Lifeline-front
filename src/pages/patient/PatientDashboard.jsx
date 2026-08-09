import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PatientLayout from "../../layouts/PatientLayout";
import {
  FileText, ClipboardList, Activity, Pill, FlaskConical, CalendarDays,
  ClipboardCheck, Sparkles, Clipboard, ShieldAlert, ChevronRight,
  Bell, CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

function QuickCard({ icon: Icon, title, value, subtitle, color, to }) {
  return (
    <Link to={to}>
      <div className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={18} />
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition mt-1" />
        </div>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        <p className="text-sm font-semibold text-slate-700 mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </Link>
  );
}

function FeatureCard({ icon: Icon, title, description, to, color }) {
  return (
    <Link to={to}>
      <div className="bg-white rounded-2xl border p-5 hover:shadow-md transition cursor-pointer group flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm">{title}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
        </div>
        <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition shrink-0 mt-1" />
      </div>
    </Link>
  );
}

function PatientDashboard() {
  const { currentUser } = useAuth();
  const {
    getPatientReports, getAccessRequestsForPatient, findPatient,
    getPatientAppointments, getPatientCarePlan, getPatientMedications,
    getPatientLabTrends, getPatientTimeline,
  } = useAppData();

  if (!currentUser) return null;

  const patient = findPatient(currentUser.id);
  const reports = getPatientReports(currentUser.id);
  const accessRequests = getAccessRequestsForPatient(currentUser.id);
  const pendingRequests = accessRequests.filter((r) => r.status === "PENDING");
  const appointments = getPatientAppointments(currentUser.id);
  const upcomingAppts = appointments.filter((a) => a.status === "Upcoming");
  const carePlan = getPatientCarePlan(currentUser.id);
  const pendingCare = carePlan.filter((c) => c.status !== "Completed");
  const medications = getPatientMedications(currentUser.id);
  const labs = getPatientLabTrends(currentUser.id);
  const labCount = Object.keys(labs).length;
  const timeline = getPatientTimeline(currentUser.id);
  const recentReports = [...reports].slice(0, 3);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <PatientLayout>
      <div className="p-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-slate-500 text-sm">{today}</p>
          <h1 className="text-4xl font-bold text-slate-900 mt-1">
            Welcome back, {currentUser.name.split(" ")[0]} 👋
          </h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
            <span className="font-mono text-xs">{currentUser.displayId}</span>
            {patient?.bloodGroup && (
              <>
                <span className="w-1 h-1 bg-slate-400 rounded-full" />
                <span>Blood Group: <strong className="text-slate-700">{patient.bloodGroup}</strong></span>
              </>
            )}
          </div>
        </div>

        {/* Security notice */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8">
          <ShieldAlert size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            <strong>Your records are secure.</strong>{" "}
            All reports are uploaded exclusively by verified doctors — you own the information, they contribute it.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <QuickCard
            icon={FileText} title="Medical Reports" value={reports.length}
            subtitle="Verified by doctors" color="bg-blue-100 text-blue-600" to="/patient/reports"
          />
          <QuickCard
            icon={CalendarDays} title="Upcoming Appointments" value={upcomingAppts.length}
            subtitle={upcomingAppts[0]?.date ? `Next: ${upcomingAppts[0].date}` : "None scheduled"}
            color="bg-purple-100 text-purple-600" to="/patient/appointments"
          />
          <QuickCard
            icon={ClipboardCheck} title="Care Plan Items" value={pendingCare.length}
            subtitle="Active & pending" color="bg-orange-100 text-orange-600" to="/patient/care-plan"
          />
          <QuickCard
            icon={Bell} title="Access Requests" value={pendingRequests.length}
            subtitle={pendingRequests.length > 0 ? "Needs your review" : "All resolved"}
            color={pendingRequests.length > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}
            to="/patient/access-requests"
          />
        </div>

        <div className="grid xl:grid-cols-3 gap-6 mb-8">

          {/* Recent Reports */}
          <section className="xl:col-span-2 bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText size={17} className="text-blue-600" /> Recent Reports
              </h2>
              <Link to="/patient/reports" className="text-blue-600 text-xs font-semibold hover:underline">
                View All →
              </Link>
            </div>
            {recentReports.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <FileText size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No reports yet. Your doctor will upload them after consultation.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReports.map((r) => (
                  <Link key={r.reportId} to="/patient/reports">
                    <div className="flex items-center gap-4 p-4 border rounded-xl hover:bg-slate-50 transition">
                      <div className="bg-blue-100 p-2.5 rounded-xl shrink-0">
                        <FileText size={15} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{r.fileName.replace(/_/g, " ")}</p>
                        <p className="text-xs text-slate-500">{r.reportType} · {r.uploaderName}</p>
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0">
                        {r.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Pending Access Requests */}
          <section className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ClipboardList size={17} className="text-orange-600" /> Access Requests
              </h2>
              <Link to="/patient/access-requests" className="text-blue-600 text-xs font-semibold hover:underline">
                Manage →
              </Link>
            </div>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <CheckCircle size={32} className="mx-auto mb-2 opacity-30 text-green-400" />
                <p className="text-sm">No pending requests.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div key={req.requestId} className="p-4 border border-orange-200 bg-orange-50 rounded-xl">
                    <p className="font-semibold text-slate-800 text-sm">{req.doctorName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Requesting access to your records</p>
                    <Link
                      to="/patient/access-requests"
                      className="inline-block mt-2 text-xs font-semibold text-orange-700 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-lg transition"
                    >
                      Review →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Health features grid */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Your Health on Lifeline</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={Sparkles} title="Vitalis AI Assistant"
              description="Ask questions about your reports, medications, and health history in plain language."
              color="bg-blue-100 text-blue-600" to="/patient/vitalis"
            />
            <FeatureCard
              icon={Activity} title="Health Journey"
              description={`${timeline.length} events recorded — your chronological medical history.`}
              color="bg-indigo-100 text-indigo-600" to="/patient/journey"
            />
            <FeatureCard
              icon={FlaskConical} title="Lab Trends"
              description={`${labCount} biomarker${labCount !== 1 ? "s" : ""} tracked over time from your reports.`}
              color="bg-cyan-100 text-cyan-600" to="/patient/labs"
            />
            <FeatureCard
              icon={Pill} title="Medications"
              description={`${medications.length > 0 ? `${[...new Set(medications.map(m=>m.name))].length} medication(s) extracted from your reports.` : "Track medications from verified prescriptions."}`}
              color="bg-green-100 text-green-600" to="/patient/medications"
            />
            <FeatureCard
              icon={ClipboardCheck} title="Care Plan"
              description={`${pendingCare.length} active item${pendingCare.length !== 1 ? "s" : ""} — follow-ups, screenings, and health goals.`}
              color="bg-purple-100 text-purple-600" to="/patient/care-plan"
            />
            <FeatureCard
              icon={Clipboard} title="Visit Brief"
              description="Prepare for your next appointment — diagnoses, medications, follow-ups at a glance."
              color="bg-slate-100 text-slate-600" to="/patient/visit-brief"
            />
            <FeatureCard
              icon={CalendarDays} title="Appointments"
              description={`${upcomingAppts.length} upcoming appointment${upcomingAppts.length !== 1 ? "s" : ""}.`}
              color="bg-rose-100 text-rose-600" to="/patient/appointments"
            />
            <FeatureCard
              icon={FileText} title="All Reports"
              description={`${reports.length} verified report${reports.length !== 1 ? "s" : ""} from your doctors — view originals.`}
              color="bg-teal-100 text-teal-600" to="/patient/reports"
            />
            <FeatureCard
              icon={Bell} title="Notifications"
              description="Stay updated on new reports, access requests, and reminders."
              color="bg-amber-100 text-amber-600" to="/patient/notifications"
            />
          </div>
        </div>

      </div>
    </PatientLayout>
  );
}

export default PatientDashboard;
