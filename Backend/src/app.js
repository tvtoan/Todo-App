import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./config/db.js";
import authRouter from "./routes/auth.js";
import taskRouter from "./routes/task.js";

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

// Start server
const startServer = async () => {
  await connectDb(process.env.DB_URI);
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer();

export default app;
