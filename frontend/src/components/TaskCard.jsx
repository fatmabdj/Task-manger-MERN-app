import axios from "axios";
import { useState } from "react";
 

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

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
  const [localTask, setLocalTask] = useState(task);
  const colors = TOPIC_COLORS[task.topic] || TOPIC_COLORS.General;

  const toggleComplete = async () => {
    await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
      ...task,
      completed: !task.completed,
    });
    refresh();
  };

  // ✅ دالة لتحديث حالة checkbox داخل الـ checklist
  const toggleChecklistItem = async (index) => {
    const newChecklist = [...(task.checklist || [])];
    newChecklist[index].checked = !newChecklist[index].checked;
    
    await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
      ...task,
      checklist: newChecklist,
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
        <div className="sticky-top" style={{ background: colors.border }} />

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
              <button onClick={toggleComplete} className="action-btn toggle-btn" title={task.completed ? "Mark pending" : "Mark done"}>
                {task.completed ? "↩" : "✓"}
              </button>
              <button onClick={() => setShowDeleteModal(true)} className="action-btn delete-btn" title="Delete">
                ✕
              </button>
            </div>
          </div>

          {task.description && <p className="description">{task.description}</p>}

          {/* ✅ عرض الـ Checklist مع checkboxes */}
          {task.checklist && task.checklist.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              {task.checklist.map((item, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px", 
                    marginTop: "5px",
                    cursor: "pointer"
                  }}
                  onClick={() => toggleChecklistItem(idx)}
                >
                  <span style={{ fontSize: "18px" }}>
                    {item.checked ? "✅" : "☐"}
                  </span>
                  <span style={{ 
                    textDecoration: item.checked ? "line-through" : "none",
                    opacity: item.checked ? 0.6 : 1,
                    fontSize: "13px",
                    fontFamily: "Inter"
                  }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="task-footer">
            <span className="topic-badge" style={{ background: colors.border }}>
              {task.topic}
            </span>
            {task.timeSpent > 0 && <span className="time-badge">⏱ {task.timeSpent}m</span>}
            <span className={`status ${task.completed ? "done" : "pending"}`}>
              {task.completed ? "✓ Done" : "• Pending"}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">Delete this note?</div>
            <p>"{task.title}"</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="cancel-btn">
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