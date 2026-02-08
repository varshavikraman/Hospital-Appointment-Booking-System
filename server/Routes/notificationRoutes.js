import { Router } from "express";
import { authenticate } from "../Middleware/auth.js";
import allowRoles from "../Middleware/roleCheck.js";
import { myNotifications,markAsRead } from "../Controllers/notificationController.js";

const notificationRouter = Router();

notificationRouter.get("/my", authenticate, allowRoles("patient", "doctor"), myNotifications);
notificationRouter.patch("/read/:id", authenticate, allowRoles("patient", "doctor"), markAsRead);

export default notificationRouter;  