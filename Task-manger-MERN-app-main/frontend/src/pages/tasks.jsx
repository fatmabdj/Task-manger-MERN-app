import axios from "axios";
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
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
    const matchesFilter = filter === "all" || 
      (filter === "completed" && task.completed) || 
      (filter === "pending" && !task.completed);
    
    const matchesSearch = task.title?.toLowerCase().includes(search.toLowerCase()) ||
      task.topic?.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading sticky notes...</p>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div>
          <h1>📌 Sticky Notes Wall</h1>
          <p className="subtitle">{filteredTasks.length} notes</p>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search sticky notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="filter-tabs">
        {["all", "pending", "completed"].map(tab => (
          <button
            key={tab}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <TaskForm refresh={fetchTasks} />

      <div className="tasks-grid sticky-wall">
        {filteredTasks.length === 0 ? (
          <div className="empty-wall">
            <div className="empty-sticky">📌</div>
            <h3>No sticky notes yet!</h3>
            <p>Add your first task above 👆</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard key={task._id} task={task} refresh={fetchTasks} />
          ))
        )}
      </div>
    </div>
  );
}