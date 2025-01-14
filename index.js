import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import userRouter from "./src/route/user.js";
import taskRouter from "./src/route/router.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // React aplikacijos adresas
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);

import Question from "./src/model/Question.js";

app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find(); // Replace with real DB call
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

mongoose
  .connect(process.env.MONGO_CONNECTION, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  });

app.use((req, res) => {
  res.status(404).json({ response: "Your endpoint does not exist" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
