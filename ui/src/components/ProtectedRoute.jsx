import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowRoles }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  // If AuthContext is still fetching user data from the token, show nothing or a loader
  if (loading) return <div>Loading...</div>;

  // If there's no user and no token, go to login
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  // If user exists but role doesn't match
  if (user && allowRoles && !allowRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
