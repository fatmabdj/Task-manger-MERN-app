
import axios from "axios";
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
import { useState } from "react";

const TOPIC_COLORS = {
  Work:     { bg: "#fef9ec", border: "#c17f24", shadow: "#c17f24" },
  Personal: { bg: "#eef7f1", border: "#2e7d52", shadow: "#2e7d52" },
  Study:    { bg: "#eef3fb", border: "#2666a0", shadow: "#2666a0" },
  Health:   { bg: "#fdf0ef", border: "#c0392b", shadow: "#c0392b" },
  Shopping: { bg: "#f5f0fb", border: "#6b4c9a", shadow: "#6b4c9a" },
  General:  { bg: "#f7f5f0", border: "#6b5f4a", shadow: "#6b5f4a" },
};

export default function TaskCard({ task, refresh }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const colors = TOPIC_COLORS[task.topic] || TOPIC_COLORS.General;

  const toggleComplete = async () => {
    await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
      ...task,
      completed: !task.completed,
    });
    refresh();
  };

  const deleteTask = async () => {
    await axios.delete(`http://localhost:5000/api/tasks/${task._id}`);
    refresh();
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        className={`sticky-note ${task.completed ? "completed" : ""}`}
        style={{
          background: colors.bg,
          borderColor: colors.border,
          boxShadow: `3px 4px 14px ${colors.shadow}22`,
        }}
      >
        <div
          className="sticky-top"
          style={{ background: colors.border }}
        />

        <div className="task-content">
          <div className="task-header">
            <h3
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                opacity: task.completed ? 0.7 : 1,
              }}
            >
              {task.title}
            </h3>
            <div className="actions-overlay">
              <button
                onClick={toggleComplete}
                className="action-btn toggle-btn"
                title={task.completed ? "Mark pending" : "Mark done"}
              >
                {task.completed ? "↩" : "✓"}
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="action-btn delete-btn"
                title="Delete"
              >
                ✕
              </button>
            </div>
          </div>

          {task.description && (
            <p className="description">{task.description}</p>
          )}

          <div className="task-footer">
            <span
              className="topic-badge"
              style={{ background: colors.border }}
            >
              {task.topic}
            </span>
            {task.timeSpent > 0 && (
              <span className="time-badge">⏱ {task.timeSpent}m</span>
            )}
            <span className={`status ${task.completed ? "done" : "pending"}`}>
              {task.completed ? "✓ Done" : "• Pending"}
            </span>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div
          className="delete-modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">Delete this note?</div>
            <p>"{task.title}"</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="cancel-btn"
              >
                Keep it
              </button>
              <button onClick={deleteTask} className="confirm-delete">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}