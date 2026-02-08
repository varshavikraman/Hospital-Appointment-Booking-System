import express, {json} from 'express';
import { createServer } from 'http'; 
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import seedAdmin from './Seed/adminSeed.js';

import authRouter from './Routes/authRoutes.js';
import adminRouter from './Routes/adminRoutes.js';
import doctorRouter from './Routes/doctorRoutes.js';
import appointmentRouter from './Routes/appointmentRoutes.js';
import notificationRouter from './Routes/notificationRoutes.js';    

dotenv.config();

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(json())

// Routes
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/doctors", doctorRouter);
app.use("/appointments", appointmentRouter);
app.use("/notifications", notificationRouter);

// User mapping logic
const userSocketMap = {}; 

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} connected at socket ${socket.id}`);
  }

  socket.on("disconnect", () => {
    // Find and delete the specific user from the map
    Object.keys(userSocketMap).forEach(key => {
        if (userSocketMap[key] === socket.id) {
            delete userSocketMap[key];
        }
    });
  });
});

// 5. Export emit function
export const emitNotification = (userId, data) => {
  const socketId = userSocketMap[userId];
  if (socketId) {
    io.to(socketId).emit("new_notification", data);
  }
};

const startServer = async () => {
  try {
    // Connect DB FIRST
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("MongoDB is connected successfully");
    }).catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });
    
    // THEN seed admin
    await seedAdmin();

    // THEN start server
    httpServer.listen(process.env.PORT,()=>{
        console.log(`Server running on port ${process.env.PORT}`);    
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();

