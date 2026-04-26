import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/tasks";
import Notes from "./pages/notes";
import Sidebar from "./components/Sidebar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token found:", token);
    if (token && token !== "undefined" && token !== "null") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // ✅ دالة تسجيل الخروج
  const handleLogout = () => {
    setIsAuthenticated(false);  // هذا يغير الحالة ويعيد التوجيه إلى Auth pages
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        backgroundColor: "#E1DAC0"
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // ✅ صفحات Auth - تستخدم تصميمك (styles.css)
  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <div className="auth-layout">
          <Routes>
            <Route path="/" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }

  // ✅ صفحات التطبيق - تستخدم تصميم صديقك (paper-theme.css)
  return (
    <BrowserRouter>
      <div className="main-layout">
        <div className="app">
          <Sidebar onLogout={handleLogout} />  {/* ✅ أضف onLogout هنا */}
          <div className="main">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;