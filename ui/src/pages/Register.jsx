import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  ArrowRight,
  CheckCircle,
  Heart,
  ChevronRight
} from "lucide-react";
import ccLogo from "../assets/careconnect-logo.jpeg";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password strength
    if (name === "password") {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // Basic validation
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    toast.error("Passwords do not match");
    return;
  }

  if (formData.password.length < 8) {
    setError("Password must be at least 8 characters long");
    toast.error("Password must be at least 8 characters long");
    return;
  }

  setLoading(true);

  try {
    // Prepare data for API
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    // 1️⃣ Register user (this now returns the user object and sets the cookie)
    const res = await registerUser(userData);

    // 2️⃣ Use the data from the registration response directly
    const { user, message } = res.data;

    // 3️⃣ Update auth context
    setUser(user);

    toast.success(message || "Registration successful!");
    setTimeout(() => navigate("/patient"), 1000);


  } catch (err) {
    const message = err.response?.data?.message || "Registration failed. Please try again.";
    setError(message);
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  const getStrengthColor = (strength) => {
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-400";
    if (strength === 2) return "bg-orange-400";
    if (strength === 3) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF6F7] via-white to-[#EFF6F7] flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#4EB1B6]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#88D6A6]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header with Logo */}
          <div className="bg-gradient-to-r from-[#32618F] to-[#1e4160] p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center mr-3 overflow-hidden">
                    <img 
                        src={ccLogo} // or your logo path
                        alt="CareConnect Logo"
                        className="h-8 w-8 object-contain"
                    />
                </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-white font-poppins">CareConnect</h1>
                <p className="text-[#88D6A6] text-sm font-inter">Patient Registration</p>
              </div>
            </div>
            <p className="text-white/90 text-sm font-inter">
              Join our healthcare community for seamless appointment booking
            </p>
          </div>

          <div className="p-8">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-inter">{error}</p>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#32618F] mb-2 font-inter">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="pl-10 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#4EB1B6] focus:border-[#4EB1B6] focus:outline-none transition font-inter"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#32618F] mb-2 font-inter">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#4EB1B6] focus:border-[#4EB1B6] focus:outline-none transition font-inter"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#32618F] mb-2 font-inter">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-10 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#4EB1B6] focus:border-[#4EB1B6] focus:outline-none transition font-inter"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-700 font-inter">Password strength</span>
                      <span className="text-xs text-gray-500 font-inter">
                        {passwordStrength === 0 && "Too weak"}
                        {passwordStrength === 1 && "Weak"}
                        {passwordStrength === 2 && "Fair"}
                        {passwordStrength === 3 && "Good"}
                        {passwordStrength === 4 && "Strong"}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                        style={{ width: `${passwordStrength * 25}%` }}
                      ></div>
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center">
                        {formData.password.length >= 8 ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-gray-300 mr-2"></div>
                        )}
                        <span className={`text-xs ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'} font-inter`}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center">
                        {/[A-Z]/.test(formData.password) ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-gray-300 mr-2"></div>
                        )}
                        <span className={`text-xs ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'} font-inter`}>
                          One uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center">
                        {/[0-9]/.test(formData.password) ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-gray-300 mr-2"></div>
                        )}
                        <span className={`text-xs ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'} font-inter`}>
                          One number
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#32618F] mb-2 font-inter">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="pl-10 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#4EB1B6] focus:border-[#4EB1B6] focus:outline-none transition font-inter"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="flex items-center mt-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-xs text-green-600 font-inter">Passwords match</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg text-white bg-[#32618F] hover:bg-[#1e4160] focus:ring-2 focus:ring-[#32618F] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-inter font-medium shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-gray-600 font-inter">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="font-medium text-[#4EB1B6] hover:text-[#32618F] inline-flex items-center"
                  >
                    Login here
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#32618F] px-8 py-4 border-t border-[#1e4160]">
            <p className="text-center text-sm text-white/90 font-inter">
              © {new Date().getFullYear()} CareConnect Healthcare
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;