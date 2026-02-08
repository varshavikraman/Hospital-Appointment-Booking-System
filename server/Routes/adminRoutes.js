import { Router } from "express";
import { authenticate } from "../Middleware/auth.js";
import allowRoles from "../Middleware/roleCheck.js";
import { createDoctor,getAllAppointments,getAdminStats } from "../Controllers/adminController.js";

const adminRouter = Router();

adminRouter.post("/doctors", authenticate, allowRoles("admin"), createDoctor);
adminRouter.get("/appointments", authenticate, allowRoles("admin"), getAllAppointments);
adminRouter.get("/admin-data", authenticate, allowRoles("admin"), getAdminStats);

export default adminRouter; 