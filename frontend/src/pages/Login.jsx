import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";  // ✅ أضف useNavigate
import "../styles.css";

export default function Login({ setIsAuthenticated }) {  // ✅ أضف setIsAuthenticated
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();  // ✅ أضف هذا

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setIsAuthenticated(true);  // ✅ أضف هذا
      navigate("/dashboard");    // ✅ أضف هذا
      
    } catch (err) {
      setError(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-page">
        {/* LEFT SIDE - هيكلك الأصلي مع checklist */}
        <div className="left-side">
          <div className="welcome-container">
            <h1>Login and keep the flow going</h1>
            <p className="subtitle">it been a while </p>
            <div className="checklist">
              <div className="checklist-item done">
                <span className="checkbox">✓</span>
                <span>Brew Coffee</span>
              </div>
              <div className="checklist-item done">
                <span className="checkbox">✓</span>
                <span>Open Planner</span>
              </div>
              <div className="checklist-item todo">
                <span className="checkbox"></span>
                <span>Conquer the Day</span>
              </div>
            </div>
          </div>
        </div>

        {/* DECORATIONS */}
        <div className="decorations">
          <img src="/stickers/note.png" className="sticker s1" alt="sticker" />
          <img src="/stickers/book.png" className="sticker s2" alt="sticker" />
        </div>

        {/* RIGHT SIDE */}
        <div className="right-side">
          <form className="card" onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} />
            <button type="submit">Login</button>
            <p className="switch">
              Don't have an account? <Link to="/">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
      </div>
  );
}





 