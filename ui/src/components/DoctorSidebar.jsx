import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Clock,
  Stethoscope,
  User,
  Settings,
  LogOut,
  Home,
  Bell
} from "lucide-react";
import LogoutButton from "./LogoutButton"; 
import ccLogo from "../assets/careconnect-logo.jpeg";

const DoctorSidebar = ({ onClose }) => {
  const { user } = useAuth();

  const navItems = [
    { path: "/doctor", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/doctor/appointments", icon: Calendar, label: "Appointments" },
    { path: "/doctor/notifications", icon: Bell, label: "Notifications" },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <img src={ccLogo} alt="CareConnect Logo" className="h-10 w-10 mr-3" />
          <div>
            <h1 className="text-xl font-bold text-[#32618F]">CareConnect</h1>
            <p className="text-xs text-[#88D6A6]">Doctor Portal</p>
          </div>
        </div>
      </div>

      {/* Doctor Profile */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4EB1B6] to-[#88D6A6] flex items-center justify-center mr-3">
            <span className="text-white text-lg font-medium">
              {user?.name?.charAt(0) || "D"}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Dr. {user?.name?.split(' ')[1] || "Doctor"}</h3>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/doctor"}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-[#32618F] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <LogoutButton />
    </div>
  );
};

export default DoctorSidebar;