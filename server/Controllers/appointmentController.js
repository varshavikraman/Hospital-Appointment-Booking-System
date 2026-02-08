import appointment from "../Models/appointment.js";
import notification from "../Models/notification.js";
import { emitNotification } from "../index.js";

export const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, timeSlot } = req.body;
        const patientId = req.user.id;

        // 1. Validation: Ensure all fields exist
        if (!doctorId || !date || !timeSlot) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // 2. Check for existing appointment with same doctor, date, and time slot that is not cancelled
        const exists = await appointment.findOne({
            doctor: doctorId, 
            appointmentDate:date,
            timeSlot,
            status: { $ne: "cancelled" },
        });

        if (exists) {
            return res.status(400).json({ message: "This time slot is already taken" });
        }

        const newAppointment = await appointment.create({
            doctor: doctorId,
            patient: patientId,
            appointmentDate:date,
            timeSlot,
            status: 'pending' // Default status
        });

        const newNotif = await notification.create({
            user: doctorId,
            message: `New appointment request from ${req.user.name} for ${date} at ${timeSlot}`,
        });

        emitNotification(doctorId, newNotif);

        res.status(201).json({ 
            message: "Appointment booked successfully", 
            data: newAppointment 
        });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "Failed to book appointment" });
    }
  
};

export const myAppointments = async (req, res) => {
    try {
        const appointments = await appointment.find({ patient: req.user.id })
            .populate("doctor", "name specialization");

        res.json({ Appointments:appointments, message:"Appointments fetched successfully" });

    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Failed to fetch appointments" });
    }
  
};

export const cancelAppointment = async (req, res) => {
    try {
        const Appointment = await appointment.findById(req.params.id);

        if (!Appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Check Permissions:
        // 1. If user is a patient, they MUST be the owner
        // 2. If user is an admin, they can skip the ownership check
        const isOwner = Appointment.patient.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: "You do not have permission to cancel this" });
        }

        // Status check (Ensure it's not already completed)
        if (Appointment.status === "Cancelled" || Appointment.status === "Completed") {
            return res.status(400).json({ message: `Already ${Appointment.status}` });
        }

        appointment.status = 'cancelled';

        const newNotif = await notification.create({
            user: Appointment.doctor,
            message: `Appointment request from ${req.user.name} for ${date} at ${timeSlot} is cancelled by ${isAdmin ? 'admin' : 'patient'}`,
        });

        emitNotification(Appointment.doctor, newNotif);

        await Appointment.save();

        res.json({ message: "Appointment Cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        res.status(500).json({ message: "Failed to cancel appointment" });  
    }
};
