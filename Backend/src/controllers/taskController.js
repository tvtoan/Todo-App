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
  body("name").notEmpty(),
  body("dueDate").isISO8601().toDate(),
  body("status").isIn(["PENDING", "COMPLETED"]).optional(),
  body("priority").isIn(["HIGH", "MEDIUM", "LOW"]).optional(),
  body("subject").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, dueDate, status, priority, subject } = req.body;
    try {
      const task = await Task.create({
        name,
        description,
        dueDate,
        status: status || "PENDING",
        priority: priority || "MEDIUM",
        subject,
        userId: req.user.id,
      });
      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

export const updateTask = async (req, res) => {
  const { name, description, dueDate, status, priority, subject } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, description, dueDate, status, priority, subject },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
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
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
