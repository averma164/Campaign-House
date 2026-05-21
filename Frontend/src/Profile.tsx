import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";

type UserProfile = {
  id: number;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
};

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return null;
        }
        if (!res.ok) {
          throw new Error("Failed to load profile");
        }
        return res.json();
      })
      .then((data) => {
        if (data) setProfile(data);
      })
      .catch((err) => setError(err.message || "Something went wrong"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const initials = (() => {
    if (!profile) return "";
    const first = profile.first_name?.[0] ?? "";
    const last = profile.last_name?.[0] ?? "";
    const combined = (first + last).trim();
    return combined || profile.email[0]?.toUpperCase() || "?";
  })();

  const fullName = (() => {
    if (!profile) return "";
    const parts = [profile.first_name, profile.last_name].filter(Boolean);
    return parts.join(" ").trim();
  })();

  return (
    <div className="profile-page">
      <div className="profile-container">

        <div className="profile-header">
          <Link to="/campaigns" className="profile-back"><FontAwesomeIcon icon={faLeftLong} /> Back to Dashboard</Link>
          <h1>Profile</h1>
          <p className="profile-subtitle">Your account details</p>
        </div>

        {loading && <p className="profile-status">Loading...</p>}
        {error && <p className="profile-status profile-error">{error}</p>}

        {profile && (
          <>
            <div className="profile-card">
              <div className="profile-avatar">{initials.toUpperCase()}</div>
              <div className="profile-identity">
                <h2>{fullName || "Unnamed user"}</h2>
                <p className="profile-email">{profile.email}</p>
                <span className={`profile-role role-${profile.role}`}>
                  {profile.role}
                </span>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">User ID</span>
                <span className="detail-value">{profile.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email</span>
                <span className="detail-value">{profile.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">First Name</span>
                <span className="detail-value">
                  {profile.first_name || <em className="muted">Not set</em>}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Last Name</span>
                <span className="detail-value">
                  {profile.last_name || <em className="muted">Not set</em>}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Role</span>
                <span className="detail-value">{profile.role}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">City</span>
                <span className="detail-value">
                  {profile.city || <em className="muted">Not set</em>}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">State</span>
                <span className="detail-value">
                  {profile.state || <em className="muted">Not set</em>}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Pincode</span>
                <span className="detail-value">
                  {profile.pincode || <em className="muted">Not set</em>}
                </span>
              </div>
            </div>

            <div className="profile-actions">
              <button className="profile-btn danger" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
