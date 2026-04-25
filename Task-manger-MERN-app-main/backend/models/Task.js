import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  topic: { type: String, default: "General" },
  completed: { type: Boolean, default: false },
  timeSpent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;