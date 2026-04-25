import { useEffect, useState } from "react";
import axios from "axios";

const NOTE_PALETTES = [
  { bg: "#fef9ec", border: "#c17f24" },
  { bg: "#eef7f1", border: "#2e7d52" },
  { bg: "#eef3fb", border: "#2666a0" },
  { bg: "#fdf0ef", border: "#c0392b" },
  { bg: "#f5f0fb", border: "#6b4c9a" },
  { bg: "#f0f7f5", border: "#1a7a6e" },
];

export default function Notes() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5000/api/notes";

  // =========================
  // GET NOTES
  // =========================
  const fetchNotes = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // =========================
  // ADD NOTE
  // =========================
  const addNote = async () => {
    if (!note.trim()) return;

    const palette =
      NOTE_PALETTES[Math.floor(Math.random() * NOTE_PALETTES.length)];

    try {
      const res = await axios.post(
        API,
        {
          text: note,
          style: {
            bg: palette.bg,
            border: palette.border,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNotes((prev) => [res.data, ...prev]);
      setNote("");
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  // =========================
  // DELETE NOTE
  // =========================
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  // =========================
  // KEYBOARD SHORTCUT
  // =========================
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) addNote();
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading notes...</p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="notes-page">
      {/* HEADER */}
      <div className="notes-header">
        <h1>📝 Quick Notes</h1>

        <div className="notes-input">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write anything... (Ctrl + Enter)"
            rows="3"
          />

          <button onClick={addNote} className="add-note-btn">
            📌 Pin it
          </button>
        </div>
      </div>

      {/* NOTES GRID */}
      <div className="notes-grid">
        {notes.length === 0 ? (
          <div className="empty-wall">
            <div className="empty-sticky">📌</div>
            <h3>No notes yet</h3>
            <p>Create your first note ✨</p>
          </div>
        ) : (
          notes.map((n) => (
            <div
              key={n._id}
              className="sticky-note"
              style={{
                background: n.style?.bg,
                borderColor: n.style?.border,
                boxShadow: `3px 4px 14px ${n.style?.border}22`,
              }}
            >
              {/* TOP BAR */}
              <div
                className="sticky-top"
                style={{ background: n.style?.border }}
              />

              {/* TEXT */}
              <p
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "17px",
                  color: "#2c2416",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  paddingTop: "6px",
                }}
              >
                {n.text}
              </p>

              {/* DELETE */}
              <button
                onClick={() => deleteNote(n._id)}
                className="note-delete-btn"
                title="Delete note"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}