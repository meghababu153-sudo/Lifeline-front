import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useAppData } from "./AppDataContext";

const AuthContext = createContext();

// Session timeout: 15 minutes of inactivity
const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

export function AuthProvider({ children }) {
  const { addAuditLog } = useAppData();

  const [currentUser, setCurrentUser] = useState(null);  // { id, role, name, displayId }
  const [sessionExpired, setSessionExpired] = useState(false);

  const timeoutRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (!currentUser) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSessionExpired(true);
      addAuditLog({
        userId: currentUser.id,
        role: currentUser.role,
        action: "SESSION_EXPIRED",
        details: `Automatic logout after ${SESSION_TIMEOUT_MS / 60000} min inactivity`,
      });
      setCurrentUser(null);
    }, SESSION_TIMEOUT_MS);
  }, [currentUser, addAuditLog]);

  // Track user activity
  useEffect(() => {
    if (!currentUser) return;
    const events = ["mousemove", "keydown", "click", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearTimeout(timeoutRef.current);
    };
  }, [currentUser, resetTimer]);

  const login = useCallback(
    (user) => {
      setCurrentUser(user);
      setSessionExpired(false);
      addAuditLog({
        userId: user.id,
        role: user.role,
        action: "LOGIN",
        details: `${user.role} ${user.displayId} logged in`,
      });
    },
    [addAuditLog]
  );

  const logout = useCallback(
    (reason = "manual") => {
      if (currentUser) {
        addAuditLog({
          userId: currentUser.id,
          role: currentUser.role,
          action: reason === "session" ? "SESSION_EXPIRED" : "LOGOUT",
          details: `${currentUser.role} ${currentUser.displayId} logged out`,
        });
      }
      setCurrentUser(null);
      clearTimeout(timeoutRef.current);
    },
    [currentUser, addAuditLog]
  );

  const acknowledgeExpiry = () => setSessionExpired(false);

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, sessionExpired, acknowledgeExpiry }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
