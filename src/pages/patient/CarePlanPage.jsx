import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PatientLayout from "../../layouts/PatientLayout";
import {
  ClipboardCheck, AlertTriangle, Clock, CheckCircle, RefreshCw,
  Stethoscope, Shield, Heart, Microscope, ChevronDown,
} from "lucide-react";

const CATEGORY_META = {
  "Follow-up": { icon: Stethoscope, color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  "Monitoring": { icon: RefreshCw, color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  "Screening": { icon: Microscope, color: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  "Preventive": { icon: Shield, color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  "Chronic": { icon: Heart, color: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

const PRIORITY_BADGE = {
  "High": "bg-red-100 text-red-700",
  "Medium": "bg-orange-100 text-orange-700",
  "Low": "bg-slate-100 text-slate-600",
};

const STATUS_BADGE = {
  "Pending": "bg-orange-50 border-orange-200 text-orange-700",
  "Ongoing": "bg-blue-50 border-blue-200 text-blue-700",
  "Completed": "bg-green-50 border-green-200 text-green-700",
  "Overdue": "bg-red-50 border-red-200 text-red-700",
};

function isOverdue(item) {
  return item.dueDate && item.status !== "Completed" && new Date(item.dueDate) < new Date();
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function CarePlanPage() {
  const { currentUser } = useAuth();
  const { getPatientCarePlan, updateCarePlanItem } = useAppData();
  const [filter, setFilter] = useState("All");

  const items = getPatientCarePlan(currentUser.id);
  const categories = ["All", ...new Set(items.map((i) => i.category))];

  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);
  const pending = filtered.filter((i) => i.status !== "Completed" && !isOverdue(i));
  const overdue = filtered.filter((i) => isOverdue(i));
  const completed = filtered.filter((i) => i.status === "Completed");

  const handleMarkDone = (itemId) => {
    updateCarePlanItem(itemId, { status: "Completed" });
  };

  function CarePlanCard({ item }) {
    const overdue = isOverdue(item);
    const effectiveStatus = overdue ? "Overdue" : item.status;
    const days = daysUntil(item.dueDate);
    const catMeta = CATEGORY_META[item.category] || CATEGORY_META["Follow-up"];
    const CatIcon = catMeta.icon;

    return (
      <div className={`bg-white border rounded-2xl p-5 shadow-sm ${
        overdue ? "border-red-200 bg-red-50/30" : ""
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${catMeta.color}`}>
              <CatIcon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-1.5">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_BADGE[effectiveStatus]}`}>
                  {effectiveStatus === "Overdue" ? <AlertTriangle size={10} className="inline mr-1" /> : null}
                  {effectiveStatus}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${PRIORITY_BADGE[item.priority]}`}>
                  {item.priority} Priority
                </span>
              </div>
              <h3 className="font-bold text-slate-900 leading-snug">{item.title}</h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.description}</p>

              {item.dueDate && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                  <Clock size={11} />
                  Due: {new Date(item.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  {days !== null && (
                    <span className={overdue ? "text-red-600 font-semibold" : days <= 14 ? "text-orange-600 font-semibold" : ""}>
                      {overdue ? ` (${Math.abs(days)}d overdue)` : days === 0 ? " (today)" : ` (${days}d)`}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {item.status !== "Completed" && (
            <button
              onClick={() => handleMarkDone(item.itemId)}
              className="shrink-0 flex items-center gap-1.5 text-xs font-semibold bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 transition"
            >
              <CheckCircle size={13} />
              Done
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <PatientLayout>
      <div className="p-10">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
            <ClipboardCheck size={32} className="text-purple-600" />
            Care Plan
          </h1>
          <p className="text-slate-500 mt-2">
            Follow-ups, screenings, and health goals derived from your medical reports.
          </p>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Overdue", value: overdue.length, color: "bg-red-100 text-red-700" },
            { label: "Pending / Ongoing", value: pending.length, color: "bg-orange-100 text-orange-700" },
            { label: "Completed", value: completed.length, color: "bg-green-100 text-green-700" },
          ].map((s, i) => (
            <div key={i} className="bg-white border rounded-2xl p-5 shadow-sm text-center">
              <div className={`text-2xl font-bold mb-1 ${s.color.split(" ")[1]}`}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                filter === c ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="bg-white border rounded-3xl p-12 text-center text-slate-400">
            <ClipboardCheck size={48} className="mx-auto mb-4 opacity-30" />
            <h2 className="text-xl font-semibold text-slate-600 mb-2">No care plan items yet</h2>
            <p>Items are generated when your doctor uploads reports with follow-up instructions.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {overdue.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                  <AlertTriangle size={18} /> Overdue ({overdue.length})
                </h2>
                <div className="space-y-3">
                  {overdue.map((item) => <CarePlanCard key={item.itemId} item={item} />)}
                </div>
              </div>
            )}

            {pending.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Clock size={18} className="text-orange-500" /> Active ({pending.length})
                </h2>
                <div className="space-y-3">
                  {pending.map((item) => <CarePlanCard key={item.itemId} item={item} />)}
                </div>
              </div>
            )}

            {completed.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" /> Completed ({completed.length})
                </h2>
                <div className="space-y-3 opacity-70">
                  {completed.map((item) => <CarePlanCard key={item.itemId} item={item} />)}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700">
          <strong>Note:</strong> Care plan items are derived from follow-up instructions in your medical reports.
          They are informational reminders, not medical prescriptions. Always confirm care steps with your doctor.
        </div>

      </div>
    </PatientLayout>
  );
}

export default CarePlanPage;
