import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store";

export default function ProtectedRoute({ children }) {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}
