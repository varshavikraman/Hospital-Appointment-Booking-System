import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, Calendar, Clock, CheckCircle, 
  ArrowUpRight, Activity, Loader2, UserCheck, 
  ChevronRight, AlertCircle 
} from "lucide-react";
import {getDoctorDashboard} from "../../api/axios"; 

const DoctorDashboard = () => {
    const [data, setData] = useState({
        todayCount: 0,
        totalPatients: 0,
        confirmedCount: 0,
        pendingCount: 0,
        upcoming: []
    });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // This endpoint should aggregate stats for the logged-in doctor
        const res = await getDoctorDashboard();
        setData(res.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-[#32618F]" />
    </div>
  );

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#32618F]">Welcome, Doctor</h1>
          <p className="text-gray-500">Here's what's happening with your practice today.</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm font-medium text-gray-400 uppercase">Today's Date</p>
          <p className="text-lg font-bold text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Appointments" value={data?.todayCount || 0} icon={Clock} color="bg-blue-50 text-blue-600" />
        <StatCard title="Total Patients" value={data?.totalPatients || 0} icon={Users} color="bg-purple-50 text-purple-600" />
        <StatCard title="Confirmed" value={data?.confirmedCount || 0} icon={UserCheck} color="bg-green-50 text-green-600" />
        <StatCard title="Pending" value={data?.pendingCount || 0} icon={AlertCircle} color="bg-yellow-50 text-yellow-600" />
    </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-800">Upcoming Appointments</h2>
            <Link to="/doctor/appointments" className="text-sm text-[#4EB1B6] font-semibold hover:underline">View Schedule</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {data.upcoming.map((apt) => (
              <div key={apt._id} className="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-[#32618F] font-bold">
                    {apt.patient?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{apt.patient?.name}</p>
                    <p className="text-sm text-gray-500">{new Date(apt.appointmentDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</p>
                    <p className="text-xs text-gray-500">{apt.timeSlot}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                  apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
            {data.upcoming.length === 0 && (
              <p className="p-10 text-center text-gray-400">No appointments for today.</p>
            )}
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <ActionButton label="View Patient Records" icon={Users} to="/doctor/patients" />
            <ActionButton label="Schedule Update" icon={Calendar} to="/doctor/schedule" />
            <ActionButton label="Performance Reports" icon={Activity} to="/doctor/reports" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const ActionButton = ({ label, icon: Icon, to }) => (
  <Link to={to} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-[#4EB1B6] hover:bg-blue-50 group transition-all">
    <div className="flex items-center gap-3">
      <Icon size={18} className="text-gray-400 group-hover:text-[#4EB1B6]" />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <ChevronRight size={16} className="text-gray-300" />
  </Link>
);

export default DoctorDashboard;