import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const REGISTER_USER = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Patikrinti, ar vartotojas jau egzistuoja
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Užšifruoti slaptažodį
    const hashedPassword = await bcrypt.hash(password, 10);

    // Sukurti naują vartotoją
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to register user", error: error.message });
  }
  // Registracijos logika
};

export const LOGIN_USER = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Rasti vartotoją pagal el. paštą
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Patikrinti slaptažodį
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Sugeneruoti JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to log in", error: error.message });
  }
  // Prisijungimo logika
};

export const CREATE_QUESTION = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id; // Autentifikuoto vartotojo ID iš auth middleware

    // Sukurti naują klausimą
    const question = new Question({
      title,
      content,
      user: userId,
    });

    await question.save();

    res.status(201).json(question);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create question", error: error.message });
  }
  // Sukurti klausimą
};

export const GET_ALL_QUESTIONS = async (req, res) => {
  try {
    // Gauti visus klausimus su vartotojo informacija
    const questions = await Question.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve questions", error: error.message });
  }
  // Gauti visus klausimus
};

export const DELETE_QUESTION = async (req, res) => {
  try {
    const { id } = req.params;

    // Patikrinti, ar klausimas egzistuoja
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Ištrinti klausimą
    await Question.findByIdAndDelete(id);

    // Pasirinktinai ištrinti susijusius atsakymus
    await Answer.deleteMany({ question: id });

    res
      .status(200)
      .json({ message: "Question and related answers deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete question", error: error.message });
  }
};
// Ištrinti klausimą

export const GET_ANSWERS = async (req, res) => {
  try {
    const { id } = req.params;

    // Gauti atsakymus pagal klausimo ID
    const answers = await Answer.find({ question: id }).populate(
      "user",
      "username"
    );

    if (!answers) {
      return res
        .status(404)
        .json({ message: "No answers found for this question" });
    }

    res.status(200).json(answers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve answers", error: error.message });
  }
};
// Gauti klausimo atsakymus

export const CREATE_ANSWER = async (req, res) => {
  try {
    const { id } = req.params; // Klausimo ID
    const { content } = req.body; // Atsakymo turinys
    const userId = req.user.id; // Vartotojo ID iš auth middleware

    // Patikrinti, ar klausimas egzistuoja
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Sukurti atsakymą
    const answer = new Answer({
      content,
      user: userId,
      question: id,
    });

    await answer.save();

    res.status(201).json(answer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create answer", error: error.message });
  }
};

export const DELETE_ANSWER = async (req, res) => {
  try {
    const { id } = req.params; // Atsakymo ID

    // Patikrinti, ar atsakymas egzistuoja
    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Ištrinti atsakymą
    await Answer.findByIdAndDelete(id);

    res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete answer", error: error.message });
  }
};
