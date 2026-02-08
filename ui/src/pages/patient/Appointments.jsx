import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar as CalendarIcon,
  Trash2,
  Loader2
} from "lucide-react";
import { getMyAppointments, cancelAppointment } from "../../api/axios";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getMyAppointments();
      // Accessing the 'Appointments' key from your backend response
      setAppointments(res.data.Appointments || []);
    } catch (err) {
      console.error("Error loading appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await cancelAppointment(id);
      // Update local state to reflect cancellation immediately
      setAppointments(prev => 
        prev.map(appt => appt._id === id ? { ...appt, status: 'Cancelled' } : appt)
      );
    } catch (err) {
      console.error("Error cancelling appointment:", err);  
      alert(err.response?.data?.message || "Failed to cancel appointment");
    }
  };

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#32618F]">
        <Loader2 className="h-10 w-10 animate-spin mb-2" />
        <p className="font-medium">Fetching your appointments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#32618F] to-[#1e4160] rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold mb-2">My Appointments</h1>
            <p className="text-blue-100">Manage and track all your medical appointments</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <span className="text-sm text-[#32618F] font-semibold">
            Total: {appointments.length}
          </span>
        </div>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-dashed border-gray-300 text-center">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No appointments found</h3>
          <p className="text-gray-500 mb-6">You haven't scheduled any appointments yet.</p>
          <button className="bg-[#32618F] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#1e4160] transition-colors">
            Book your first appointment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {appointments.map((appt) => (
            
            <div key={appt._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {console.log("Appointment Data:", appt)}
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mr-4 border border-blue-100">
                      <User className="h-6 w-6 text-[#32618F]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {appt.doctor?.name || "Specialist"}
                      </h3>
                      <p className="text-[#4EB1B6] font-medium text-sm">
                        {appt.doctor?.specialization || "General Medicine"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appt.status)}`}>
                      {getStatusIcon(appt.status)}
                      <span className="ml-1">{getStatusBadge(appt.status)}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <Calendar className="h-5 w-5 mr-3 text-[#32618F]" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Date</p>
                      <p className="text-sm font-semibold">
                        {new Date(appt.appointmentDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <Clock className="h-5 w-5 mr-3 text-[#32618F]" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Time Slot</p>
                      <p className="text-sm font-semibold">{appt.timeSlot}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                   <div className="flex items-center text-xs text-gray-400">
                     <AlertCircle className="h-3 w-3 mr-1" />
                     ID: {appt._id.slice(-8).toUpperCase()}
                   </div>
                   
                   {/* Only show cancel button if status is pending or confirmed */}
                   {(appt.status === 'pending' || appt.status === 'confirmed') && (
                     <button
                       onClick={() => handleCancel(appt._id)}
                       className="flex items-center text-red-600 hover:text-red-800 text-sm font-bold transition-colors group"
                     >
                       <Trash2 className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                       Cancel Appointment
                     </button>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;