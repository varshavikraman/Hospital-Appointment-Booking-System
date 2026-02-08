import { useState } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  Stethoscope, 
  Save, 
  Loader2, 
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { createDoctor } from "../../api/axios"; // Adjust path to your axios instance

const RegisterDoctor = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
  });

  const specializations = [
    "Cardiology", "Neurology", "Orthopedics", "Pediatrics", 
    "Dermatology", "Gastroenterology", "Oncology", "Psychiatry", 
    "Radiology", "Surgery", "General Medicine"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Calling your backend controller via axios
      const response = await createDoctor(formData);
      
      setMessage({ type: "success", text: response.data.message });
      setFormData({ name: "", email: "", password: "", specialization: "" });
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to register doctor" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF6F7] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#32618F]">Register New Doctor</h1>
          <p className="text-gray-600 mt-2">Create a new professional account for the hospital system.</p>
        </div>

        {/* Feedback Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center border ${
            message.type === "success" 
              ? "bg-green-50 border-green-200 text-green-700" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {message.type === "success" ? <CheckCircle className="mr-3" /> : <AlertCircle className="mr-3" />}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <User size={16} className="mr-2 text-[#4EB1B6]" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Dr. John Doe"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#4EB1B6] focus:border-[#4EB1B6] outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Mail size={16} className="mr-2 text-[#4EB1B6]" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="doctor@careconnect.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#4EB1B6] focus:border-[#4EB1B6] outline-none transition-all"
                />
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Stethoscope size={16} className="mr-2 text-[#4EB1B6]" /> Specialization
                </label>
                <select
                  name="specialization"
                  required
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#4EB1B6] focus:border-[#4EB1B6] outline-none transition-all appearance-none bg-white"
                >
                  <option value="">Select Specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Lock size={16} className="mr-2 text-[#4EB1B6]" /> Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#4EB1B6] focus:border-[#4EB1B6] outline-none transition-all"
                />
                <p className="mt-2 text-xs text-gray-400">Must be at least 8 characters long.</p>
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#32618F] hover:bg-[#1e4160] text-white py-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2" />
              )}
              {loading ? "Registering..." : "Register Doctor"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterDoctor;