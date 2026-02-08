import user from "../Models/user.js";
import appointment from "../Models/appointment.js";
import bcrypt from 'bcrypt';

export const createDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const doctor = await user.create({
            name,
            email,
            password: hashedPassword,
            role: "doctor",
            specialization,
        });

        res.status(201).json({Doctor:doctor,message:"Doctor created successfully" });
    } catch (error) {
        console.error("Error creating doctor:", error);
        res.status(500).json({ message: "Failed to create doctor" });
    }
};

export const getAllAppointments = async (_req, res) => {
    try {
        const Appointments = await appointment.find()
            .populate("doctor", "name specialization")
            .populate("patient", "name");

        res.json({appointments:Appointments,message:"Appointments fetched successfully" });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Failed to fetch appointments" });  
    }
  
};

export const getAdminStats = async (req, res) => {
    try {
        const totalDoctors = await user.countDocuments({ role: 'doctor' });
        const totalPatients = await user.countDocuments({ role: 'patient' });
        const totalAppointments = await appointment.countDocuments();
        const pendingDoctors = await user.countDocuments({ role: 'doctor', status: 'pending' }); // Adjust based on your schema
        
        // Get today's start and end time
        const start = new Date(); start.setHours(0,0,0,0);
        const end = new Date(); end.setHours(23,59,59,999);
        const todayAppointments = await appointment.countDocuments({
            date: { $gte: start, $lte: end }
        });

        const recentDoctors = await user.find({ role: 'doctor' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name specialization status");

        res.json({
            stats: {
                totalDoctors,
                totalPatients,
                totalAppointments,
                pendingDoctors,
                todayAppointments,
                revenue: totalAppointments * 50 // Example calculation
            },
            recentDoctors
        });
    } catch (error) {
        console.log("Error fetching Admin Stats :",error);
        res.status(500).json({ message: "Server Error" });
    }
};
