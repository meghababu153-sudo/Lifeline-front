import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search, User, FileText, Upload, ClipboardList, ChevronRight,
  Activity, Clipboard, CheckCircle, ChevronDown, ChevronUp,
  Stethoscope, FlaskConical, Tag, FileSearch, X, ShieldCheck,
  ZoomIn, ZoomOut, Download, Sparkles, Clock, AlertTriangle,
} from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import DoctorLayout from "../../layouts/DoctorLayout";

// ─── Patient Health Journey (authorized view) ─────────────────────────────────
function PatientJourneyPanel({ patientId }) {
  const { getPatientTimeline } = useAppData();
  const events = getPatientTimeline(patientId).slice(0, 8);
  return (
    <div className="space-y-3">
      {events.length === 0 ? (
        <p className="text-slate-400 text-sm">No timeline events available.</p>
      ) : (
        events.map((e) => (
          <div key={e.eventId} className="flex items-start gap-3 p-3 bg-slate-50 border rounded-xl">
            <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-slate-800 leading-snug">{e.title}</p>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{e.type}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{e.date} · {e.doctor}</p>
              {e.diagnoses?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {e.diagnoses.map((d, i) => (
                    <span key={i} className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Tag size={9} /> {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Patient Visit Brief (authorized view) ───────────────────────────────────
function PatientVisitBriefPanel({ patientId }) {
  const { getPatientVisitBrief, findPatient } = useAppData();
  const brief = getPatientVisitBrief(patientId);
  const patient = findPatient(patientId);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-slate-500 mb-1.5">Active Conditions</p>
          {brief.diagnoses.length === 0 ? <p className="text-xs text-slate-400">None recorded</p> : (
            <div className="flex flex-wrap gap-1">
              {brief.diagnoses.map((d, i) => <span key={i} className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">{d}</span>)}
            </div>
          )}
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-slate-500 mb-1.5">Allergies</p>
          {brief.allergies.length === 0 ? <p className="text-xs text-slate-400">None recorded</p> : (
            <div className="flex flex-wrap gap-1">
              {brief.allergies.map((a, i) => <span key={i} className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">⚠ {a}</span>)}
            </div>
          )}
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl p-3">
        <p className="text-xs font-semibold text-slate-500 mb-1.5">Current Medications</p>
        {brief.medications.length === 0 ? <p className="text-xs text-slate-400">None recorded</p> : (
          <div className="space-y-1">
            {brief.medications.map((m, i) => (
              <p key={i} className="text-xs text-slate-700">💊 <strong>{m.name}</strong> — {m.dosage} ({m.frequency})</p>
            ))}
          </div>
        )}
      </div>
      <div className="bg-slate-50 rounded-xl p-3">
        <p className="text-xs font-semibold text-slate-500 mb-1.5">Recent Lab Highlights</p>
        {brief.labHighlights.length === 0 ? <p className="text-xs text-slate-400">None recorded</p> : (
          <div className="grid grid-cols-3 gap-2">
            {brief.labHighlights.slice(0, 6).map((lv, i) => (
              <div key={i} className={`text-center p-2 rounded-lg ${lv.normal ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}`}>
                <p className="text-xs font-medium">{lv.name}</p>
                <p className="font-bold text-sm">{lv.value} {lv.unit}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Expiry helpers (same logic as DoctorRecordsPage) ────────────────────────
function getExpiryInfo(expiresAt) {
  if (!expiresAt) return null;
  const msLeft = new Date(expiresAt) - Date.now();
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
  if (daysLeft <= 0) {
    return { daysLeft: 0, isExpired: true, label: "Access Expired", color: "bg-red-100 text-red-700 border-red-200" };
  }
  if (daysLeft <= 2) {
    return { daysLeft, isExpired: false, label: `Expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`, color: "bg-orange-100 text-orange-700 border-orange-200" };
  }
  return { daysLeft, isExpired: false, label: `Expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`, color: "bg-yellow-50 text-yellow-700 border-yellow-200" };
}

// ─── Inline Report Viewer Modal ───────────────────────────────────────────────
function ReportViewerModal({ report, patient, expiresAt, onClose }) {
  const [zoom, setZoom] = useState(1);
  const isPDF = report.fileName?.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png)$/i.test(report.fileName || "");
  const fileUrl = report.fileRef || null;
  const expiry = getExpiryInfo(expiresAt);
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex flex-col" onClick={onClose}>
      <div className="flex flex-col w-full h-full max-w-5xl mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between bg-slate-900 text-white px-6 py-4 shrink-0">
          <div>
            <p className="font-bold text-sm truncate max-w-lg">{report.fileName.replace(/_/g, " ")}</p>
            <p className="text-xs text-slate-400 mt-0.5">{report.reportType} · {patient?.name || report.patientId} · {new Date(report.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-3">
            {fileUrl && isImage && (
              <>
                <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"><ZoomOut size={16} /></button>
                <span className="text-xs font-mono">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom((z) => Math.min(3, z + 0.25))} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"><ZoomIn size={16} /></button>
              </>
            )}
            {fileUrl && <a href={fileUrl} download={report.fileName} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"><Download size={13} />Download</a>}
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"><X size={18} /></button>
          </div>
        </div>
        {/* Expiry warning banner */}
        {expiry && (
          <div className={`flex items-center gap-3 px-6 py-2.5 border-b text-sm font-medium ${expiry.isExpired ? "bg-red-900/80 border-red-700 text-red-100" : "bg-yellow-900/60 border-yellow-700 text-yellow-100"}`}>
            <AlertTriangle size={15} className="shrink-0" />
            {expiry.isExpired
              ? "Your approved access to this report has expired. The patient would need to re-approve."
              : `Approved access ${expiry.label.toLowerCase()} — the patient's authorisation will end soon.`}
          </div>
        )}
        <div className="flex-1 overflow-auto bg-slate-800 p-6">
          {fileUrl && isPDF ? (
            <iframe src={fileUrl} title={report.fileName} className="w-full h-full rounded-xl" style={{ minHeight: "70vh" }} />
          ) : fileUrl && isImage ? (
            <div className="flex items-start justify-center min-h-full">
              <img src={fileUrl} alt={report.fileName} style={{ transform: `scale(${zoom})`, transformOrigin: "top center", transition: "transform 0.2s" }} className="max-w-full rounded-xl shadow-lg" />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="border-b border-slate-200 pb-5 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center"><FileText size={20} className="text-blue-600" /></div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1"><ShieldCheck size={12} />{report.status}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{report.fileName.replace(/_/g, " ").replace(/\.\w+$/, "")}</h2>
                  <p className="text-slate-500 text-sm mt-1">{report.reportType}</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">Patient: {patient?.name || report.patientId} · <span className="font-mono">{report.patientId}</span></p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Report Date</p><p className="font-semibold text-slate-800 text-sm">{report.extracted?.dates?.reportDate ? new Date(report.extracted.dates.reportDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : new Date(report.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p></div>
                  <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Ordering Doctor</p><p className="font-semibold text-slate-800 text-sm">{report.uploaderName}</p></div>
                  {report.extracted?.hospitals?.[0] && <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Facility</p><p className="font-semibold text-slate-800 text-sm">{report.extracted.hospitals[0]}</p></div>}
                  <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Report ID</p><p className="font-mono text-slate-700 text-sm">{report.reportId}</p></div>
                </div>
                {report.extracted?.procedures?.length > 0 && <div className="mb-5"><p className="text-sm font-bold text-slate-700 mb-2">Tests / Procedures</p><div className="flex flex-wrap gap-2">{report.extracted.procedures.map((p, i) => <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-3 py-1 rounded-full">{p}</span>)}</div></div>}
                {report.extracted?.labValues?.length > 0 && <div className="mb-5"><p className="text-sm font-bold text-slate-700 mb-2">Lab Results</p><div className="border rounded-xl overflow-hidden"><table className="w-full text-sm"><thead><tr className="bg-slate-50 border-b"><th className="text-left px-3 py-2 font-semibold text-slate-600">Parameter</th><th className="text-left px-3 py-2 font-semibold text-slate-600">Result</th><th className="text-left px-3 py-2 font-semibold text-slate-600">Status</th></tr></thead><tbody>{report.extracted.labValues.map((lv, i) => <tr key={i} className="border-b last:border-0"><td className="px-3 py-2 text-slate-700 font-medium">{lv.name}</td><td className="px-3 py-2 font-mono text-slate-800">{lv.value} {lv.unit}</td><td className="px-3 py-2"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${lv.normal ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>{lv.normal ? "Normal" : "Attention"}</span></td></tr>)}</tbody></table></div></div>}
                {report.extracted?.diagnoses?.length > 0 && <div className="mb-5"><p className="text-sm font-bold text-slate-700 mb-2">Findings</p>{report.extracted.diagnoses.map((d, i) => <div key={i} className="flex items-start gap-2 text-sm text-slate-700 mb-1"><span className="text-orange-500 font-bold mt-0.5">→</span>{d}</div>)}</div>}
                {report.extracted?.followUps?.length > 0 && <div className="mb-5"><p className="text-sm font-bold text-slate-700 mb-2">Recommendations</p>{report.extracted.followUps.map((f, i) => <div key={i} className="flex items-start gap-2 text-sm text-slate-700 mb-1"><span className="text-green-600 font-bold mt-0.5">✓</span>{f}</div>)}</div>}
                <div className="mt-4 pt-4 border-t text-xs text-slate-400 text-center">Original document — uploaded by {report.uploaderName} · {new Date(report.uploadedAt).toLocaleString("en-IN")}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Expandable authorized section ───────────────────────────────────────────
function AuthorizedSection({ title, icon: Icon, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-8 py-5 hover:bg-slate-50 transition"
      >
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Icon size={18} className="text-blue-600" /> {title}
        </h3>
        {open ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
      </button>
      {open && <div className="px-8 pb-8">{children}</div>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function PatientSearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    patients, getPatientReports, getDoctorAccessibleReports,
    createAccessRequest, accessRequests, getPatientVisitBrief, findPatient,
  } = useAppData();
  const { currentUser } = useAuth();

  const [query, setQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);

  // Auto-select a patient when navigated here from a notification
  useEffect(() => {
    const autoId = location.state?.autoSelectPatientId;
    if (autoId) {
      const p = patients.find((pt) => pt.id === autoId);
      if (p) setSelectedPatient(p);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const results = query.trim()
    ? patients.filter(
        (p) =>
          p.id.toLowerCase().includes(query.toLowerCase()) ||
          p.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setQuery("");
  };

  const myAccessRequest = selectedPatient
    ? accessRequests.find(
        (r) => r.patientId === selectedPatient.id && r.doctorId === currentUser.id
      )
    : null;

  const hasFullAccess = myAccessRequest?.status === "APPROVED";

  const accessibleReports = selectedPatient
    ? getDoctorAccessibleReports(selectedPatient.id, currentUser.id)
    : [];

  const allPatientReports = selectedPatient
    ? getPatientReports(selectedPatient.id)
    : [];

  const handleRequestAccess = () => {
    createAccessRequest(selectedPatient.id, {
      id: currentUser.id,
      name: currentUser.name,
    });
  };

  return (
    <DoctorLayout>
      <div className="p-10">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Patient Search</h1>
          <p className="text-slate-500 mt-2">Search for a patient to view their profile, upload reports, or request record access.</p>
        </div>

        {/* Search box */}
        <div className="relative max-w-xl mb-8">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Patient ID (PT-XXXXXX) or name..."
            className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Search results */}
        {results.length > 0 && !selectedPatient && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-8 divide-y">
            {results.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPatient(p)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-blue-50 transition text-left"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{p.id}</p>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
            ))}
          </div>
        )}

        {query.trim() && results.length === 0 && !selectedPatient && (
          <div className="bg-white border rounded-2xl p-8 text-center text-slate-400 mb-8">
            <User size={40} className="mx-auto mb-3 opacity-40" />
            <p>No patient found matching "<strong>{query}</strong>"</p>
          </div>
        )}

        {/* Selected patient panel */}
        {selectedPatient && (
          <div className="space-y-6">

            {/* Patient info */}
            <div className="bg-white border rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <User size={28} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedPatient.name}</h2>
                    <p className="text-blue-600 font-mono text-sm mt-0.5">{selectedPatient.id}</p>
                    <p className="text-slate-500 text-sm mt-1">
                      Blood Group: <strong>{selectedPatient.bloodGroup}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm"
                >
                  ✕ Clear
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => navigate("/doctor/upload", { state: { patientId: selectedPatient.id } })}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-sm"
                >
                  <Upload size={16} /> Upload Report
                </button>

                {(!myAccessRequest || myAccessRequest.status === "DENIED") && (
                  <button
                    onClick={handleRequestAccess}
                    className="flex items-center gap-2 bg-orange-100 text-orange-700 px-5 py-3 rounded-xl font-semibold hover:bg-orange-200 transition text-sm"
                  >
                    <ClipboardList size={16} /> Request Full History Access
                  </button>
                )}

                {myAccessRequest?.status === "PENDING" && (
                  <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-5 py-3 rounded-xl text-sm font-semibold">
                    <ClipboardList size={16} /> Access Request Pending Patient Approval
                  </div>
                )}

                {myAccessRequest?.status === "APPROVED" && (
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 px-5 py-3 rounded-xl text-sm font-semibold">
                    <CheckCircle size={16} /> Full History Access Approved
                    {myAccessRequest.expiresAt && (
                      <span className="text-xs ml-1 opacity-75">
                        · Expires {new Date(myAccessRequest.expiresAt).toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Visit Brief — available if doctor uploaded to this patient OR has full access */}
            {(accessibleReports.length > 0 || hasFullAccess) && (
              <AuthorizedSection title="Patient Visit Brief" icon={Clipboard}>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-700">
                  This visit brief is synthesized from reports you have access to.
                  {!hasFullAccess && " Request full history access to see the complete picture."}
                </div>
                <PatientVisitBriefPanel patientId={selectedPatient.id} />
              </AuthorizedSection>
            )}

            {/* Health Journey — only with full access */}
            {hasFullAccess && (
              <AuthorizedSection title="Patient Health Journey" icon={Activity}>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-xs text-blue-700">
                  Showing last 8 timeline events for this patient (full access approved by patient).
                </div>
                <PatientJourneyPanel patientId={selectedPatient.id} />
              </AuthorizedSection>
            )}

            {/* Accessible reports */}
            <div className="bg-white border rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Medical Reports
                    {!hasFullAccess && allPatientReports.length > accessibleReports.length && (
                      <span className="text-sm font-normal text-orange-600 ml-2">
                        ({accessibleReports.length} of {allPatientReports.length} visible — request full access)
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              {/* Access expiry banner — shown when doctor has approved access */}
              {hasFullAccess && myAccessRequest?.expiresAt && (() => {
                const expiry = getExpiryInfo(myAccessRequest.expiresAt);
                if (!expiry) return null;
                return (
                  <div className={`flex items-center gap-3 p-4 rounded-2xl border mb-5 text-sm font-medium ${expiry.isExpired ? "bg-red-50 border-red-200 text-red-700" : expiry.daysLeft <= 2 ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-yellow-50 border-yellow-200 text-yellow-700"}`}>
                    <AlertTriangle size={16} className="shrink-0" />
                    <span>
                      {expiry.isExpired
                        ? "Your approved access to this patient's records has expired. The patient would need to re-approve."
                        : <>
                            Approved access <strong>{expiry.label.toLowerCase()}</strong> — valid until{" "}
                            <strong>{new Date(myAccessRequest.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong>.
                          </>
                      }
                    </span>
                  </div>
                );
              })()}

              {accessibleReports.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <FileText size={40} className="mx-auto mb-3 opacity-40" />
                  <p>No reports accessible. Upload a report or request access to existing records.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {accessibleReports.map((r) => (
                    <div key={r.reportId} className="border rounded-2xl p-5 hover:bg-slate-50 transition">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-xl shrink-0">
                          <FileText size={18} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800">{r.fileName.replace(/_/g, " ")}</p>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {r.reportType} · {r.uploaderName} ·{" "}
                            {new Date(r.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                          {r.extracted?.diagnoses?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {r.extracted.diagnoses.map((d, i) => (
                                <span key={i} className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">{d}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                            {r.status}
                          </span>
                          {hasFullAccess && myAccessRequest?.expiresAt && (() => {
                            const expiry = getExpiryInfo(myAccessRequest.expiresAt);
                            return expiry ? (
                              <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border ${expiry.color}`}>
                                <Clock size={11} />
                                {expiry.label}
                              </span>
                            ) : null;
                          })()}
                        </div>
                      </div>
                      <div className="mt-3 pl-1">
                        <button
                          onClick={() => setViewingReport(r)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                          <FileSearch size={14} />
                          View Original Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Report viewer modal */}
        {viewingReport && (
          <ReportViewerModal
            report={viewingReport}
            patient={findPatient(viewingReport.patientId)}
            expiresAt={hasFullAccess ? myAccessRequest?.expiresAt : null}
            onClose={() => setViewingReport(null)}
          />
        )}

      </div>
    </DoctorLayout>
  );
}

export default PatientSearchPage;
