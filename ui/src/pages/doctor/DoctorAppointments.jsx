import { useState, useEffect } from "react";
import { 
  Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Filter, Search, Eye, 
  Phone, MoreVertical, Loader2, Stethoscope, RefreshCw, Check, Clock as ClockIcon,Calendar as CalendarIcon,
} from "lucide-react";
import {getDoctorAppointments, updateAppointmentStatus}  from "../../api/axios"; 

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null); // Stores ID of being updated item
  const [showStatusMenu, setShowStatusMenu] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Calls: export const doctorAppointments = ...
      const response = await getDoctorAppointments(); 
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      setUpdatingStatus(appointmentId);
      // Calls: export const updateStatus = ...
      // Path: .patch("/update-status/:id") or similar
      await updateAppointmentStatus(appointmentId, newStatus);
      
      setAppointments(prev => prev.map(apt => 
        apt._id === appointmentId ? { ...apt, status: newStatus } : apt
      ));
      
      setShowStatusMenu(null);
    } catch (error) {
      alert("Failed to update status. Ensure you are authorized.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = filter === "all" || apt.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = apt.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "Cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return "Confirmed";
      case "Pending":
        return "Pending";
      case "Completed":
        return "Completed";
      case "Cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#32618F]">My Appointments</h1>
          <p className="text-gray-500">Manage your daily patient schedule</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search patient..." 
              className="pl-9 pr-4 py-2 border rounded-lg w-full outline-none focus:ring-2 focus:ring-[#4EB1B6]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={fetchAppointments} className="p-2 border rounded-lg hover:bg-gray-50">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
        {["all", "Pending", "Accepted", "Completed", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              filter === tab ? "border-b-2 border-[#32618F] text-[#32618F]" : "text-gray-500 hover:text-[#32618F]"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#32618F]" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredAppointments.map((apt) => (
            <div key={apt._id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              {console.log("Appointment Data:", apt)}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-[#32618F] font-bold mr-4 border border-blue-100">
                    {apt.patient?.name.charAt(0)}
                  </div>
                  <div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{apt.patient?.name}</h3>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {getStatusIcon(apt.status)}
                        <span className="ml-1">{getStatusBadge(apt.status)}</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Status Dropdown Trigger */}
                <div className="relative">
                  <button 
                    onClick={() => setShowStatusMenu(showStatusMenu === apt._id ? null : apt._id)}
                    className="p-1 hover:bg-gray-100 rounded-md"
                  >
                    <MoreVertical size={18} className="text-gray-400" />
                  </button>
                  {showStatusMenu === apt._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-xl z-20 p-1">
                      {["Pending", "Confirmed", "Completed", "Cancelled"].map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusUpdate(apt._id, s)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 rounded-md flex items-center justify-between"
                        >
                          {s} {updatingStatus === apt._id && <Loader2 size={12} className="animate-spin" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#4EB1B6]" />
                  <div>
                      <p className="text-sm font-semibold">
                        {new Date(apt.appointmentDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#4EB1B6]" />
                  {apt.timeSlot}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
  {apt.status.toLowerCase() === "pending" ? (
    <>
      <button
        onClick={() => handleStatusUpdate(apt._id, "accepted")}
        disabled={updatingStatus === apt._id}
        className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
      >
        {updatingStatus === apt._id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        Accept
      </button>
      
      <button
        onClick={() => handleStatusUpdate(apt._id, "cancelled")}
        disabled={updatingStatus === apt._id}
        className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-lg hover:bg-red-100 border border-red-200 transition-all disabled:opacity-50"
      >
        {updatingStatus === apt._id ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
        Cancel
      </button>
    </>
  ) : (
    <button 
      onClick={() => { setSelectedAppointment(apt); setShowDetailsModal(true); }}
      className="w-full py-2 bg-[#F8FAFB] text-[#32618F] text-sm font-semibold rounded-lg hover:bg-blue-50 border border-transparent hover:border-[#32618F] transition-all"
    >
      View Full Details
    </button>
  )}
</div>
            </div>
          ))}
        </div>
      )}

      {/* No Data State */}
      {!loading && filteredAppointments.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
          <CalendarIcon className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-gray-400">No appointments found for this category.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;