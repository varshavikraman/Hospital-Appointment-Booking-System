import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import your Auth Hook
import { getMyAppointments, listDoctors } from "../../api/axios"; // Import API calls
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText,
  Heart,
  CheckCircle,
  ChevronRight,
  User,
  Loader2 // Added for loading state
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ upcoming: 0, completed: 0, doctors: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch real appointments and available doctors in parallel
        const [apptsRes, doctorsRes] = await Promise.all([
          getMyAppointments(),
          listDoctors()
        ]);

        const allAppts = Array.isArray(apptsRes.data) ? apptsRes.data : (apptsRes.data?.appointments || []);
        const allDoctors = Array.isArray(doctorsRes.data) ? doctorsRes.data : (doctorsRes.data?.doctors || []);

        // 2. Set appointments state (e.g., show the last 3)
        setAppointments(allAppts.slice(0, 3));

        // 3. Calculate stats based on real database data
        setStats({
          upcoming: allAppts.filter(a => a.status === 'confirmed').length,
          completed: allAppts.filter(a => a.status === 'completed').length,
          pending: allAppts.filter(a => a.status === 'pending').length,
          doctors: allDoctors.length
        });

      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#32618F]">
        <Loader2 className="h-10 w-10 animate-spin mb-2" />
        <p className="font-medium">Loading your health overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section - Now using Dynamic Name */}
      <div className="bg-gradient-to-r from-[#32618F] to-[#1e4160] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Patient'}!</h1>
            <p className="text-blue-100 mb-4">
              You have {stats.upcoming} confirmed appointments coming up.
            </p>
            <Link
              to="/patient/doctors"
              className="inline-flex items-center px-4 py-2 bg-white text-[#32618F] rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Book New Appointment
              <Calendar className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Now using Dynamic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} color="bg-blue-100" iconColor="text-[#32618F]" value={stats.upcoming} label="Upcoming Appointments" sub="Scheduled" />
        <StatCard icon={CheckCircle} color="bg-green-100" iconColor="text-[#88D6A6]" value={stats.completed} label="Completed" sub="Past visits" />
        <StatCard icon={Clock} color="bg-yellow-100" iconColor="text-yellow-600" value={stats.pending} label="Pending" sub="Awaiting check" />
        <StatCard icon={Users} color="bg-purple-100" iconColor="text-purple-600" value={stats.doctors} label="Available Doctors" sub="Specialists" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments - Real Data */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Link to="/patient/appointments" className="text-sm text-[#32618F] font-medium">View All</Link>
            </div>
            <div className="p-6">
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appt) => (
                    <div key={appt._id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                          <User className="h-5 w-5 text-[#32618F]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{appt.doctorName || "Doctor"}</h3>
                          <p className="text-sm text-gray-500">{appt.specialization}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{new Date(appt.date).toLocaleDateString()}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(appt.status)}`}>
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No recent appointments found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions (Keep static as they are links) */}
        <div className="space-y-6">
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
};

// Helper Components for Cleaner Code
const StatCard = ({ icon: Icon, color, iconColor, value, label, sub }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`h-12 w-12 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
    </div>
    <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
    <p className="text-xs text-gray-400">{sub}</p>
  </div>
);

const getStatusStyles = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const QuickActionsCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="space-y-3">
            <ActionLink to="/patient/doctors" icon={Calendar} color="bg-[#4EB1B6]" title="Book Appointment" sub="With specialist" />
            <ActionLink to="/patient/medical-records" icon={FileText} color="bg-[#88D6A6]" title="Medical Records" sub="View history" />
            <ActionLink to="/patient/profile" icon={User} color="bg-[#32618F]" title="Profile Settings" sub="Update info" />
        </div>
    </div>
);

const ActionLink = ({ to, icon: Icon, color, title, sub }) => (
    <Link to={to} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all">
        <div className="flex items-center">
            <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center mr-3`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
                <h3 className="font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{sub}</p>
            </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
    </Link>
);

export default Dashboard;