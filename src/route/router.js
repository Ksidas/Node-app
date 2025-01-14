import express from "express";
import auth from "../middleware/auth.js";

import {
  REGISTER_USER,
  LOGIN_USER,
  CREATE_QUESTION,
  GET_ALL_QUESTIONS,
  DELETE_QUESTION,
  GET_ANSWERS,
  CREATE_ANSWER,
  DELETE_ANSWER,
} from "../controller/forum.js";

const router = express.Router();

// User routes
router.post("/register", REGISTER_USER); // Registracija
router.post("/login", LOGIN_USER); // Prisijungimas

// Question routes
router.post("/questions", auth, CREATE_QUESTION); // Sukurti klausimą
router.get("/questions", GET_ALL_QUESTIONS); // Gauti visus klausimus
router.delete("/questions/:id", auth, DELETE_QUESTION); // Ištrinti klausimą

// Answer routes
router.get("/questions/:id/answers", GET_ANSWERS); // Gauti klausimo atsakymus
router.post("/questions/:id/answers", auth, CREATE_ANSWER); // Sukurti atsakymą
router.delete("/answers/:id", auth, DELETE_ANSWER); // Ištrinti atsakymą

export default router;
