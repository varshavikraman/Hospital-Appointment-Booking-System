import { useState, useEffect } from "react";
import { Search, Filter, Star, User, Award, X, Loader2 } from "lucide-react";
import { listDoctors, bookAppointment } from "../../api/axios";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  
  // Modal & Booking State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({ date: "", timeSlot: "" });

  // 1. Defined the missing array
  const specializations = [
    "All Specializations",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Dermatology",
    "Gastroenterology",
    "General"
  ];

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await listDoctors();
      setDoctors(res.data);
    } catch (err) { 
      console.error("Error fetching doctors:", err);
    } finally { 
      setLoading(false); 
    }
  };

  // 2. Added filtering logic for Search and Dropdown
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = selectedSpecialization === "all" || doc.specialization === selectedSpecialization;
    return matchesSearch && matchesSpec;
  });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingData.date || !bookingData.timeSlot) return alert("Please select date and time");

    try {
      await bookAppointment({
        doctorId: selectedDoctor._id,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot
      });
      alert("Appointment requested!");
      setShowBookingModal(false);
      setBookingData({ date: "", timeSlot: "" });
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#32618F] to-[#1e4160] rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Find Your Specialist</h1>
        <p className="text-blue-100">Browse expert doctors and schedule appointments</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#4EB1B6] outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#4EB1B6] outline-none"
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec === "All Specializations" ? "all" : spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 text-[#32618F]">
          <Loader2 className="animate-spin h-10 w-10 mb-2" />
          <p>Loading doctors...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all flex flex-col">
              <div className="flex items-center mb-4">
                <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center mr-4 border border-blue-100">
                  <User className="text-[#32618F]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-[#4EB1B6] font-medium">{doctor.specialization}</p>
                </div>
              </div>

              <button
                onClick={() => { setSelectedDoctor(doctor); setShowBookingModal(true); }}
                className="w-full bg-[#32618F] text-white py-2.5 rounded-lg font-medium hover:bg-[#1e4160] transition-colors"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Book Appointment</h2>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X />
              </button>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-xl flex items-center">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                 <User className="text-[#32618F] h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Doctor</p>
                <p className="font-bold text-[#32618F]">{selectedDoctor?.name}</p>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Date</label>
                <input 
                  type="date" 
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4EB1B6] outline-none transition-all"
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingData({...bookingData, timeSlot: slot})}
                      className={`py-2.5 text-xs font-bold border rounded-lg transition-all ${
                        bookingData.timeSlot === slot 
                        ? 'bg-[#32618F] text-white border-[#32618F]' 
                        : 'bg-white text-gray-600 hover:border-[#32618F] hover:text-[#32618F]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#4EB1B6] text-white py-3.5 rounded-xl font-bold hover:bg-[#3ca1a6] shadow-lg shadow-[#4EB1B6]/20 transition-all active:scale-[0.98] mt-4"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;