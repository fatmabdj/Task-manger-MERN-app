import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get all tasks for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a task
router.post("/", protect, async (req, res) => {
  try {
    const task = new Task({ ...req.body, user: req.user._id });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a task
router.put("/:id", protect, async (req, res) => {
  try {
    const updates = req.body;
    if (updates.completed) updates.completedAt = new Date();
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a task
router.delete("/:id", protect, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get statistics
router.get("/stats", protect, async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const stats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $facet: {
          mainStats: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                completed: { $sum: { $cond: ["$completed", 1, 0] } },
                totalTime: { $sum: "$timeSpent" },
              },
            },
          ],
          topics: [
            {
              $group: {
                _id: "$topic",
                count: { $sum: 1 },
                completed: { $sum: { $cond: ["$completed", 1, 0] } },
              },
            },
            { $sort: { count: -1 } },
          ],
          dailyTrend: [
            { $match: { createdAt: { $gte: weekAgo } } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                total: { $sum: 1 },
                done: { $sum: { $cond: ["$completed", 1, 0] } },
              },
            },
            { $sort: { "_id": 1 } },
          ],
        },
      },
    ]);

    const data = stats[0].mainStats[0] || { total: 0, completed: 0, totalTime: 0 };
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const trendData = stats[0].dailyTrend.map((d) => ({
      day: days[new Date(d._id).getDay()],
      value: Math.round((d.done / d.total) * 100) || 0,
    }));

    res.json({
      totalTasks: data.total,
      completedTasks: data.completed,
      pendingTasks: data.total - data.completed,
      productivity: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      totalTimeSpent: data.totalTime,
      topics: stats[0].topics,
      trendData: trendData.length > 0 ? trendData : [{ day: days[new Date().getDay()], value: 0 }],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;