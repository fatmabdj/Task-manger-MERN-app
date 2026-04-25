import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles.css";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        form
      );

      localStorage.setItem("token", res.data.token);
      alert("Account created successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="auth-layout">   {/* ✅ فقط هذا السطر مضاف */}
      <div className="auth-page">
        {/* LEFT SIDE - هيكلك الأصلي */}
        <div className="left-side">
          <h1>Plan your day, clear your mind.</h1>
          <p>
            We created a cozy space for you to capture everything on your mind.
            Organize your tasks, set your priorities, and stay focused without the chaos.
            Track your productivity and build better habits every day.
          </p>
        </div>

        {/* DECORATIONS - هيكلك الأصلي */}
        <div className="decorations">
          <img src="/stickers/note.png" className="sticker s1" alt="sticker" />
          <img src="/stickers/book.png" className="sticker s2" alt="sticker" />
        </div>

        {/* RIGHT SIDE - هيكلك الأصلي */}
        <div className="right-side">
          <form className="card" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>}
            <input name="username" placeholder="Username" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} />
            <button type="submit">Create Account</button>
            <p className="switch">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>  
  );
}