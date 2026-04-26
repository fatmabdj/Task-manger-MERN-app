import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

const COLORS = {
  paper: "#faf7f0",
  folder: "#76845B",      
  deepBrown: "#603314",   
  border: "#414735",
  textMain: "#2c2416",
  textSub: "#6b5f4a",
  accent: "#c4b99a",
};

export default function Dashboard() {
  const [stats, setStats] = useState({ totalTasks: 0, pendingTasks: 0, completedTasks: 0, productivity: 0, topics: [] });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const calculateEverything = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      const tasks = res.data;

      // 1. Calculate Card Values
      const total = tasks.length;
      const completed = tasks.filter(t => t.completed).length;
      const pending = total - completed;
      const prod = total > 0 ? Math.round((completed / total) * 100) : 0;

      // 2. Group by Topics
      const topicMap = {};
      tasks.forEach(t => {
        const topic = t.topic || "General";
        if (!topicMap[topic]) topicMap[topic] = { _id: topic, count: 0, completed: 0 };
        topicMap[topic].count++;
        if (t.completed) topicMap[topic].completed++;
      });

      setStats({
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: pending,
        productivity: prod,
        topics: Object.values(topicMap)
      });

      // 3. Calculate 7-Day Trend
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const last7 = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const count = tasks.filter(t => t.completed && new Date(t.updatedAt || t.createdAt).toDateString() === d.toDateString()).length;
        last7.push({ day: days[d.getDay()], value: count });
      }
      setChartData(last7);

    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    calculateEverything();
  }, [calculateEverything]);

  if (loading) return <div style={{padding: '50px', textAlign: 'center', fontFamily: 'Playfair Display'}}>Loading...</div>;

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", backgroundColor: '#fdfbf7' }}>
      <header style={{ marginBottom: "40px", borderBottom: `3px solid ${COLORS.deepBrown}`, paddingBottom: "15px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", color: COLORS.deepBrown, margin: 0 }}>
          Welcome, {user?.username || "Fatma Zahra"}
        </h1>
      </header>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "50px" }}>
        {[
          { label: "Total", value: stats.totalTasks, bg: COLORS.paper, color: COLORS.deepBrown },
          { label: "Pending", value: stats.pendingTasks, bg: COLORS.folder, color: "#fff" },
          { label: "Done", value: stats.completedTasks, bg: COLORS.paper, color: COLORS.deepBrown },
          { label: "Score", value: `${stats.productivity}%`, bg: COLORS.deepBrown, color: "#fff" },
        ].map((item, i) => (
          <div key={i} style={{ background: item.bg, border: `2px solid ${COLORS.deepBrown}`, padding: "25px", textAlign: "center", boxShadow: `4px 4px 0px ${COLORS.accent}`, borderRadius: "4px" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.8rem", color: (i===1||i===3) ? "#d1d9c0" : COLORS.textSub }}>{item.label}</span>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: "bold", color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "30px" }}>
        {/* Chart */}
        <div style={{ background: COLORS.paper, border: `2px solid ${COLORS.deepBrown}`, padding: "20px", borderRadius: "12px" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: COLORS.deepBrown }}>Activity (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.accent} />
              <XAxis dataKey="day" tick={{fontFamily: 'Playfair Display', fill: COLORS.deepBrown}} />
              <YAxis hide />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke={COLORS.deepBrown} fill={COLORS.accent} fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Topics */}
        <div style={{ background: COLORS.folder, border: `2px solid ${COLORS.deepBrown}`, padding: "25px", borderRadius: "12px", color: "#fff" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: "20px" }}>By Topic</h3>
          {stats.topics.map(t => (
            <div key={t._id} style={{ marginBottom: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Playfair Display', serif", fontSize: "0.9rem" }}>
                <span>{t._id}</span>
                <span>{Math.round((t.completed/t.count)*100)}%</span>
              </div>
              <div style={{ height: "6px", background: COLORS.deepBrown, borderRadius: "10px", marginTop: "5px" }}>
                <div style={{ height: "100%", width: `${(t.completed/t.count)*100}%`, background: "#fff", borderRadius: "10px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}