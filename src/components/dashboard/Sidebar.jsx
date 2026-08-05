import { Link } from "react-router-dom";
import {
  House,
  Clock3,
  FileText,
  Pill,
  Bell,
  Users,
  Settings,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r p-8 flex flex-col">

      {/* Logo */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-blue-600">
          Lifeline
        </h1>

        <p className="text-slate-500 text-sm">
          Your Health Companion
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">

        <Link
          to="/dashboard"
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-medium"
        >
          <House size={20} />
          Overview
        </Link>

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-100 transition">
          <Clock3 size={20} />
          Medical Journey
        </button>

        <Link
          to="/reports"
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-100 transition"
        >
          <FileText size={20} />
          Reports
        </Link>

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-100 transition">
          <Pill size={20} />
          Medications
        </button>

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-100 transition">
          <Bell size={20} />
          Reminders
        </button>

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-100 transition">
          <Users size={20} />
          Family Hub
        </button>

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-100 transition">
          <Settings size={20} />
          Settings
        </button>

      </nav>

      {/* Footer Card */}
      <div className="mt-auto bg-blue-50 rounded-2xl p-5">
        <h3 className="font-semibold text-blue-700">
          Your data is secure
        </h3>

        <p className="text-sm text-slate-600 mt-2">
          End-to-end encryption keeps your health records protected.
        </p>
      </div>

    </aside>
  );
}

export default Sidebar;
