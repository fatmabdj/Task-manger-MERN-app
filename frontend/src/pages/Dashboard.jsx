import axios from "axios";
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
import { useEffect, useState, useCallback } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const mockStats = {
  totalTasks: 24,
  completedTasks: 18,
  pendingTasks: 6,
  productivity: 75,
  totalTimeSpent: 245,
  topics: [
    { _id: "Work", count: 10, completed: 8 },
    { _id: "Personal", count: 8, completed: 6 },
    { _id: "Study", count: 6, completed: 4 },
  ],
};

const trendData = [
  { day: "Mon", value: 75 },
  { day: "Tue", value: 82 },
  { day: "Wed", value: 68 },
  { day: "Thu", value: 91 },
  { day: "Fri", value: 85 },
  { day: "Sat", value: 72 },
  { day: "Sun", value: 88 },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await axios.get("http://localhost:5000/api/stats");
      setStats(res.data);
    } catch {
      if (!stats) setStats(mockStats);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastUpdated(new Date());
    }
  }, []);

  // initial fetch + auto-refresh every 30s
  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => fetchStats(), 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Opening your notebook...</p>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const updatedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="notebook-dashboard">
      {/* Cover */}
      <div className="notebook-cover">
        <div className="ribbon">This Week</div>
        <h1>📓 TaskFlow</h1>
        <p>{today}</p>

        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          style={{
            position: "absolute",
            bottom: "20px",
            right: "24px",
            background: "rgba(240,235,224,0.15)",
            border: "1.5px solid rgba(240,235,224,0.3)",
            color: "#f0ebe0",
            borderRadius: "8px",
            padding: "8px 16px",
            fontFamily: "Caveat",
            fontSize: "16px",
            cursor: refreshing ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s",
          }}
        >
          <span
            style={{
              display: "inline-block",
              animation: refreshing ? "spin 0.8s linear infinite" : "none",
            }}
          >
            ↻
          </span>
          {refreshing ? "Updating..." : `Updated ${updatedTime}`}
        </button>
      </div>

      <div className="notebook-pages">
        {/* Stats Page */}
        <div className="notebook-page">
          <h2 className="page-title">Quick Overview</h2>
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-number">{stats.totalTasks}</div>
              <div className="stat-label">Total notes</div>
            </div>
            <div className="stat-card success">
              <div className="stat-number">{stats.completedTasks}</div>
              <div className="stat-label">Completed ✓</div>
            </div>
            <div className="stat-card warning">
              <div className="stat-number">{stats.pendingTasks}</div>
              <div className="stat-label">Pending ○</div>
            </div>
            <div className="stat-card time">
              <div className="stat-number">
                {Math.round(stats.totalTimeSpent / 60)}h
              </div>
              <div className="stat-label">Time logged</div>
            </div>
          </div>
        </div>

        {/* Chart Page */}
        <div className="notebook-page">
          <h2 className="page-title">Productivity This Week</h2>

          <div className="chart-section">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="paperGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2e7d52" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2e7d52" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#c4b99a"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14, fill: "#6b5f4a", fontFamily: "Caveat" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b5f4a", fontFamily: "DM Mono" }}
                  tickCount={5}
                />
                <Tooltip
                  contentStyle={{
                    background: "#faf7f0",
                    border: "1.5px solid #c4b99a",
                    borderRadius: "8px",
                    fontFamily: "Caveat",
                    fontSize: "16px",
                    color: "#2c2416",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2e7d52"
                  strokeWidth={2.5}
                  fill="url(#paperGrad)"
                  dot={{ fill: "#2e7d52", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: "#2e7d52" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="productivity-score">
            <div
              className="score-circle"
              style={{
                background: `conic-gradient(#2e7d52 0deg ${
                  stats.productivity * 3.6
                }deg, #e8e2d5 ${stats.productivity * 3.6}deg 360deg)`,
              }}
            >
              <span
                style={{
                  background: "#faf7f0",
                  borderRadius: "50%",
                  width: "90px",
                  height: "90px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {stats.productivity}%
              </span>
            </div>
            <p>Weekly score — auto updates every 30s</p>
          </div>
        </div>

        {/* Topics Page */}
        {stats.topics && stats.topics.length > 0 && (
          <div className="notebook-page">
            <h2 className="page-title">By Topic</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                position: "relative",
                zIndex: 1,
              }}
            >
              {stats.topics.map((t) => {
                const pct = t.count > 0
                  ? Math.round((t.completed / t.count) * 100)
                  : 0;
                return (
                  <div key={t._id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{ fontFamily: "Caveat", fontSize: "17px", color: "#2c2416" }}
                      >
                        {t._id}
                      </span>
                      <span
                        style={{ fontFamily: "DM Mono", fontSize: "13px", color: "#6b5f4a" }}
                      >
                        {t.completed}/{t.count} — {pct}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: "8px",
                        background: "#e8e2d5",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: "#2e7d52",
                          borderRadius: "4px",
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}