import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PatientLayout from "../../layouts/PatientLayout";
import { CalendarDays, Stethoscope, MapPin, Clock, CheckCircle, Calendar, FileText } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "long", year: "numeric",
  });
}

function daysFromNow(dateStr) {
  const diff = Math.ceil((new Date(dateStr + "T00:00:00") - new Date()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 0) return `${Math.abs(diff)}d ago`;
  return `In ${diff} days`;
}

const TYPE_COLOR = {
  "Follow-up": "bg-blue-100 text-blue-700",
  "Routine Check-up": "bg-green-100 text-green-700",
  "Holter Monitor Review": "bg-purple-100 text-purple-700",
  "Consultation": "bg-orange-100 text-orange-700",
};

function AppointmentCard({ appt, isPast }) {
  const days = !isPast ? daysFromNow(appt.date) : null;

  return (
    <div className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition ${
      isPast ? "opacity-70" : ""
    }`}>
      <div className="flex items-start gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
          isPast ? "bg-slate-100" : "bg-blue-100"
        }`}>
          <Stethoscope size={24} className={isPast ? "text-slate-400" : "text-blue-600"} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{appt.doctorName}</h3>
              <p className="text-sm text-slate-500">{appt.specialization}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              {!isPast && days && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  days === "Today" ? "bg-green-600 text-white" :
                  days === "Tomorrow" ? "bg-blue-100 text-blue-700" :
                  "bg-slate-100 text-slate-600"
                }`}>
                  {days}
                </span>
              )}
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${TYPE_COLOR[appt.type] || "bg-slate-100 text-slate-600"}`}>
                {appt.type}
              </span>
              {isPast && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                  <CheckCircle size={11} /> Completed
                </span>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-4 pt-4 border-t text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar size={14} className="text-slate-400 shrink-0" />
              {formatDate(appt.date)}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock size={14} className="text-slate-400 shrink-0" />
              {appt.time}
            </div>
            <div className="flex items-start gap-2 text-slate-600 sm:col-span-2">
              <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
              {appt.location}
            </div>
            {appt.notes && (
              <div className="flex items-start gap-2 text-slate-600 sm:col-span-2">
                <FileText size={14} className="text-slate-400 shrink-0 mt-0.5" />
                {appt.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppointmentsPage() {
  const { currentUser } = useAuth();
  const { getPatientAppointments } = useAppData();

  const all = getPatientAppointments(currentUser.id);
  const upcoming = all
    .filter((a) => a.status === "Upcoming" || new Date(a.date + "T00:00:00") >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = all
    .filter((a) => a.status === "Completed" || new Date(a.date + "T00:00:00") < new Date())
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <PatientLayout>
      <div className="p-10">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
            <CalendarDays size={32} className="text-blue-600" />
            Appointments
          </h1>
          <p className="text-slate-500 mt-2">Your upcoming and past medical appointments.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-600 text-white rounded-2xl p-5">
            <p className="text-blue-200 text-sm font-medium">Upcoming</p>
            <p className="text-4xl font-bold mt-1">{upcoming.length}</p>
          </div>
          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Completed</p>
            <p className="text-4xl font-bold text-slate-800 mt-1">{past.length}</p>
          </div>
        </div>

        {all.length === 0 ? (
          <div className="bg-white border rounded-3xl p-12 text-center text-slate-400">
            <CalendarDays size={48} className="mx-auto mb-4 opacity-30" />
            <h2 className="text-xl font-semibold text-slate-600 mb-2">No appointments yet</h2>
            <p>Appointments scheduled by your doctor will appear here.</p>
          </div>
        ) : (
          <div className="space-y-10">

            {upcoming.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <CalendarDays size={20} className="text-blue-600" />
                  Upcoming Appointments
                </h2>
                <div className="space-y-4">
                  {upcoming.map((a) => <AppointmentCard key={a.appointmentId} appt={a} isPast={false} />)}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" />
                  Past Appointments
                </h2>
                <div className="space-y-4">
                  {past.map((a) => <AppointmentCard key={a.appointmentId} appt={a} isPast={true} />)}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </PatientLayout>
  );
}

export default AppointmentsPage;
