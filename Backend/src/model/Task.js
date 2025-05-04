import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Chưa Bắt Đầu", "Đang Thực Hiện", "Hoàn Thành"],
    default: "Chưa Bắt Đầu",
  },
  priority: {
    type: String,
    enum: ["Cao", "Trung Bình", "Thấp"],
    default: "Trung Bình",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Task", taskSchema);
