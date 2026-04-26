import { useState } from "react";
import axios from "axios";

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const TOPICS = ["Work", "Personal", "Study", "Health", "Shopping", "General"];

export default function TaskForm({ refresh }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    topic: "General",
    timeSpent: 0,
    checklist: []
  });
  
  const [checklistItem, setChecklistItem] = useState("");

  const addChecklistItem = () => {
    if (checklistItem.trim()) {
      setForm({
        ...form,
        checklist: [...form.checklist, { text: checklistItem, checked: false }]
      });
      setChecklistItem("");
    }
  };

  const removeChecklistItem = (index) => {
    const newChecklist = form.checklist.filter((_, i) => i !== index);
    setForm({ ...form, checklist: newChecklist });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/tasks", form);
      refresh();
      setForm({ title: "", description: "", topic: "General", timeSpent: 0, checklist: [] });
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  // ✅ دالة لتعديل ارتفاع textarea تلقائياً
  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className="paper-form">
      <form onSubmit={submit}>
        <div className="paper-header">❤︎ New Sticky Note</div>

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
          onChange={(e) => {
            setForm({ ...form, description: e.target.value });
            autoResize(e);  // ✅ يصغر ويكبر حسب النص
          }}
          rows={1}
          style={{
            overflow: "hidden",
            resize: "vertical",    // ✅ يسمح للمستخدم يسحب الحجم عمودياً
            minHeight: "60px"
          }}
        />

        {/* قسم إضافة Checklist */}
        <div style={{ paddingLeft: "60px", marginBottom: "20px" }}>
          <label style={{ fontFamily: "Caveat", fontSize: "18px", color: "#2c2416" }}>
            ☕︎ Task Checklist
          </label>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <input
              type="text"
              placeholder="Add a subtask..."
              value={checklistItem}
              onChange={(e) => setChecklistItem(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1.5px solid #c4b99a",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.6)"
              }}
            />
            <button
              type="button"
              onClick={addChecklistItem}
              style={{
                padding: "8px 16px",
                background: "#76845B",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Add
            </button>
          </div>
          
          {/* عرض الـ Checklist items */}
          {form.checklist.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              {form.checklist.map((item, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "5px" }}>
                  <span>☐</span>
                  <span style={{ flex: 1 }}>{item.text}</span>
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(index)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#c0392b",
                      cursor: "pointer",
                      fontSize: "16px"
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="paper-footer">
          <select
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Minutes..."
            value={form.timeSpent || ""}
            onChange={(e) => setForm({ ...form, timeSpent: +e.target.value })}
            min="0"
            style={{ width: "110px" }}
          />

          <button type="submit" className="paper-submit">
            save task
          </button>
        </div>
      </form>
    </div>
  );
}