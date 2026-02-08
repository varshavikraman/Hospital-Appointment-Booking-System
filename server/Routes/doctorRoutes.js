import { Router } from "express";
import { authenticate } from "../Middleware/auth.js";
import allowRoles from "../Middleware/roleCheck.js";
import { listDoctors, doctorAppointments, updateStatus, getDoctorDashboard } from "../Controllers/doctorController.js";

const doctorRouter = Router();

doctorRouter.get("/list", listDoctors);
doctorRouter.get("/appointments", authenticate, allowRoles("doctor"), doctorAppointments);
doctorRouter.patch("/appointments/:id", authenticate, allowRoles("doctor"), updateStatus);
doctorRouter.get("/dashboard", authenticate, allowRoles("doctor"), getDoctorDashboard);

export default doctorRouter;
