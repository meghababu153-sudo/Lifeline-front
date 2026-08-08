import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps a route and redirects to `redirectTo` if the user is not logged in
 * or does not have the required role.
 */
export default function ProtectedRoute({ children, requiredRole, redirectTo = "/login" }) {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to={redirectTo} replace />;
  if (requiredRole && currentUser.role !== requiredRole) {
    // Wrong portal — send to their own portal
    if (currentUser.role === "DOCTOR") return <Navigate to="/doctor/dashboard" replace />;
    if (currentUser.role === "PATIENT") return <Navigate to="/patient/dashboard" replace />;
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
