import { Router } from "express";
import { authenticate } from "../Middleware/auth.js";
import { register, login, getUser,logout } from "../Controllers/authController.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/user", authenticate, getUser);
authRouter.post("/logout", authenticate, logout);

export default authRouter;