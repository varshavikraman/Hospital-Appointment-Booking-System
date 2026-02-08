import { useEffect, useState } from "react";
import socket from "../socket";
import toast from "react-hot-toast";
import { getMyNotifications, markNotificationAsRead } from "../api/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await getMyNotifications();
      setNotifications(res.data);
    } catch (err) {
      toast.error("Could not load notification history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Local listener to update the list in real-time if the user is ON this page
    const handleNewNotif = (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
    };

    socket.on("new_notification", handleNewNotif);
    return () => socket.off("new_notification", handleNewNotif);
  }, []);

  const handleRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      toast.success("Marked as read");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto min-h-screen bg-[#EFF6F7]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#32618F]">Notifications</h1>
        <span className="bg-[#4EB1B6] text-white px-3 py-1 rounded-full text-xs font-bold">
          {notifications.filter(n => !n.read).length} Unread
        </span>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white p-10 rounded-xl text-center border-2 border-dashed border-gray-200">
             <p className="text-gray-400">No notifications yet.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                n.read ? "bg-white/60 border-gray-100" : "bg-white border-l-4 border-l-[#4EB1B6] shadow-md"
              }`}
            >
              <div className="flex justify-between items-start">
                <p className={`text-sm ${n.read ? "text-gray-500" : "text-gray-800 font-medium"}`}>
                  {n.message}
                </p>
                {!n.read && (
                  <button
                    onClick={() => handleRead(n._id)}
                    className="ml-4 text-xs font-bold text-[#32618F] hover:underline whitespace-nowrap"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-2">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;