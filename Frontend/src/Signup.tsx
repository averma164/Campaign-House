import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      setSuccess("Account created successfully!");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err: any) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <h1 className="login-title">Sign Up</h1>
        <h4 className="login-subtitle">
          Start Your Journey With Us!
        </h4>

        {error && <p className="login-error">{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Create Account
          </button>
        </form>

        <p className="signup-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;