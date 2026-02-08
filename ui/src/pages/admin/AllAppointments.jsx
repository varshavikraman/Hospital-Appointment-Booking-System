import { useState, useEffect } from "react";
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Trash2
} from "lucide-react";
import { getAllAppointments, cancelAppointment } from "../../api/axios";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllAppointments();
      // Matches your backend response: res.json({appointments: Appointments...})
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await cancelAppointment(id);
      fetchData(); // Refresh list
    } catch (err) {
      alert("Error cancelling appointment");
    }
  };

  const filteredAppointments = appointments.filter(appt => 
    appt.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.date.includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-green-100 text-green-800 border-green-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || "bg-gray-100"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#32618F]">Hospital Appointments</h1>
          <p className="text-gray-500 text-sm">Monitor and manage all scheduled visits across the hospital.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctor or patient..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[#4EB1B6]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-[#32618F]" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAppointments.map((appt) => (
            <div key={appt._id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                {/* Appointment Primary Info */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                    <Calendar className="text-[#32618F] h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{appt.date}</span>
                      <span className="text-gray-400 text-xs">|</span>
                      <span className="text-gray-600 font-medium">{appt.timeSlot}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-mono">ID: {appt._id.toUpperCase()}</p>
                  </div>
                </div>

                {/* Patient & Doctor Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Patient</p>
                      <p className="font-semibold text-gray-800">{appt.patient?.name || "Deleted User"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Stethoscope className="h-4 w-4 text-[#4EB1B6] mt-1" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Specialist</p>
                      <p className="font-semibold text-gray-800">{appt.doctor?.name || "Unassigned"}</p>
                      <p className="text-xs text-[#4EB1B6]">{appt.doctor?.specialization}</p>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-4 min-w-[150px] justify-end">
                  {getStatusBadge(appt.status)}
                  {appt.status === "pending" && (
                    <button 
                      onClick={() => handleCancel(appt._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancel Appointment"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">No appointments found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllAppointments;