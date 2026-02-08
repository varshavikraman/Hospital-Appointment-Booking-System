import appointment from "../Models/appointment.js";
import user from "../Models/user.js";
import notification from "../Models/notification.js";
import mongoose from "mongoose";
import { emitNotification } from "../index.js";

export const listDoctors = async (req, res) => {
    try {
        const filter = { role: "doctor" };

        if (req.query.specialization && req.query.specialization !== 'all') {
            filter.specialization = {
                $regex: req.query.specialization,
                $options: "i",
            };
        }

        const doctors = await user
            .find(filter)
            .sort({ name: 1 })
            .select("name specialization");

        res.json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: "Failed to fetch doctors" });   
    }
  
};

export const doctorAppointments = async (req, res) => {
    try {
        const appointments = await appointment.find({ doctor: req.user.id })
            .populate("patient", "name");

        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error );
        res.status(500).json({ message: "Failed to fetch appointments" });
    }
  
};

export const updateStatus = async (req, res) => {
    try {
        const Appointment = await appointment.findById(req.params.id);

        if (!Appointment || Appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        Appointment.status = req.body.status;
        await Appointment.save();

        const newNotif = await notification.create({
            user: Appointment.patient,
            message: `Your appointment status has been updated to: ${Appointment.status}`,
        });

        emitNotification(Appointment.patient, newNotif);

        res.json({appointment:Appointment, message:"Status updated" });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: "Failed to update status" });   
    }
  
};

export const getDoctorDashboard = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const today = new Date();
        today.setHours(0,0,0,0);

        // Fetch counts in parallel for better performance
        const [todayCount, totalPatients, statusCounts, upcoming] = await Promise.all([
            appointment.countDocuments({ doctor: doctorId, date: { $gte: today } }),
            appointment.distinct("patient", { doctor: doctorId }).then(p => p.length),
            appointment.aggregate([
                { $match: { doctor: new mongoose.Types.ObjectId(doctorId) } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            appointment.find({ doctor: doctorId, status: { $in: ["pending", "accepted"] } })
                .limit(5)
                .sort({ date: 1 })
                .populate("patient", "name")
        ]);

        // Format status counts for easy frontend use
        const stats = {
            todayCount,
            totalPatients,
            pendingCount: statusCounts.find(s => s._id === "pending")?.count || 0,
            confirmedCount: statusCounts.find(s => s._id === "accepted")?.count || 0,
            upcoming
        };

        res.json(stats);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
};