import notification from "../Models/notification.js";

export const myNotifications = async (req, res) => {
    try {
        const notifications = await notification.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Failed to fetch notifications" });  
    }
  
};

export const markAsRead = async (req, res) => {
    try {
        await notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ message: "Marked as read" });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "Failed to mark as read" });
    }
  
};
