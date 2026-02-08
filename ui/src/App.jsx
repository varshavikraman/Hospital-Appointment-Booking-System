import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from "react-hot-toast";

// Common Pages
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Notification from './pages/Notifications';

// Patient Pages
import PatientLayout from './layouts/PatientLayout'
import PatientDashboard from './pages/patient/Dashboard'
import PatientDoctors from './pages/patient/Doctors'
import PatientAppointments from './pages/patient/Appointments'

// Admin Pages
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AllDoctors from './pages/admin/AllDoctors'
import AllAppointments from './pages/admin/AllAppointments'
import RegisterDoctor from './pages/admin/RegisterDoctor'

// Doctor Pages
import DoctorLayout from './layouts/DoctorLayout'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'

const router = createBrowserRouter([
  // Public routes
  { path: "/", element: <Navigate to="/login" /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  
  // Patient Routes
  {
    path: "/patient",
    element: <ProtectedRoute allowRoles={["patient"]}><PatientLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <PatientDashboard /> },
      { path: "doctors", element: <PatientDoctors /> },
      { path: "appointments", element: <PatientAppointments /> },
      { path: "notifications", element: <Notification /> },
    ],
  },

  // Admin Routes
  {
    path: "/admin",
    element: <ProtectedRoute allowRoles={["admin"]}><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "doctors", element: <AllDoctors /> },
      { path: "appointments", element: <AllAppointments /> },
      { path: "register-doctor", element: <RegisterDoctor /> },
    ],
  },

  // Doctor Routes
  {
    path: "/doctor",
    element: <ProtectedRoute allowRoles={["doctor"]}><DoctorLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <DoctorDashboard /> },
      { path: "appointments", element: <DoctorAppointments /> },
      { path: "notifications", element: <Notification /> },
    ],
  },

  // Catch-all
  { path: "*", element: <Navigate to="/login" /> },
])

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
        <RouterProvider router={router} />
    </>
  )
}

export default App