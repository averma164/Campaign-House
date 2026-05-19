import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./CreateCampaign.css";

function ShowCampaign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<{ campaign_id: number; name: string; due_date: string | null } | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!id) {
      setError("Campaign ID is missing.");
      return;
    }

    fetch(`http://127.0.0.1:8000/campaigns/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          const message = data?.detail || "Unable to fetch campaign details.";
          setError(message);
          return;
        }
        setCampaign(data.data);
      })
      .catch((error) => {
        console.error("ShowCampaign error:", error);
        setError("Unable to load campaign details.");
      });
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://127.0.0.1:8000/campaigns/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (res.status === 204) {
      alert("Campaign deleted successfully.");
      navigate("/campaigns");
    } else {
      const data = await res.json().catch(() => null);
      const message = data?.detail || "Unable to delete campaign.";
      alert(message);
    }
  };

  
  return (
    <div className="maincreate">
      <div className="show-card">

        {error ? (
          <div>
            <p className="error-text">{error}</p>
            <button className="btn primary" onClick={() => navigate("/campaigns")}>
              Back to campaigns
            </button>
          </div>
        ) : campaign ? (
          <>
            {/* HEADER */}
            <div className="show-header">
              <div>
                <p className="label">CAMPAIGN DETAILS</p>
                <h1>{campaign.name}</h1>
                <span className="status">Active</span>
              </div>

              <div className="icon-box">📣</div>
            </div>

            {/* INFO CARDS */}
            <div className="info-grid">
              <div className="info-card">
                <p className="info-label">Due Date</p>
                <p className="info-value">
                  {campaign.due_date
                    ? new Date(campaign.due_date).toLocaleString()
                    : "No due date"}
                </p>
              </div>

              <div className="info-card">
                <p className="info-label">Campaign ID</p>
                <p className="info-value">{campaign.campaign_id}</p>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="quote-box">
              <blockquote className="quote-text">
                "Never doubt that a small group of thoughtful, committed citizens can change the world." — Margaret Mead
              </blockquote>
            </div>

            {/* ACTIONS */}
            <div className="action-row">
              <Link to="/campaigns">
                <button className="btn secondary">
                  ← Back to campaigns
                </button>
              </Link>

              <button className="btn danger" onClick={handleDelete}>
                🗑 Delete Campaign
              </button>

              <Link to={`/update/${campaign.campaign_id}`}>
                <button className="btn primary">
                  ✏ Edit Campaign
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
};

export default ShowCampaign;
