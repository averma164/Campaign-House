import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./CreateCampaign.css";

function ShowCampaign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<{
    campaign_id: number;
    name: string;
    due_date: string | null;
    status: string;          
    description?: string;    
  } | null>(null);

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
  
  const getStatus = () => {
    if (!campaign) return "ACTIVE";

    if (
      campaign.due_date &&
      new Date(campaign.due_date) < new Date()
    ) {
      return "COMPLETED";
    }

    return "ACTIVE";
  };


  
return (
    <div className="maincreate">
      <div className="campaign-detail-card">

        {error ? (
          <div>
            <p className="error-text">{error}</p>
            <button
              className="btn primary"
              onClick={() => navigate("/campaigns")}
            >
              Back to campaigns
            </button>
          </div>
        ) : campaign ? (
          <>
            {/* ✅ TOP ROW */}
            <div className="top-row">
              <h3 className="campaign-id">
                #CMP-{campaign.campaign_id}
              </h3>

              <span
                className={`status-badge ${
                  getStatus() === "COMPLETED"
                    ? "completed"
                    : "active"
                }`}
              >
                {getStatus()}
              </span>
            </div>

            {/* ✅ NAME */}
            <p className="campaign-title">
              Campaign Name: {campaign.name}
            </p>

            {/* ✅ DATE */}
            <div className="campaign-meta">
              📅 Date:{" "}
              {campaign.due_date
                ? new Date(
                    campaign.due_date
                  ).toLocaleString()
                : "No due date"}
            </div>

            {/* ✅ DESCRIPTION */}
            <div className="description-box">
              <p className="desc-label">Description:</p>
              <p className="desc-text">
                {campaign.description ? campaign.description : "Never doubt that a small group of thoughtful, committed citizens can change the world. — Margaret Mead"}
              </p>
            </div>

            {/* ✅ ACTION BUTTONS */}
            <div className="action-buttons">
              <Link to={`/update/${campaign.campaign_id}`}>
                <button className="btn primary">
                  Edit Campaign
                </button>
              </Link>

              <button
                className="btn danger"
                onClick={handleDelete}
              >
                Delete Campaign
              </button>

              <Link to="/campaigns">
                <button className="btn secondary">
                  ← Back
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}

      </div>
    </div>
  );
};

export default ShowCampaign;
