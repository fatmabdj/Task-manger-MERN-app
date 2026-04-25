import express from "express";
import Note from "../models/Note.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET notes
router.get("/", protect, async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notes);
});

// CREATE note
router.post("/", protect, async (req, res) => {
  const note = await Note.create({
    user: req.user._id,
    text: req.body.text,
    style: req.body.style,
  });

  res.json(note);
});

// DELETE note
router.delete("/:id", protect, async (req, res) => {
  await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  res.json({ message: "Deleted" });
});

export default router;