import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  Settings,
  LogOut,
  Home,
  Shield,
  BarChart3,
  FileText,
  Bell,
  Activity
} from "lucide-react";
import LogoutButton from "./LogoutButton"; 
import ccLogo from "../assets/careconnect-logo.jpeg";

const AdminSidebar = ({ onClose }) => {
  const { user } = useAuth();

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/doctors", icon: Users, label: "All Doctors" },
    { path: "/admin/register-doctor", icon: UserPlus, label: "Register Doctor" },
    { path: "/admin/appointments", icon: Calendar, label: "Appointments" },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <img src={ccLogo} alt="CareConnect Logo" className="h-10 w-10 mr-3" />
          <div>
            <h1 className="text-xl font-bold text-[#32618F]">CareConnect</h1>
            <p className="text-xs text-red-600">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mr-3">
            <span className="text-white text-lg font-medium">
              {user?.name?.charAt(0) || "A"}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{user?.name || "Admin"}</h3>
            <p className="text-sm text-gray-600">System Administrator</p>
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Admin
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
                end={item.path === "/admin"}
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

export default AdminSidebar;