// app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./config/db.js";
import authRouter from "./routes/auth.js";
import taskRouter from "./routes/task.js";

dotenv.config();

const app = express();

app.use(cors()); // Temporarily allow all origins
// app.use(cors({
//   origin: ["http://localhost:3000", "http://10.0.2.2:3002", "http://192.168.x.x:3002"],
//   credentials: true,
// }));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

const startServer = async () => {
  await connectDb(process.env.DB_URI);
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer();

export default app;
