import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "../api/axios";
import socket from "../socket";
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const connectSocket = (userId) => {
  if (socket.connected) return;
    socket.io.opts.query = { userId };
    socket.connect();

    // Listen for notifications globally
    socket.on("new_notification", (notif) => {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">New Notification</p>
                <p className="mt-1 text-sm text-gray-500">{notif.message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#32618F] hover:text-[#4EB1B6] focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ), { duration: 5000 });
    });
  };

  const fetchUser = async () => {
    try {
      // Axios automatically throws an error for non-2xx status codes
      const res = await getUser();
      const userData = res.data;
      // res.data contains the JSON body: { role, id, name }
      setUser(userData);
      setError(null);
      console.log("User fetched successfully:", res.data);
      
      // Connect socket if user is successfully fetched
      if (userData?._id || userData?.id) {
        connectSocket(userData._id || userData.id);
      }
    } catch (err) {
      // 401/404 just means no active session, not necessarily a "system error"
      if (err.response?.status !== 401 && err.response?.status !== 404) {
        console.error("Session check failed:", err.response?.data?.message || err.message);
        setError(err.message || "Something went wrong");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    return () => socket.disconnect();
  }, []);

  const refreshUser = () => fetchUser();

  const loginUser = (userData) => {
    // Expecting userData to be: { id, role, name, email }
    setUser(userData);
    if (userData?._id || userData?.id) {
      connectSocket(userData._id || userData.id);
    }
  };

  const logoutUser = () => {
    socket.disconnect();
    setUser(null);
    localStorage.removeItem("token");
    // Optional: add navigation to /login here if needed
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, refreshUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);