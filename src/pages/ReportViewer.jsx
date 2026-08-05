import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import {
  FileText,
  Sparkles,
  BookOpen,
  MessageCircle,
  Calendar,
} from "lucide-react";

function ReportViewer() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 p-10 overflow-y-auto">
        <Topbar />

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Complete Blood Count Report
          </h1>

          <p className="text-slate-500 mt-2">
            Uploaded on 12 Jul 2026 • Blood Test
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left Side */}
          <section className="bg-white rounded-3xl shadow-sm p-8">

            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-blue-600" />
              <h2 className="text-2xl font-bold">
                Report Preview
              </h2>
            </div>

            <div className="h-[650px] border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center bg-slate-50">

              <div className="text-center">

                <FileText
                  size={70}
                  className="mx-auto text-slate-400 mb-4"
                />

                <p className="text-slate-500">
                  PDF Preview will appear here.
                </p>

              </div>

            </div>

          </section>

          {/* Right Side */}
          <div className="space-y-8">

            {/* AI Summary */}
            <section className="bg-white rounded-3xl shadow-sm p-8">

              <div className="flex items-center gap-3 mb-5">
                <Sparkles className="text-blue-600" />

                <h2 className="text-2xl font-bold">
                  AI Summary
                </h2>
              </div>

              <div className="bg-blue-50 rounded-2xl p-5">

                <p className="text-slate-700 leading-relaxed">
                  Your blood test appears to be within the normal range.
                  No significant abnormalities were detected.
                  Continue routine health monitoring and discuss any concerns
                  with your healthcare provider.
                </p>

              </div>

            </section>

            {/* Medical Terms */}
            <section className="bg-white rounded-3xl shadow-sm p-8">

              <div className="flex items-center gap-3 mb-5">
                <BookOpen className="text-green-600" />

                <h2 className="text-2xl font-bold">
                  Medical Terms Explained
                </h2>
              </div>

              <div className="space-y-4">

                <div className="border rounded-2xl p-4">
                  <h3 className="font-semibold">
                    Hemoglobin
                  </h3>

                  <p className="text-slate-600 mt-2">
                    A protein in red blood cells that carries oxygen
                    throughout your body.
                  </p>
                </div>

                <div className="border rounded-2xl p-4">
                  <h3 className="font-semibold">
                    White Blood Cells
                  </h3>

                  <p className="text-slate-600 mt-2">
                    Cells that help your body fight infections.
                  </p>
                </div>

              </div>

            </section>

            {/* Questions */}
            <section className="bg-white rounded-3xl shadow-sm p-8">

              <div className="flex items-center gap-3 mb-5">
                <MessageCircle className="text-purple-600" />

                <h2 className="text-2xl font-bold">
                  Questions to Ask Your Doctor
                </h2>
              </div>

              <ul className="space-y-3 text-slate-700 list-disc pl-6">

                <li>
                  Are all my values within the expected range?
                </li>

                <li>
                  Should I repeat this test in the future?
                </li>

                <li>
                  Are there lifestyle changes I should consider?
                </li>

              </ul>

            </section>

            {/* Timeline Button */}
            <button className="w-full bg-blue-600 text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition">

              <Calendar size={20} />

              Add to Medical Journey

            </button>

          </div>

        </div>

      </main>
    </div>
  );
}

export default ReportViewer;