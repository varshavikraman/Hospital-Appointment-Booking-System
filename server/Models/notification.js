import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    message: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now}
  },
  
);

const notification= model("Notification", notificationSchema);

 export default notification