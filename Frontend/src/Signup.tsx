import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload: Record<string, string> = {
      email: email.trim(),
      password,
      role,
    };

    const optional: Record<string, string> = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    };

    for (const [key, value] of Object.entries(optional)) {
      if (value) payload[key] = value;
    }

    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let detail = "Signup failed";
        try {
          const data = await res.json();
          if (typeof data?.detail === "string") {
            detail = data.detail;
          } else if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
            detail = data.detail[0].msg;
          }
        } catch {
          /* ignore parse errors and keep default detail */
        }
        throw new Error(detail);
      }

      setSuccess("Account created successfully!");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      setSuccess("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container login-container-wide">

        <Link to="/" className="auth-brand">
          <span className="brand-mark" aria-hidden="true">CH</span>
          <span className="auth-brand-name">Campaign House</span>
        </Link>

        <h1 className="login-title">Create your account</h1>
        <h4 className="login-subtitle">
          Start your journey with us.
        </h4>

        {error && <p className="login-error">{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form className="login-form" onSubmit={handleSubmit}>

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

          <div className="input-group">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>City</label>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>State</label>
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Pincode</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Create Account"}
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
