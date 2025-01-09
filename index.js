import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import userRouter from "./src/route/user.js";
import taskRouter from "./src/route/task.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // React aplikacijos adresas
    methods: ["GET", "POST", "DELETE"],
    credentials: true, // Jei naudosite cookies arba autentifikaciją
  })
);
app.use(express.json());

// Jūsų API routes
app.get("/api/questions", (req, res) => {
  res.json([{ _id: "1", title: "First Question" }]); // Pavyzdiniai duomenys
});

app.use(express.json());

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Connected!"))
  .catch(() => {
    console.log("bad connection");
  });

app.use(userRouter);
app.use(taskRouter);

app.use((req, res) => {
  res.status(404).json({ response: "your endpoint does not exit" });
});

app.listen(process.env.PORT, () => {
  console.log(`App was started on port ${process.env.PORT}`);
});
