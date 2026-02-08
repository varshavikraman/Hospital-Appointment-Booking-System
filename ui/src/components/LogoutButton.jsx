import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);          // clear frontend state
      navigate("/login");     // redirect
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (

    <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    // <button
    //   onClick={handleLogout}
    //   className="bg-red-500 text-white px-4 py-2 rounded"
    // >
    //   Logout
    // </button>
  );
};

export default LogoutButton;
