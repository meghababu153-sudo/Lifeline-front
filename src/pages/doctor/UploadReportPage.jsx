import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Upload, FileText, User, CheckCircle, AlertCircle,
  ShieldCheck, Lock, KeyRound, Clock, Info, X,
} from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import DoctorLayout from "../../layouts/DoctorLayout";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];
const MAX_FILE_SIZE_MB = 10;
const OTP_EXPIRY_MINUTES = 12;

const REPORT_TYPES = [
  "Blood Test", "Radiology", "X-Ray", "Prescription", "Pathology",
  "Cardiology", "Neurology", "Discharge Summary", "General Report",
];

// ── Step badge ────────────────────────────────────────────────────────────────
function StepBadge({ n, done }) {
  return (
    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${done ? "bg-green-600 text-white" : "bg-blue-600 text-white"}`}>
      {done ? <CheckCircle size={14} /> : n}
    </span>
  );
}

// ── OTP verification step ─────────────────────────────────────────────────────
function OTPStep({ patientId, patientName, onVerified }) {
  const { generateOTP, verifyOTP } = useAppData();

  const [step, setStep]             = useState("idle");   // idle | generated | verified
  const [demoCode, setDemoCode]     = useState("");
  const [entered, setEntered]       = useState("");
  const [error, setError]           = useState("");
  const [verifying, setVerifying]   = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    setSecondsLeft(OTP_EXPIRY_MINUTES * 60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setError("OTP expired. Generate a new one.");
          setStep("idle");
          setEntered("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleGenerate = () => {
    const code = generateOTP(patientId);
    setDemoCode(code);
    setEntered("");
    setError("");
    setStep("generated");
    startTimer();
  };

  const handleVerify = () => {
    if (!entered.trim()) return;
    setVerifying(true);
    setError("");
    setTimeout(() => {
      const result = verifyOTP(patientId, entered.trim());
      if (result.success) {
        clearInterval(timerRef.current);
        setStep("verified");
        onVerified();
      } else {
        setError(result.reason);
        setVerifying(false);
      }
    }, 400);
  };

  // ── Verified ──
  if (step === "verified") {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4">
        <CheckCircle size={20} className="text-green-600 shrink-0" />
        <div>
          <p className="font-semibold text-green-800 text-sm">Patient identity verified</p>
          <p className="text-xs text-green-600 mt-0.5">
            OTP confirmed for {patientName}. Upload is now authorised.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Explanation */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
        <Lock size={15} className="shrink-0 mt-0.5" />
        <span>
          Generate an OTP for <strong>{patientName}</strong>. Tell the patient to check their
          Lifeline app — they will see the code and read it back to you. Enter it below to
          authorise the upload.
        </span>
      </div>

      {/* Idle — show Generate button */}
      {step === "idle" && (
        <>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={13} /> {error}
            </div>
          )}
          <button
            type="button"
            onClick={handleGenerate}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition text-sm"
          >
            <KeyRound size={15} />
            Generate OTP for Patient
          </button>
        </>
      )}

      {/* Generated — enter the OTP the patient reads back */}
      {step === "generated" && (
        <div className="space-y-4">
          {/* Demo hint */}
          <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <Info size={14} className="text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-yellow-700">Demo mode</p>
              <p className="text-xs text-yellow-600 mt-0.5">
                In production the OTP would appear in the patient&apos;s Lifeline app.
                For this demo, the code for <strong>{patientName}</strong> is:{" "}
                <span className="font-mono font-bold text-base tracking-widest">{demoCode}</span>
              </p>
            </div>
          </div>

          {/* Timer + input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">
                Enter the OTP the patient reads back to you
              </label>
              <span className={`flex items-center gap-1 text-xs font-mono font-semibold ${secondsLeft < 60 ? "text-red-600" : "text-slate-500"}`}>
                <Clock size={12} />
                {formatTime(secondsLeft)}
              </span>
            </div>
            <input
              type="text"
              value={entered}
              onChange={(e) => setEntered(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="6-digit OTP"
              maxLength={6}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={13} /> {error}
            </div>
          )}

          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={handleVerify}
              disabled={verifying || !entered.trim()}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition text-sm disabled:opacity-50"
            >
              {verifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck size={15} />
                  Verify OTP
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                clearInterval(timerRef.current);
                setStep("idle");
                setError("");
                setEntered("");
              }}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm px-3 py-2.5 rounded-xl hover:bg-slate-100 transition"
            >
              <X size={14} /> Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              className="text-xs text-slate-400 hover:text-slate-600 transition ml-auto"
            >
              Regenerate OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function UploadReportPage() {
  const location    = useLocation();
  const navigate    = useNavigate();
  const { currentUser } = useAuth();
  const { findPatient, uploadReport, addAuditLog } = useAppData();

  const fileInputRef = useRef(null);

  const [patientId, setPatientId]       = useState(location.state?.patientId || "");
  const [reportType, setReportType]     = useState("");
  const [file, setFile]                 = useState(null);
  const [fileError, setFileError]       = useState("");
  const [patientFound, setPatientFound] = useState(null);
  const [patientError, setPatientError] = useState("");
  const [otpVerified, setOtpVerified]   = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [isUploading, setIsUploading]   = useState(false);

  // Pre-fill patient when navigated here from Patient Search
  useState(() => {
    if (location.state?.patientId) {
      const p = findPatient(location.state.patientId);
      if (p) setPatientFound(p);
    }
  });

  const handlePatientLookup = () => {
    setPatientError("");
    setPatientFound(null);
    setOtpVerified(false);
    if (!patientId.trim()) return;
    const p = findPatient(patientId.trim());
    if (p) {
      setPatientFound(p);
    } else {
      setPatientError("No patient found with this ID.");
    }
  };

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    setFileError("");
    setFile(null);
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) {
      setFileError("Invalid file type. Only PDF, JPG, and PNG files are accepted.");
      return;
    }
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setFileError("Invalid file extension.");
      return;
    }
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`File size exceeds ${MAX_FILE_SIZE_MB} MB limit.`);
      return;
    }
    setFile(f);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!patientFound || !reportType || !file || !otpVerified) return;
    setIsUploading(true);
    setTimeout(() => {
      const report = uploadReport(
        {
          patientId: patientFound.id,
          reportType,
          fileName: file.name,
          fileRef: URL.createObjectURL(file),
          fileSize: file.size,
        },
        { id: currentUser.id, name: currentUser.name }
      );
      addAuditLog({
        userId: currentUser.id,
        role: "DOCTOR",
        action: "REPORT_UPLOADED",
        details: `Uploaded ${file.name} for patient ${patientFound.id} (OTP verified)`,
        reportId: report.reportId,
        patientId: patientFound.id,
      });
      setUploadSuccess(report);
      setIsUploading(false);
      setFile(null);
    }, 1200);
  };

  const handleReset = () => {
    setPatientId("");
    setReportType("");
    setFile(null);
    setFileError("");
    setPatientFound(null);
    setPatientError("");
    setOtpVerified(false);
    setUploadSuccess(null);
  };

  const step1Done = !!patientFound;
  const step2Done = !!reportType;
  const step3Done = !!file && !fileError;
  const step4Done = otpVerified;

  return (
    <DoctorLayout>
      <div className="p-10">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Upload Medical Report</h1>
          <p className="text-slate-500 mt-2">
            Patient identity is verified via OTP before the upload is authorised.
          </p>
        </div>

        {/* Security notice */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
          <ShieldCheck size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-700 text-sm">Authenticated Upload</p>
            <p className="text-blue-600 text-sm mt-1">
              This report will be recorded under your Doctor ID{" "}
              <span className="font-mono font-bold">{currentUser?.id}</span> with a timestamp.
              An OTP must be verified with the patient before the upload is processed.
            </p>
          </div>
        </div>

        {uploadSuccess ? (
          /* ── Success ── */
          <div className="bg-white border border-green-200 rounded-3xl p-10 shadow-sm text-center max-w-xl mx-auto">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Report Uploaded Successfully</h2>
            <div className="text-left bg-slate-50 rounded-2xl p-5 space-y-2 text-sm mb-8">
              <p><span className="text-slate-500">Report ID:</span>{" "}<span className="font-mono font-bold">{uploadSuccess.reportId}</span></p>
              <p><span className="text-slate-500">Patient:</span>{" "}{patientFound?.name} (<span className="font-mono">{uploadSuccess.patientId}</span>)</p>
              <p><span className="text-slate-500">Type:</span>{" "}{uploadSuccess.reportType}</p>
              <p><span className="text-slate-500">Uploaded by:</span>{" "}{uploadSuccess.uploaderName} (<span className="font-mono">{uploadSuccess.uploadedBy}</span>)</p>
              <p><span className="text-slate-500">Time:</span>{" "}{new Date(uploadSuccess.uploadedAt).toLocaleString("en-IN")}</p>
              <p><span className="text-slate-500">OTP verified:</span>{" "}<span className="text-green-700 font-semibold">Yes</span></p>
              <p><span className="text-slate-500">Status:</span>{" "}<span className="text-green-700 font-semibold">{uploadSuccess.status}</span></p>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={handleReset} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-sm">
                Upload Another Report
              </button>
              <button onClick={() => navigate("/doctor/records")} className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition text-sm">
                View All Records
              </button>
            </div>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleUpload} className="max-w-2xl space-y-6">

            {/* Step 1 — Identify Patient */}
            <div className="bg-white border rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <StepBadge n={1} done={step1Done} />
                Identify Patient
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value);
                    setPatientFound(null);
                    setPatientError("");
                    setOtpVerified(false);
                  }}
                  placeholder="PT-200001"
                  className="flex-1 border border-slate-300 rounded-xl px-4 py-3 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handlePatientLookup}
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-sm"
                >
                  Find Patient
                </button>
              </div>
              {patientError && (
                <div className="flex items-center gap-2 mt-3 text-red-600 text-sm">
                  <AlertCircle size={14} /> {patientError}
                </div>
              )}
              {patientFound && (
                <div className="mt-4 flex items-center gap-4 bg-green-50 border border-green-200 rounded-2xl p-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{patientFound.name}</p>
                    <p className="text-xs font-mono text-green-600">{patientFound.id}</p>
                  </div>
                  <CheckCircle size={18} className="text-green-600 ml-auto" />
                </div>
              )}
            </div>

            {/* Step 2 — Report Type */}
            <div className={`bg-white border rounded-3xl p-8 shadow-sm transition-opacity ${!step1Done ? "opacity-40 pointer-events-none" : ""}`}>
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <StepBadge n={2} done={step2Done} />
                Report Type
              </h3>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select report type...</option>
                {REPORT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Step 3 — Select File */}
            <div className={`bg-white border rounded-3xl p-8 shadow-sm transition-opacity ${!step2Done ? "opacity-40 pointer-events-none" : ""}`}>
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <StepBadge n={3} done={step3Done} />
                Select File
              </h3>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition"
              >
                <Upload size={32} className="mx-auto text-slate-400 mb-3" />
                <p className="font-semibold text-slate-600">Click to select file</p>
                <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG — max {MAX_FILE_SIZE_MB} MB</p>
              </button>
              {fileError && (
                <div className="flex items-center gap-2 mt-3 text-red-600 text-sm">
                  <AlertCircle size={14} /> {fileError}
                </div>
              )}
              {file && !fileError && (
                <div className="mt-4 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <FileText size={18} className="text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-700 text-sm truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button type="button" onClick={() => setFile(null)} className="text-slate-400 hover:text-red-600">✕</button>
                </div>
              )}
            </div>

            {/* Step 4 — OTP Verification */}
            <div className={`bg-white border rounded-3xl p-8 shadow-sm transition-opacity ${!step3Done ? "opacity-40 pointer-events-none" : ""}`}>
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <StepBadge n={4} done={step4Done} />
                Verify Patient Identity (OTP)
              </h3>
              {patientFound ? (
                <OTPStep
                  patientId={patientFound.id}
                  patientName={patientFound.name}
                  onVerified={() => setOtpVerified(true)}
                />
              ) : (
                <p className="text-sm text-slate-400">Identify a patient in step 1 first.</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!step1Done || !step2Done || !step3Done || !step4Done || isUploading}
              className="w-full bg-blue-600 text-white rounded-xl py-4 font-semibold hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Official Medical Report
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </DoctorLayout>
  );
}

export default UploadReportPage;
