import { createContext, useContext, useState, useCallback } from "react";

const AppDataContext = createContext();

// ─── Seed Data ────────────────────────────────────────────────────────────────

const MOCK_DOCTORS = [
  { id: "DR-100001", name: "Dr. Sarah Kapoor", specialization: "Cardiology", password: "doctor123" },
  { id: "DR-100002", name: "Dr. Raj Mehta", specialization: "Radiology", password: "doctor123" },
  { id: "DR-100003", name: "Dr. Preethi Nair", specialization: "General Medicine", password: "doctor123" },
];

const MOCK_PATIENTS = [
  {
    id: "PT-200001",
    name: "Aryan Sharma",
    dob: "1995-03-14",
    bloodGroup: "O+",
    phone: "9876543210",
    email: "aryan@example.com",
    password: "patient123",
    specialCode: "SC-A1B2C3",
    otpSecret: "111222",
    emergencyProfile: {
      allergies: ["Penicillin", "Dust mites"],
      conditions: ["Mild hypertension", "Vitamin D deficiency"],
      emergencyContacts: [
        { name: "Meena Sharma", relation: "Mother", phone: "9876500001" },
        { name: "Rohit Sharma", relation: "Brother", phone: "9876500002" },
      ],
    },
  },
  {
    id: "PT-200002",
    name: "Priya Patel",
    dob: "1988-07-22",
    bloodGroup: "A+",
    phone: "9123456789",
    email: "priya@example.com",
    password: "patient123",
    specialCode: "SC-X9Y8Z7",
    otpSecret: "444555",
    emergencyProfile: {
      allergies: ["Sulfa drugs", "Latex"],
      conditions: ["Type 2 Diabetes (well-controlled)", "Hypothyroidism"],
      emergencyContacts: [
        { name: "Kiran Patel", relation: "Husband", phone: "9123400001" },
      ],
    },
  },
];

// ─── Reports with embedded extracted data ────────────────────────────────────
const INITIAL_REPORTS = [
  {
    reportId: "RPT-001",
    patientId: "PT-200001",
    uploadedBy: "DR-100001",
    uploaderRole: "DOCTOR",
    uploaderName: "Dr. Sarah Kapoor",
    reportType: "Blood Test",
    fileName: "Complete_Blood_Count_Jul2026.pdf",
    uploadedAt: "2026-07-12T10:30:00Z",
    status: "Verified",
    summary: [
      "Haemoglobin: 13.8 g/dL (normal range 13.5–17.5 g/dL) — within normal limits.",
      "WBC count: 7,200/μL — within normal limits.",
      "Platelet count: 210,000/μL — normal.",
      "No critical abnormalities detected. Routine follow-up in 12 months recommended.",
    ],
    extracted: {
      diagnoses: [],
      medications: [],
      allergies: [],
      procedures: ["Complete Blood Count"],
      labValues: [
        { name: "Haemoglobin", value: "13.8", unit: "g/dL", date: "2026-07-12", normal: true },
        { name: "WBC", value: "7200", unit: "/μL", date: "2026-07-12", normal: true },
        { name: "Platelets", value: "210000", unit: "/μL", date: "2026-07-12", normal: true },
      ],
      followUps: ["Routine follow-up in 12 months"],
      dates: { reportDate: "2026-07-12" },
      doctors: ["Dr. Sarah Kapoor"],
      hospitals: ["City Diagnostic Lab"],
    },
  },
  {
    reportId: "RPT-002",
    patientId: "PT-200001",
    uploadedBy: "DR-100002",
    uploaderRole: "DOCTOR",
    uploaderName: "Dr. Raj Mehta",
    reportType: "Radiology",
    fileName: "MRI_Lumbar_Spine_Mar2026.pdf",
    uploadedAt: "2026-03-02T09:15:00Z",
    status: "Verified",
    summary: [
      "MRI lumbar spine: No significant disc herniation observed.",
      "Mild disc desiccation at L4–L5 level. No nerve root compression.",
      "Discuss findings with your physician. Physiotherapy may be beneficial.",
    ],
    extracted: {
      diagnoses: ["Mild disc desiccation L4–L5"],
      medications: [],
      allergies: [],
      procedures: ["MRI Lumbar Spine"],
      labValues: [],
      followUps: ["Physiotherapy evaluation recommended", "Follow-up MRI in 6 months if symptoms worsen"],
      dates: { reportDate: "2026-03-02" },
      doctors: ["Dr. Raj Mehta"],
      hospitals: ["Central Imaging Centre"],
    },
  },
  {
    reportId: "RPT-003",
    patientId: "PT-200002",
    uploadedBy: "DR-100001",
    uploaderRole: "DOCTOR",
    uploaderName: "Dr. Sarah Kapoor",
    reportType: "Prescription",
    fileName: "Prescription_Metformin_Jun2026.pdf",
    uploadedAt: "2026-06-01T14:00:00Z",
    status: "Verified",
    summary: [
      "Prescription for Metformin 500 mg twice daily for Type 2 Diabetes management.",
      "Levothyroxine 50 mcg once daily for hypothyroidism.",
      "Follow dosage schedule carefully. Blood glucose monitoring every 2 weeks.",
    ],
    extracted: {
      diagnoses: ["Type 2 Diabetes mellitus", "Hypothyroidism"],
      medications: [
        { name: "Metformin", dosage: "500 mg", frequency: "Twice daily", duration: "3 months", refillDate: "2026-09-01" },
        { name: "Levothyroxine", dosage: "50 mcg", frequency: "Once daily (morning, fasting)", duration: "Ongoing", refillDate: "2026-09-01" },
      ],
      allergies: [],
      procedures: [],
      labValues: [],
      followUps: ["Blood glucose monitoring every 2 weeks", "Thyroid function test in 3 months"],
      dates: { reportDate: "2026-06-01" },
      doctors: ["Dr. Sarah Kapoor"],
      hospitals: ["Apollo Outpatient Clinic"],
    },
  },
  {
    reportId: "RPT-004",
    patientId: "PT-200001",
    uploadedBy: "DR-100001",
    uploaderRole: "DOCTOR",
    uploaderName: "Dr. Sarah Kapoor",
    reportType: "Cardiology",
    fileName: "ECG_Holter_Monitor_Jan2026.pdf",
    uploadedAt: "2026-01-18T11:00:00Z",
    status: "Verified",
    summary: [
      "24-hour Holter monitor: Normal sinus rhythm throughout.",
      "Occasional isolated PVCs noted — benign in nature.",
      "No significant arrhythmia detected. No treatment required at this time.",
      "Lifestyle modifications: reduce caffeine, increase aerobic activity.",
    ],
    extracted: {
      diagnoses: ["Occasional benign PVCs"],
      medications: [],
      allergies: [],
      procedures: ["24-hour Holter Monitor", "ECG"],
      labValues: [],
      followUps: ["Reduce caffeine intake", "Increase aerobic activity", "Repeat ECG in 12 months"],
      dates: { reportDate: "2026-01-18" },
      doctors: ["Dr. Sarah Kapoor"],
      hospitals: ["Cardiology Associates Clinic"],
    },
  },
  {
    reportId: "RPT-005",
    patientId: "PT-200001",
    uploadedBy: "DR-100003",
    uploaderRole: "DOCTOR",
    uploaderName: "Dr. Preethi Nair",
    reportType: "Blood Test",
    fileName: "Lipid_VitD_Panel_Nov2025.pdf",
    uploadedAt: "2025-11-10T08:45:00Z",
    status: "Verified",
    summary: [
      "Total Cholesterol: 198 mg/dL — borderline. Dietary modifications advised.",
      "LDL: 128 mg/dL — borderline high.",
      "HDL: 48 mg/dL — acceptable.",
      "Vitamin D (25-OH): 18 ng/mL — deficient. Supplementation prescribed.",
      "HbA1c: 5.4% — normal.",
    ],
    extracted: {
      diagnoses: ["Borderline hypercholesterolaemia", "Vitamin D deficiency"],
      medications: [
        { name: "Vitamin D3", dosage: "60,000 IU", frequency: "Once weekly", duration: "12 weeks", refillDate: "2026-02-01" },
      ],
      allergies: [],
      procedures: ["Lipid Panel", "Vitamin D (25-OH)", "HbA1c"],
      labValues: [
        { name: "Total Cholesterol", value: "198", unit: "mg/dL", date: "2025-11-10", normal: false },
        { name: "LDL", value: "128", unit: "mg/dL", date: "2025-11-10", normal: false },
        { name: "HDL", value: "48", unit: "mg/dL", date: "2025-11-10", normal: true },
        { name: "Vitamin D", value: "18", unit: "ng/mL", date: "2025-11-10", normal: false },
        { name: "HbA1c", value: "5.4", unit: "%", date: "2025-11-10", normal: true },
      ],
      followUps: ["Repeat lipid panel in 3 months", "Dietary modification: reduce saturated fats", "Vitamin D recheck after 12 weeks supplementation"],
      dates: { reportDate: "2025-11-10" },
      doctors: ["Dr. Preethi Nair"],
      hospitals: ["HealthFirst Diagnostics"],
    },
  },
  {
    reportId: "RPT-006",
    patientId: "PT-200002",
    uploadedBy: "DR-100001",
    uploaderRole: "DOCTOR",
    uploaderName: "Dr. Sarah Kapoor",
    reportType: "Blood Test",
    fileName: "HbA1c_Thyroid_Jul2026.pdf",
    uploadedAt: "2026-07-05T09:00:00Z",
    status: "Verified",
    summary: [
      "HbA1c: 7.1% — marginally above target. Continue current medication, review diet.",
      "TSH: 2.8 mIU/L — within normal range. Current Levothyroxine dose adequate.",
      "Fasting Glucose: 132 mg/dL — slightly elevated.",
      "Lipid panel within normal limits.",
    ],
    extracted: {
      diagnoses: ["Type 2 Diabetes (HbA1c marginally elevated)", "Hypothyroidism (well-controlled)"],
      medications: [],
      allergies: [],
      procedures: ["HbA1c", "Thyroid Function Test", "Fasting Glucose", "Lipid Panel"],
      labValues: [
        { name: "HbA1c", value: "7.1", unit: "%", date: "2026-07-05", normal: false },
        { name: "TSH", value: "2.8", unit: "mIU/L", date: "2026-07-05", normal: true },
        { name: "Fasting Glucose", value: "132", unit: "mg/dL", date: "2026-07-05", normal: false },
      ],
      followUps: ["Dietary review for diabetes management", "Repeat HbA1c in 3 months", "Continue Metformin and Levothyroxine"],
      dates: { reportDate: "2026-07-05" },
      doctors: ["Dr. Sarah Kapoor"],
      hospitals: ["Apollo Outpatient Clinic"],
    },
  },
];

// ─── Appointments ────────────────────────────────────────────────────────────
const INITIAL_APPOINTMENTS = [
  {
    appointmentId: "APT-001",
    patientId: "PT-200001",
    doctorId: "DR-100001",
    doctorName: "Dr. Sarah Kapoor",
    specialization: "Cardiology",
    date: "2026-08-15",
    time: "10:30 AM",
    location: "Cardiology Associates Clinic, Room 3B",
    type: "Follow-up",
    notes: "Repeat ECG review, discuss Holter results",
    status: "Upcoming",
  },
  {
    appointmentId: "APT-002",
    patientId: "PT-200001",
    doctorId: "DR-100003",
    doctorName: "Dr. Preethi Nair",
    specialization: "General Medicine",
    date: "2026-09-02",
    time: "09:00 AM",
    location: "HealthFirst Clinic, Room 1A",
    type: "Routine Check-up",
    notes: "Repeat lipid panel and Vitamin D recheck",
    status: "Upcoming",
  },
  {
    appointmentId: "APT-003",
    patientId: "PT-200001",
    doctorId: "DR-100001",
    doctorName: "Dr. Sarah Kapoor",
    specialization: "Cardiology",
    date: "2026-01-18",
    time: "11:00 AM",
    location: "Cardiology Associates Clinic",
    type: "Holter Monitor Review",
    notes: "Holter monitor attached and removed",
    status: "Completed",
  },
  {
    appointmentId: "APT-004",
    patientId: "PT-200002",
    doctorId: "DR-100001",
    doctorName: "Dr. Sarah Kapoor",
    specialization: "Cardiology",
    date: "2026-08-20",
    time: "02:00 PM",
    location: "Apollo Outpatient Clinic, Room 5",
    type: "Follow-up",
    notes: "Review HbA1c results, discuss dietary changes",
    status: "Upcoming",
  },
  {
    appointmentId: "APT-005",
    patientId: "PT-200002",
    doctorId: "DR-100001",
    doctorName: "Dr. Sarah Kapoor",
    specialization: "Cardiology",
    date: "2026-06-01",
    time: "02:00 PM",
    location: "Apollo Outpatient Clinic",
    type: "Consultation",
    notes: "Prescription renewal — Metformin and Levothyroxine",
    status: "Completed",
  },
];

// ─── Care Plan items ──────────────────────────────────────────────────────────
const INITIAL_CARE_PLAN = [
  {
    itemId: "CP-001",
    patientId: "PT-200001",
    category: "Follow-up",
    title: "Cardiology Follow-up",
    description: "Repeat ECG review with Dr. Sarah Kapoor",
    dueDate: "2026-08-15",
    status: "Pending",
    sourceReportId: "RPT-004",
    priority: "Medium",
  },
  {
    itemId: "CP-002",
    patientId: "PT-200001",
    category: "Screening",
    title: "Repeat Lipid Panel",
    description: "Cholesterol recheck after dietary modifications and Vitamin D supplementation",
    dueDate: "2026-09-02",
    status: "Pending",
    sourceReportId: "RPT-005",
    priority: "Medium",
  },
  {
    itemId: "CP-003",
    patientId: "PT-200001",
    category: "Preventive",
    title: "Increase Aerobic Activity",
    description: "30 minutes moderate aerobic exercise, 5 days/week — per cardiologist recommendation",
    dueDate: null,
    status: "Ongoing",
    sourceReportId: "RPT-004",
    priority: "Low",
  },
  {
    itemId: "CP-004",
    patientId: "PT-200001",
    category: "Preventive",
    title: "Reduce Caffeine Intake",
    description: "Limit caffeine to ≤1 cup/day per cardiologist recommendation",
    dueDate: null,
    status: "Ongoing",
    sourceReportId: "RPT-004",
    priority: "Low",
  },
  {
    itemId: "CP-005",
    patientId: "PT-200002",
    category: "Monitoring",
    title: "Blood Glucose Monitoring",
    description: "Self-monitor blood glucose every 2 weeks",
    dueDate: "2026-08-01",
    status: "Ongoing",
    sourceReportId: "RPT-003",
    priority: "High",
  },
  {
    itemId: "CP-006",
    patientId: "PT-200002",
    category: "Follow-up",
    title: "Repeat HbA1c",
    description: "Recheck HbA1c in 3 months — target < 7.0%",
    dueDate: "2026-10-05",
    status: "Pending",
    sourceReportId: "RPT-006",
    priority: "High",
  },
  {
    itemId: "CP-007",
    patientId: "PT-200002",
    category: "Follow-up",
    title: "Thyroid Function Test",
    description: "TSH recheck in 3 months to confirm Levothyroxine dose remains adequate",
    dueDate: "2026-10-05",
    status: "Pending",
    sourceReportId: "RPT-003",
    priority: "Medium",
  },
];

// ─── Access Requests ──────────────────────────────────────────────────────────
const INITIAL_ACCESS_REQUESTS = [
  {
    requestId: "REQ-001",
    patientId: "PT-200001",
    doctorId: "DR-100002",
    doctorName: "Dr. Raj Mehta",
    requestedAt: "2026-07-20T08:00:00Z",
    status: "PENDING",
    approvedAt: null,
    expiresAt: null,
    reportIds: [],
  },
];

// ─── Vitalis conversation history (per patient) ───────────────────────────────
const INITIAL_VITALIS = {};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function nowISO() { return new Date().toISOString(); }
function makeId(prefix) { return `${prefix}-${Date.now().toString().slice(-6)}`; }

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppDataProvider({ children }) {
  const [doctors] = useState(MOCK_DOCTORS);
  const [patients] = useState(MOCK_PATIENTS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [carePlan, setCarePlan] = useState(INITIAL_CARE_PLAN);
  const [accessRequests, setAccessRequests] = useState(INITIAL_ACCESS_REQUESTS);
  const [auditLogs, setAuditLogs] = useState([]);
  const [otpStore, setOtpStore] = useState({});
  const [vitalisHistory, setVitalisHistory] = useState(INITIAL_VITALIS);

  // ── Auth ─────────────────────────────────────────────────────────────────────
  const authenticateDoctor = useCallback(
    (id, password) => doctors.find((d) => d.id === id && d.password === password) || null,
    [doctors]
  );
  const authenticatePatient = useCallback(
    (id, password) => patients.find((p) => p.id === id && p.password === password) || null,
    [patients]
  );

  // ── OTP ──────────────────────────────────────────────────────────────────────
  const generateOTP = useCallback((patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return null;
    const code = patient.otpSecret;
    const expiresAt = new Date(Date.now() + 12 * 60 * 1000).toISOString();
    setOtpStore((prev) => ({ ...prev, [patientId]: { code, expiresAt, used: false, attempts: 0 } }));
    return code;
  }, [patients]);

  const verifyOTP = useCallback((patientId, enteredCode) => {
    const entry = otpStore[patientId];
    if (!entry) return { success: false, reason: "No OTP generated" };
    if (entry.used) return { success: false, reason: "OTP already used" };
    if (new Date() > new Date(entry.expiresAt)) return { success: false, reason: "OTP expired" };
    if (entry.attempts >= 3) return { success: false, reason: "Too many attempts" };
    if (entry.code !== enteredCode) {
      setOtpStore((prev) => ({ ...prev, [patientId]: { ...prev[patientId], attempts: prev[patientId].attempts + 1 } }));
      return { success: false, reason: "Incorrect OTP" };
    }
    setOtpStore((prev) => ({ ...prev, [patientId]: { ...prev[patientId], used: true } }));
    return { success: true };
  }, [otpStore]);

  // ── Reports ───────────────────────────────────────────────────────────────────
  const uploadReport = useCallback((reportData, doctor) => {
    const newReport = {
      reportId: makeId("RPT"),
      ...reportData,
      uploadedBy: doctor.id,
      uploaderRole: "DOCTOR",
      uploaderName: doctor.name,
      uploadedAt: nowISO(),
      status: "Verified",
      summary: reportData.summary || [],
      extracted: reportData.extracted || {
        diagnoses: [], medications: [], allergies: [], procedures: [],
        labValues: [], followUps: [], dates: {}, doctors: [doctor.name], hospitals: [],
      },
    };
    setReports((prev) => [newReport, ...prev]);

    // Auto-generate care plan items from follow-ups
    if (newReport.extracted.followUps && newReport.extracted.followUps.length > 0) {
      const newItems = newReport.extracted.followUps.map((fu, idx) => ({
        itemId: makeId(`CP`),
        patientId: reportData.patientId,
        category: "Follow-up",
        title: fu.length > 50 ? fu.slice(0, 50) + "…" : fu,
        description: fu,
        dueDate: null,
        status: "Pending",
        sourceReportId: newReport.reportId,
        priority: "Medium",
      }));
      setCarePlan((prev) => [...prev, ...newItems]);
    }

    return newReport;
  }, []);

  const getPatientReports = useCallback(
    (patientId) => reports.filter((r) => r.patientId === patientId),
    [reports]
  );

  const getDoctorAccessibleReports = useCallback(
    (patientId, doctorId) => {
      const ownReports = reports.filter((r) => r.patientId === patientId && r.uploadedBy === doctorId);
      const approvedReq = accessRequests.find(
        (req) => req.patientId === patientId && req.doctorId === doctorId && req.status === "APPROVED"
      );
      if (!approvedReq) return ownReports;
      return reports.filter((r) => r.patientId === patientId);
    },
    [reports, accessRequests]
  );

  // ── Derived health data ───────────────────────────────────────────────────────

  // All extracted medications across all reports for a patient
  const getPatientMedications = useCallback(
    (patientId) => {
      const meds = [];
      reports.filter((r) => r.patientId === patientId).forEach((r) => {
        (r.extracted?.medications || []).forEach((m) => {
          meds.push({ ...m, sourceReport: r.fileName, reportId: r.reportId, reportDate: r.extracted?.dates?.reportDate || r.uploadedAt });
        });
      });
      return meds;
    },
    [reports]
  );

  // Timeline events derived from reports
  const getPatientTimeline = useCallback(
    (patientId) => {
      const events = [];
      reports.filter((r) => r.patientId === patientId).forEach((r) => {
        const date = r.extracted?.dates?.reportDate || r.uploadedAt.slice(0, 10);
        // One event per report
        events.push({
          eventId: `EVT-${r.reportId}`,
          date,
          type: r.reportType,
          title: r.fileName.replace(/_/g, " ").replace(/\.\w+$/, ""),
          description: r.summary?.[0] || "Medical report",
          diagnoses: r.extracted?.diagnoses || [],
          procedures: r.extracted?.procedures || [],
          doctor: r.uploaderName,
          hospital: r.extracted?.hospitals?.[0] || "",
          reportId: r.reportId,
        });
        // Extra events for significant diagnoses
        (r.extracted?.diagnoses || []).forEach((dx) => {
          events.push({
            eventId: `DX-${r.reportId}-${dx.slice(0, 6)}`,
            date,
            type: "Diagnosis",
            title: dx,
            description: `Identified in ${r.fileName.replace(/_/g, " ").replace(/\.\w+$/, "")}`,
            diagnoses: [dx],
            procedures: [],
            doctor: r.uploaderName,
            hospital: r.extracted?.hospitals?.[0] || "",
            reportId: r.reportId,
          });
        });
      });
      // Sort newest first
      return events.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    [reports]
  );

  // Lab values for trends
  const getPatientLabTrends = useCallback(
    (patientId) => {
      const labMap = {};
      reports.filter((r) => r.patientId === patientId).forEach((r) => {
        (r.extracted?.labValues || []).forEach((lv) => {
          if (!labMap[lv.name]) labMap[lv.name] = [];
          labMap[lv.name].push({ ...lv, reportId: r.reportId, reportFile: r.fileName });
        });
      });
      // Sort each marker by date
      Object.keys(labMap).forEach((k) => {
        labMap[k].sort((a, b) => new Date(a.date) - new Date(b.date));
      });
      return labMap;
    },
    [reports]
  );

  // Visit brief — synthesized from latest extracted data
  const getPatientVisitBrief = useCallback(
    (patientId) => {
      const patientReports = reports.filter((r) => r.patientId === patientId);
      const allDiagnoses = new Set();
      const allAllergies = new Set();
      const allMeds = [];
      const allFollowUps = [];
      const latestLabs = {};

      patientReports.forEach((r) => {
        (r.extracted?.diagnoses || []).forEach((d) => allDiagnoses.add(d));
        (r.extracted?.allergies || []).forEach((a) => allAllergies.add(a));
        (r.extracted?.medications || []).forEach((m) => allMeds.push({ ...m, from: r.fileName }));
        (r.extracted?.followUps || []).forEach((f) => allFollowUps.push({ text: f, from: r.fileName, date: r.uploadedAt }));
        (r.extracted?.labValues || []).forEach((lv) => {
          if (!latestLabs[lv.name] || new Date(lv.date) > new Date(latestLabs[lv.name].date)) {
            latestLabs[lv.name] = lv;
          }
        });
      });

      // Merge with emergency profile allergies
      const patient = patients.find((p) => p.id === patientId);
      (patient?.emergencyProfile?.allergies || []).forEach((a) => allAllergies.add(a));

      return {
        diagnoses: [...allDiagnoses],
        allergies: [...allAllergies],
        medications: allMeds,
        labHighlights: Object.values(latestLabs),
        pendingFollowUps: allFollowUps,
      };
    },
    [reports, patients]
  );

  // ── Appointments ──────────────────────────────────────────────────────────────
  const getPatientAppointments = useCallback(
    (patientId) => appointments.filter((a) => a.patientId === patientId),
    [appointments]
  );

  const addAppointment = useCallback((appt) => {
    const newAppt = { ...appt, appointmentId: makeId("APT") };
    setAppointments((prev) => [...prev, newAppt]);
    return newAppt;
  }, []);

  // ── Care Plan ─────────────────────────────────────────────────────────────────
  const getPatientCarePlan = useCallback(
    (patientId) => carePlan.filter((c) => c.patientId === patientId),
    [carePlan]
  );

  const updateCarePlanItem = useCallback((itemId, updates) => {
    setCarePlan((prev) => prev.map((c) => c.itemId === itemId ? { ...c, ...updates } : c));
  }, []);

  // ── Emergency Profile ─────────────────────────────────────────────────────────
  const getEmergencyProfile = useCallback(
    (patientId) => {
      const patient = patients.find((p) => p.id === patientId);
      if (!patient) return null;
      const meds = [];
      reports.filter((r) => r.patientId === patientId).forEach((r) => {
        (r.extracted?.medications || []).forEach((m) => meds.push(m.name));
      });
      return {
        ...patient.emergencyProfile,
        bloodGroup: patient.bloodGroup,
        name: patient.name,
        dob: patient.dob,
        phone: patient.phone,
        currentMedications: [...new Set(meds)],
      };
    },
    [patients, reports]
  );

  // ── Access Requests ───────────────────────────────────────────────────────────
  const createAccessRequest = useCallback((patientId, doctor) => {
    const existing = accessRequests.find(
      (r) => r.patientId === patientId && r.doctorId === doctor.id && r.status === "PENDING"
    );
    if (existing) return existing;
    const req = {
      requestId: makeId("REQ"),
      patientId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      requestedAt: nowISO(),
      status: "PENDING",
      approvedAt: null,
      expiresAt: null,
      reportIds: [],
    };
    setAccessRequests((prev) => [req, ...prev]);
    return req;
  }, [accessRequests]);

  const respondToAccessRequest = useCallback((requestId, decision) => {
    setAccessRequests((prev) =>
      prev.map((req) =>
        req.requestId === requestId
          ? {
              ...req,
              status: decision,
              approvedAt: nowISO(),
              expiresAt: decision === "APPROVED"
                ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                : null,
            }
          : req
      )
    );
  }, []);

  const getAccessRequestsForPatient = useCallback(
    (patientId) => accessRequests.filter((r) => r.patientId === patientId),
    [accessRequests]
  );

  const getAccessRequestsForDoctor = useCallback(
    (doctorId) => accessRequests.filter((r) => r.doctorId === doctorId),
    [accessRequests]
  );

  // ── Vitalis ───────────────────────────────────────────────────────────────────
  const getVitalisHistory = useCallback(
    (patientId) => vitalisHistory[patientId] || [],
    [vitalisHistory]
  );

  const addVitalisMessage = useCallback((patientId, message) => {
    setVitalisHistory((prev) => ({
      ...prev,
      [patientId]: [...(prev[patientId] || []), { ...message, id: makeId("MSG"), timestamp: nowISO() }],
    }));
  }, []);

  // ── Audit Log ─────────────────────────────────────────────────────────────────
  const addAuditLog = useCallback((entry) => {
    setAuditLogs((prev) => [
      { logId: makeId("LOG"), timestamp: nowISO(), ...entry },
      ...prev,
    ]);
  }, []);

  // ── Lookups ───────────────────────────────────────────────────────────────────
  const findPatient = useCallback((id) => patients.find((p) => p.id === id) || null, [patients]);
  const findDoctor = useCallback((id) => doctors.find((d) => d.id === id) || null, [doctors]);

  return (
    <AppDataContext.Provider value={{
      // Raw data
      doctors, patients, reports, appointments, carePlan, accessRequests, auditLogs,
      // Auth
      authenticateDoctor, authenticatePatient,
      // OTP
      generateOTP, verifyOTP,
      // Reports
      uploadReport, getPatientReports, getDoctorAccessibleReports,
      // Derived health data
      getPatientMedications, getPatientTimeline, getPatientLabTrends,
      getPatientVisitBrief, getEmergencyProfile,
      // Appointments
      getPatientAppointments, addAppointment,
      // Care Plan
      getPatientCarePlan, updateCarePlanItem,
      // Access Requests
      createAccessRequest, respondToAccessRequest,
      getAccessRequestsForPatient, getAccessRequestsForDoctor,
      // Vitalis
      getVitalisHistory, addVitalisMessage,
      // Audit
      addAuditLog,
      // Lookups
      findPatient, findDoctor,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppData() {
  return useContext(AppDataContext);
}
