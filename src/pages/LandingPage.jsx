import { Link } from "react-router-dom";
import {
  Stethoscope, User, Shield, Clock, FileCheck, Brain, Activity,
  Pill, FlaskConical, CalendarDays, AlertOctagon, ClipboardCheck, Sparkles,
} from "lucide-react";

const PATIENT_FEATURES = [
  { icon: Sparkles, label: "Vitalis AI", desc: "Ask questions about your records in plain language" },
  { icon: Activity, label: "Health Journey", desc: "Chronological timeline of your medical history" },
  { icon: FlaskConical, label: "Lab Trends", desc: "Track HbA1c, cholesterol, Vitamin D and more over time" },
  { icon: Pill, label: "Medications", desc: "Extracted from verified prescriptions, with refill reminders" },
  { icon: ClipboardCheck, label: "Care Plan", desc: "Follow-ups, screenings and health goals from your reports" },
  { icon: CalendarDays, label: "Appointments", desc: "Upcoming and past appointments with your doctors" },
  { icon: AlertOctagon, label: "Emergency Profile", desc: "Allergies, blood group, contacts — all in one place" },
  { icon: FileCheck, label: "Verified Reports", desc: "Documents uploaded by authenticated doctors only" },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Lifeline</h1>
            <p className="text-xs text-slate-500 -mt-0.5">Patient Health Intelligence Platform</p>
          </div>
          <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium text-sm">
            <a href="#mission" className="hover:text-blue-600 transition">Mission</a>
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#security" className="hover:text-blue-600 transition">Security</a>
            <a href="#portals" className="hover:text-blue-600 transition">Portals</a>
          </div>
          <div className="flex gap-3">
            <Link to="/doctor/login" className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm text-sm">
              Doctor Login
            </Link>
            <Link to="/patient/login" className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition px-5 py-2.5 rounded-xl font-semibold text-sm">
              Patient Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="mission" className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white pt-24 pb-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-blue-500/40 border border-blue-400 text-blue-100 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            Prototype · College Project Demonstration
          </span>
          <h2 className="text-5xl font-bold leading-tight mb-4">
            Your Personal Health<br />Intelligence Platform
          </h2>
          <p className="text-2xl text-blue-200 font-semibold mb-4">
            Remember · Understand · Prepare
          </p>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Lifeline organises your complete medical history, extracts meaning from reports,
            and helps you understand your health — all through a secure, patient-owned platform.
          </p>
          <div id="portals" className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/patient/login"
              className="flex items-center justify-center gap-3 bg-white text-blue-700 px-8 py-5 rounded-2xl font-bold hover:bg-blue-50 transition shadow-lg text-lg"
            >
              <User size={24} />
              Patient Portal
            </Link>
            <Link
              to="/doctor/login"
              className="flex items-center justify-center gap-3 bg-blue-500/30 border-2 border-blue-300 text-white px-8 py-5 rounded-2xl font-bold hover:bg-blue-500/50 transition shadow-lg text-lg"
            >
              <Stethoscope size={24} />
              Doctor Portal
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-8 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">How Lifeline Works</h2>
          <p className="text-slate-600 mb-12 max-w-2xl mx-auto">
            Doctors upload verified reports → Lifeline extracts structured health data →
            Patients understand and manage their complete health picture.
          </p>

          <div className="grid md:grid-cols-4 gap-0">
            {[
              { step: "1", title: "Doctor Uploads", desc: "Authenticated doctor uploads official medical report for a patient", icon: Stethoscope, color: "bg-blue-600" },
              { step: "2", title: "AI Extracts", desc: "Lifeline extracts diagnoses, medications, lab values, follow-ups", icon: Brain, color: "bg-purple-600" },
              { step: "3", title: "Records Updated", desc: "Health Journey, Lab Trends, Medications, Care Plan all update", icon: Activity, color: "bg-indigo-600" },
              { step: "4", title: "Patient Understands", desc: "Patient views, searches and asks Vitalis to explain their health data", icon: Sparkles, color: "bg-green-600" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative flex flex-col items-center px-4">
                  {i < 3 && (
                    <div className="absolute top-6 left-1/2 w-full h-0.5 bg-slate-200 z-0" />
                  )}
                  <div className={`relative z-10 w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <p className="font-bold text-slate-800 mb-1">{s.title}</p>
                  <p className="text-sm text-slate-500 text-center leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Patient Features */}
      <section id="features" className="py-20 px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-3">Patient Health Intelligence</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Everything you need to remember your medical history, understand your records,
              and prepare for every appointment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PATIENT_FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                    <Icon size={20} className="text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">{f.label}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security section */}
      <section id="security" className="py-16 px-8 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-3 text-center">Security by Design</h2>
          <p className="text-slate-600 text-center mb-10">
            Built on the principle that official medical records must originate from verified medical personnel,
            not patients — while patients retain full ownership and access to their own information.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Official reports uploaded exclusively by authenticated doctors",
              "Patients cannot submit official documents — preventing fake records",
              "Doctor must request access to previous patient history",
              "Patient approves or denies each access request",
              "Approved access automatically expires in 7 days",
              "OTP-verified patient identity for sensitive actions",
              "Automatic session expiry after 15 minutes inactivity",
              "Full immutable audit trail — every action logged with timestamp",
              "Separate portals, one shared secure data layer",
              "Role-based access control — roles cannot cross boundaries",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-green-600 font-bold text-base leading-none mt-0.5">✓</span>
                <span className="text-slate-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo credentials */}
      <section className="py-14 px-8 bg-blue-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Try Lifeline Now</h2>
          <p className="text-blue-100 mb-8">Use these demo credentials to explore both portals</p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-left">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <User size={18} /> Patient Portal
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-blue-100">Patient 1:</p>
                <p>ID: <span className="font-mono bg-white/20 px-2 py-0.5 rounded">PT-200001</span></p>
                <p>OTP: <span className="font-mono bg-white/20 px-2 py-0.5 rounded">111222</span></p>
                <p className="text-blue-200 text-xs mt-2">2 reports · 4 lab markers · Care plan items</p>
                <p className="text-blue-100 mt-2">Patient 2: <span className="font-mono bg-white/20 px-2 py-0.5 rounded">PT-200002</span></p>
              </div>
              <Link
                to="/patient/login"
                className="mt-5 block text-center bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition text-sm"
              >
                Enter Patient Portal →
              </Link>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-left">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Stethoscope size={18} /> Doctor Portal
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-blue-100">Doctor 1:</p>
                <p>ID: <span className="font-mono bg-white/20 px-2 py-0.5 rounded">DR-100001</span></p>
                <p>PW: <span className="font-mono bg-white/20 px-2 py-0.5 rounded">doctor123</span></p>
                <p className="text-blue-200 text-xs mt-2">Upload reports · Search patients · Request access</p>
                <p className="text-blue-100 mt-2">Doctor 2: <span className="font-mono bg-white/20 px-2 py-0.5 rounded">DR-100002</span></p>
              </div>
              <Link
                to="/doctor/login"
                className="mt-5 block text-center bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition text-sm"
              >
                Enter Doctor Portal →
              </Link>
            </div>
          </div>
          <p className="text-blue-200 text-xs mt-6">
            Passwords: patient123 (patients) · doctor123 (doctors)
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-center text-sm">
        <p className="font-semibold text-slate-300 mb-1">Lifeline</p>
        <p>Patient-Owned Personal Health Intelligence Platform</p>
        <p className="mt-1 text-slate-500">Remember · Understand · Prepare</p>
        <p className="mt-2 text-xs">College Project Prototype — Not for real clinical use.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
