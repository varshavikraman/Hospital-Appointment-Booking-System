import { useState, useEffect } from "react";
import { 
  Search, 
  User, 
  Stethoscope,
  RefreshCw,
  Loader2,
  Filter,
  UserRound
} from "lucide-react";
import { listDoctors } from "../../api/axios"; // Path to your axios helper

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specFilter, setSpecFilter] = useState("all");

  const specializations = [
    "Cardiology", "Neurology", "Orthopedics", "Pediatrics", 
    "Dermatology", "Gastroenterology", "General Medicine"
  ];

  useEffect(() => {
    fetchDoctors();
  }, [specFilter]); // Re-fetch when the specialization filter changes

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      // Calls your backend: /list?specialization=...
      const res = await listDoctors(specFilter); 
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 md:p-8 bg-[#F8FAFB] min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#32618F]">Medical Staff</h1>
          <p className="text-gray-500 text-sm">View and manage all registered doctors.</p>
        </div>
        
        <button
          onClick={fetchDoctors}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctor by name..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#4EB1B6] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#4EB1B6] appearance-none bg-white text-gray-600"
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
          >
            <option value="all">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {!loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500 ml-2">
          <UserRound size={16} />
          <span>Showing <strong>{filteredDoctors.length}</strong> doctors</span>
        </div>
      )}

      {/* Doctors Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin h-10 w-10 text-[#32618F] mb-4" />
          <p className="text-gray-500 animate-pulse">Fetching medical staff records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <User className="text-[#32618F] h-10 w-10" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1">{doctor.name}</h3>
                
                <div className="flex items-center gap-2 px-3 py-1 bg-[#4EB1B6]/10 text-[#4EB1B6] rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  <Stethoscope size={14} />
                  {doctor.specialization}
                </div>

                <div className="w-full pt-4 border-t border-gray-50">
                   <p className="text-xs text-gray-400 font-mono mb-3">ID: {doctor._id.slice(-8).toUpperCase()}</p>
                   <button className="w-full py-2 rounded-lg text-sm font-semibold text-[#32618F] hover:bg-blue-50 transition-colors border border-blue-50">
                     View Full Profile
                   </button>
                </div>
              </div>
            </div>
          ))}

          {filteredDoctors.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl border-2 border-dashed border-gray-200 py-20 flex flex-col items-center">
              <User size={48} className="text-gray-200 mb-4" />
              <h3 className="text-gray-500 font-medium">No doctors match your criteria</h3>
              <button 
                onClick={() => {setSearchTerm(""); setSpecFilter("all");}}
                className="mt-4 text-[#4EB1B6] text-sm font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllDoctors;