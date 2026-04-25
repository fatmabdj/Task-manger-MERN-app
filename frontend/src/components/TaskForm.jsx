import axios from "axios";
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
import { useState } from "react";


const TOPICS = ["Work", "Personal", "Study", "Health", "Shopping", "General"];

export default function TaskForm({ refresh }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    topic: "General",
    timeSpent: 0,
  });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await axios.post("http://localhost:5000/api/tasks", form);
    refresh();
    setForm({ title: "", description: "", topic: "General", timeSpent: 0 });
  };

  return (
    <div className="paper-form">
      <form onSubmit={submit}>
        <div className="paper-header">✏️ New Sticky Note</div>

        <input
          className="paper-title"
          placeholder="Title of your note..."
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          className="paper-desc"
          placeholder="Add details here..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows="3"
        />

        <div className="paper-footer">
          <select
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Minutes..."
            value={form.timeSpent || ""}
            onChange={(e) =>
              setForm({ ...form, timeSpent: +e.target.value })
            }
            min="0"
            style={{ width: "110px" }}
          />

          <button type="submit" className="paper-submit">
            📌 Pin Note
          </button>
        </div>
      </form>
    </div>
  );
}