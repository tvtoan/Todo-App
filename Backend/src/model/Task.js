import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["PENDING", "COMPLETED"], default: "PENDING" },
  priority: {
    type: String,
    enum: ["HIGH", "MEDIUM", "LOW"],
    default: "MEDIUM",
  },
  subject: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Task", taskSchema);
