import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8901",
  withCredentials: true,
});

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const getUser = () => 
    api.get("/auth/user");

export const logoutUser = () => 
  api.post("/auth/logout");

export const bookAppointment = (data) =>
    api.post("/appointments/book", data);

export const getMyAppointments = () =>
    api.get("/appointments/my");

export const cancelAppointment = (id) =>
    api.patch(`/appointments/cancel/${id}`);

export const createDoctor = (data) =>
    api.post("/admin/doctors", data);

export const getAllAppointments = () =>
    api.get("/admin/appointments");

export const getAdminStats = () =>
    api.get("/admin/admin-data");   

export const listDoctors = (specialization) => {
    const params = specialization ? { specialization } : {};
    return api.get("/doctors/list", { params });
}

export const getDoctorAppointments = () =>
    api.get("/doctors/appointments");

export const updateAppointmentStatus = (id, status) =>
    api.patch(`/doctors/appointments/${id}`, { status });
  
export const getDoctorDashboard = () =>
    api.get("/doctors/dashboard");    

export const getMyNotifications = () =>
    api.get("/notifications/my");

export const markNotificationAsRead = (id) =>
    api.patch(`/notifications/read/${id}`);  
