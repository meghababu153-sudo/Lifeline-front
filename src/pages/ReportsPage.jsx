import { useRef, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { Upload, FileText, Eye, Sparkles } from "lucide-react";

function ReportsPage() {
  const fileInputRef = useRef(null);

  const [uploadedFile, setUploadedFile] = useState(null);

  const [reports, setReports] = useState([
    {
      name: "Complete Blood Count.pdf",
      category: "Blood Test",
      date: "12 Jul 2026",
      status: "AI Summary Ready",
    },
    {
      name: "MRI Lumbar Spine.pdf",
      category: "Radiology",
      date: "02 Mar 2026",
      status: "AI Summary Ready",
    },
    {
      name: "Prescription.pdf",
      category: "Prescription",
      date: "Today",
      status: "New Upload",
    },
  ]);

  const handleUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setUploadedFile(file.name);

    const newReport = {
      name: file.name,
      category: "New Upload",
      date: "Today",
      status: "Processing...",
    };

    setReports((prev) => [newReport, ...prev]);

    event.target.value = "";
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 p-10 overflow-y-auto">
        <Topbar />

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Reports
            </h1>

            <p className="text-slate-500 mt-2">
              Upload, organize and review your medical records.
            </p>
          </div>

          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleUpload}
            />

            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              <Upload size={20} />
              Upload Report
            </button>
          </>
        </div>

        {/* Success Message */}
        {uploadedFile && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4">
            <h3 className="font-semibold text-green-700">
              ✅ Report uploaded successfully!
            </h3>

            <p className="text-green-600 mt-1">
              {uploadedFile}
            </p>
          </div>
        )}

        {/* Reports */}
        <div className="space-y-6">
          {reports.map((report, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-sm border p-6"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <div className="bg-blue-100 p-4 rounded-2xl">
                    <FileText className="text-blue-600" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-xl">
                      {report.name}
                    </h2>

                    <p className="text-slate-500 mt-1">
                      {report.category} • {report.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      report.status === "Processing..."
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {report.status}
                  </span>

                  <button
                    onClick={() =>
                      (window.location.href = "/report-viewer")
                    }
                    className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl hover:bg-slate-200 transition"
                  >
                    <Eye size={18} />
                    View
                  </button>

                  <button className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-200 transition">
                    <Sparkles size={18} />
                    AI Summary
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ReportsPage;