import { Router } from "express";
import { authenticate } from "../Middleware/auth.js";
import allowRoles from "../Middleware/roleCheck.js";
import { bookAppointment,myAppointments,cancelAppointment } from "../Controllers/appointmentController.js";

const appointmentRouter = Router();

appointmentRouter.post("/book", authenticate, allowRoles("patient"), bookAppointment);
appointmentRouter.get("/my", authenticate, allowRoles("patient"), myAppointments);
appointmentRouter.patch("/cancel/:id", authenticate, allowRoles("patient", "admin"), cancelAppointment);

export default appointmentRouter;