import DoctorLayout from "../../layouts/DoctorLayout";
import { Bell } from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";

function DoctorNotificationsPage() {
  const { currentUser } = useAuth();
  const { accessRequests, findPatient } = useAppData();

  const myRequests = accessRequests.filter((r) => r.doctorId === currentUser.id);

  const notifications = myRequests.map((req) => {
    const patient = findPatient(req.patientId);
    if (req.status === "APPROVED") {
      return {
        id: req.requestId,
        type: "success",
        title: "Access Request Approved",
        body: `${patient?.name || req.patientId} approved your request to view their medical records.`,
        time: req.approvedAt,
      };
    }
    if (req.status === "DENIED") {
      return {
        id: req.requestId,
        type: "error",
        title: "Access Request Denied",
        body: `${patient?.name || req.patientId} denied your request to view their medical records.`,
        time: req.approvedAt,
      };
    }
    return {
      id: req.requestId,
      type: "info",
      title: "Access Request Pending",
      body: `Your request to access ${patient?.name || req.patientId}'s records is awaiting approval.`,
      time: req.requestedAt,
    };
  });

  const colorMap = {
    success: "bg-green-50 border-green-200 text-green-700",
    error: "bg-red-50 border-red-200 text-red-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };
  const dotMap = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <DoctorLayout>
      <div className="p-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-2">Updates on your access requests and activity.</p>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white border rounded-3xl p-12 text-center text-slate-400">
            <Bell size={48} className="mx-auto mb-4 opacity-30" />
            <p>No notifications yet. They will appear here when patients respond to your requests.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div key={n.id} className={`flex items-start gap-4 border rounded-2xl p-5 ${colorMap[n.type]}`}>
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${dotMap[n.type]}`} />
                <div className="flex-1">
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm mt-0.5 opacity-80">{n.body}</p>
                </div>
                {n.time && (
                  <p className="text-xs opacity-60 shrink-0 whitespace-nowrap">
                    {new Date(n.time).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}

export default DoctorNotificationsPage;
