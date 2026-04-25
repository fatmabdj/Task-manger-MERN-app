import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ onLogout }) {  // ✅ أضف onLogout هنا
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    if (onLogout) {
      onLogout();  // ✅ نادي الدالة اللي جاية من App.jsx
    }
    
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="logo"> TaskFlow</div>

      <NavLink to="/dashboard" className={({ isActive }) => `link ${isActive ? "active" : ""}`}>
        Dashboard
      </NavLink>

      <NavLink to="/tasks" className={({ isActive }) => `link ${isActive ? "active" : ""}`}>
         Tasks
      </NavLink>

      <NavLink to="/notes" className={({ isActive }) => `link ${isActive ? "active" : ""}`}>
         Notes
      </NavLink>

      <div style={{ marginTop: "auto", paddingTop: "20px" }}>
     <button 
  onClick={handleLogout}
  style={{
    background: "#76845B",  // ✅ غير هذا اللون
    border: "1.5px solid rgba(255,255,255,0.3)",
    color: "white",
    borderRadius: "8px",
    padding: "10px 14px",
    fontFamily: "Caveat, cursive",
    fontSize: "17px",
    width: "100%",
    cursor: "pointer",
    transition: "all 0.2s"
  }}
  onMouseEnter={(e) => {
    e.target.style.background = "#5a6b44";  // ✅ لون أغمق عند المرور
  }}
  onMouseLeave={(e) => {
    e.target.style.background = "#76845B";
  }}
>
   Logout
</button>
      </div>
    </div>
  );
}