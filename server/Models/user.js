import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  specialization: {
    type: String,
    required: function() { return this.role === 'doctor'; }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const user = model("User", userSchema);

export default user
