
import { useEffect, useState } from "react";

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

  useEffect(() => {
    setNotes(JSON.parse(localStorage.getItem("notes")) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!note.trim()) return;
    setNotes([note, ...notes]);
    setNote("");
  };

  const deleteNote = (i) => {
    setNotes(notes.filter((_, index) => index !== i));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) addNote();
  };

  return (
    <div className="notes-page">
      <div className="notes-header">
        <h1>📝 Quick Notes</h1>
        <div className="notes-input">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write anything... (Ctrl+Enter to add)"
            rows="3"
          />
          <button onClick={addNote} className="add-note-btn">
            📌 Pin it
          </button>
        </div>
      </div>

      <div className="notes-grid">
        {notes.length === 0 ? (
          <div className="empty-wall">
            <div className="empty-sticky">📌</div>
            <h3>No notes yet</h3>
            <p>Write your first note above and pin it!</p>
          </div>
        ) : (
          notes.map((n, i) => {
            const palette = NOTE_PALETTES[i % NOTE_PALETTES.length];
            return (
              <div
                key={i}
                className="sticky-note"
                style={{
                  background: palette.bg,
                  borderColor: palette.border,
                  boxShadow: `3px 4px 14px ${palette.border}22`,
                }}
              >
                <div
                  className="sticky-top"
                  style={{ background: palette.border }}
                />
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
                  {n}
                </p>
                <button
                  onClick={() => deleteNote(i)}
                  className="note-delete-btn"
                  title="Delete note"
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}