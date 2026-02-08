import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  User,
  LogOut,
  ChevronRight,
  Home,
  FileText,
  Settings,
  Heart,
  Bell
} from "lucide-react";
import LogoutButton from "./LogoutButton"; 
import ccLogo from "../assets/careconnect-logo.jpeg";

const PatientSidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { path: "/patient", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/patient/doctors", icon: Users, label: "Doctors" },
    { path: "/patient/appointments", icon: Calendar, label: "Appointments" },
    { path: "/patient/notifications", icon: Bell, label: "Notifications" },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <img src={ccLogo} alt="CareConnect Logo" className="h-10 w-10 mr-3" />
          <div>
            <h1 className="text-xl font-bold text-[#32618F]">CareConnect</h1>
            <p className="text-xs text-[#4EB1B6]">Patient Portal</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4EB1B6] to-[#88D6A6] flex items-center justify-center mr-3">
            <span className="text-white text-lg font-medium">
              {user?.name?.charAt(0) || "P"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{user?.name || "Patient"}{console.log("user name in sidebar:", user?.name)
            }</h3>
            <p className="text-sm text-gray-600 truncate">{user?.email}{console.log("user email in sidebar:", user?.email)
            }</p>
            <p className="text-sm text-gray-500">
                Patient ID: {(user?.id || user?._id)?.toString().slice(-6).toUpperCase() || "N/A"}
            </p>
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-[#32618F]">
                Patient
              </span>
            </div>
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
                    end={item.path === "/patient"}
                    
                    className={({ isActive }) => `
                        flex items-center px-4 py-3 rounded-lg transition-colors group
                        ${isActive 
                        ? 'bg-gradient-to-r from-[#32618F] to-[#1e4160] text-white shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-100'
                        }
                    `}
                    >
                    {/* 1. Wrap children in a function to access isActive */}
                    {({ isActive }) => (
                        <>
                        <item.icon 
                            className={`h-5 w-5 mr-3 transition-colors ${
                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#32618F]'
                            }`} 
                        />
                        <span className="font-medium flex-1">{item.label}</span>
                        <ChevronRight 
                            className={`h-4 w-4 transition-transform ${
                            isActive ? 'rotate-90 text-white' : 'text-gray-400 group-hover:text-[#32618F]'
                            }`} 
                        />
                        </>
                    )}
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

export default PatientSidebar;