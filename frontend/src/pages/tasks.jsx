import axios from "axios";
import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5000/api/tasks";

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API);
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="tasks-page" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Top Section: The Editor Panel */}
      <div className="editor-container" style={{ marginBottom: '80px' }}>
        <h1 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '25px',
          color: '#2c2416' 
        }}>
          ❤︎ Sticky Notes Wall
        </h1>
        <TaskForm refresh={fetchTasks} />
      </div>

      {/* Bottom Section: The Notebook with Tabs */}
      <div className="notebook-display-unit" style={{ position: 'relative' }}>
        
        {/* The Tabs (Dividers) */}
        <div className="tabs-row" style={{ 
          display: 'flex', 
          gap: '8px', 
          paddingLeft: '30px',
          marginBottom: '-2px', 
          position: 'relative',
          zIndex: 2
        }}>
          {["all", "pending", "completed"].map((tab) => {
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  padding: '12px 30px',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.1rem',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  border: '2px solid #414735',
                  borderBottom: isActive ? '2px solid #76845B' : '2px solid #414735',
                  borderRadius: '12px 12px 0 0',
                  background: isActive ? '#76845B' : '#5c6646',
                  color: isActive ? '#ffffff' : '#d1d9c0',
                  transition: 'all 0.3s ease',
                  zIndex: isActive ? 3 : 1,
                  boxShadow: isActive ? '0 -4px 10px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>

        {/* The Task Folder Body */}
        <div className="tasks-folder" style={{ 
          border: '2px solid #414735', 
          borderRadius: '20px', 
          borderTopLeftRadius: '0', 
          background: '#76845B', // Darker green folder background
          padding: '40px',
          minHeight: '450px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
          zIndex: 1,
          position: 'relative'
        }}>
          {loading ? (
            <p style={{ 
              textAlign: 'center', 
              fontFamily: "'Playfair Display', serif", 
              fontSize: '24px', 
              color: '#ffffff' 
            }}>
              Loading your collection...
            </p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '25px' 
            }}>
              {filteredTasks.length === 0 ? (
                <p style={{ 
                  gridColumn: '1/-1', 
                  textAlign: 'center', 
                  fontFamily: "'Playfair Display', serif", 
                  fontSize: '20px', 
                  color: '#d1d9c0',
                  fontStyle: 'italic'
                }}>
                  No {filter} notes found in this section.
                </p>
              ) : (
                filteredTasks.map(task => (
                  <TaskCard key={task._id} task={task} refresh={fetchTasks} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}