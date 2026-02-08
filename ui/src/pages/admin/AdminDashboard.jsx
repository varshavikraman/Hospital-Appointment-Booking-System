import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, UserPlus, Calendar, Clock, Activity, ArrowUpRight, FileText, Shield, BarChart3, Loader2, CheckCircle
} from "lucide-react";
import {getAdminStats} from "../../api/axios"; // or your custom axios instance

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getAdminStats(); 
        setStats(response.data.stats);
        setRecentDoctors(response.data.recentDoctors);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-[#32618F]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#32618F] to-[#1e4160] rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-blue-100 mb-4">Manage the entire hospital system from one place</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Doctors", val: stats.totalDoctors, icon: Users, color: "bg-blue-100 text-[#32618F]", desc: "Registered specialists" },
          { label: "Pending Approvals", val: stats.pendingDoctors, icon: UserPlus, color: "bg-green-100 text-green-600", desc: "Awaiting review" },
          { label: "Total Appointments", val: stats.totalAppointments, icon: Calendar, color: "bg-purple-100 text-purple-600", desc: "All time" },
          { label: "Today's Appointments", val: stats.todayAppointments, icon: Clock, color: "bg-yellow-100 text-yellow-600", desc: "Scheduled for today" },
          { label: "Total Patients", val: stats.totalPatients, icon: Users, color: "bg-red-100 text-red-600", desc: "Registered patients" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`h-12 w-12 rounded-lg ${item.color} flex items-center justify-center`}>
                <item.icon className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{item.val}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">{item.label}</h3>
            <p className="text-xs text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Recent Doctors Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recent Doctor Registrations</h2>
          <Link to="/admin/doctors" className="text-sm text-[#32618F] font-medium hover:underline">View All</Link>
        </div>
        <div className="p-6 space-y-4">
          {recentDoctors.map((doc) => (
            <div key={doc._id} className="flex items-center justify-between p-4 rounded-lg border border-gray-50 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mr-4 text-[#32618F] font-bold">
                  {doc.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-gray-500">{doc.specialization}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">ID: ...{doc._id.slice(-5)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;