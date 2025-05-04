import { body, validationResult } from "express-validator";
import Task from "../model/Task.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const createTask = [
  body("name").notEmpty().withMessage("Tên công việc là bắt buộc"),
  body("dueDate")
    .isISO8601()
    .toDate()
    .withMessage("Hạn hoàn thành phải là định dạng ISO"),
  body("status")
    .isIn(["Chưa Bắt Đầu", "Đang Thực Hiện", "Hoàn Thành"])
    .optional()
    .withMessage("Trạng thái không hợp lệ"),
  body("priority")
    .isIn(["Cao", "Trung Bình", "Thấp"])
    .optional()
    .withMessage("Ưu tiên không hợp lệ"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, dueDate, status, priority } = req.body;
    console.log("Received task data:", {
      name,
      description,
      dueDate,
      status,
      priority,
    });

    try {
      const task = await Task.create({
        name,
        description,
        dueDate,
        status: status || "Chưa Bắt Đầu",
        priority: priority || "Trung Bình",
        userId: req.user.id,
      });
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

export const updateTask = async (req, res) => {
  const { name, description, dueDate, status, priority } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, description, dueDate, status, priority },
      { new: true }
    );
    if (!task) {
      return res.status(400).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!task) {
      return res.status(400).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
