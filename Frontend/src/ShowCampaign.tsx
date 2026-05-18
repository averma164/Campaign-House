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
      <div className="form-container">
        <h2>Campaign Details</h2>

        {error ? (
          <div>
            <p style={{ color: "red" }}>{error}</p>
            <button className="sbtn" onClick={() => navigate("/campaigns")}>
              Back to campaigns
            </button>
          </div>
        ) : campaign ? (
          <div className="show-details">
            <p><strong>ID:</strong> {campaign.campaign_id}</p>
            <p><strong>Name:</strong> {campaign.name}</p>
            <p>
              <strong>Due Date:</strong>{" "}
              {campaign.due_date ? new Date(campaign.due_date).toLocaleString() : "No due date"}
            </p>

            <div className="card-actions">
              <Link to="/campaigns">
                <button className="btn update">Back to campaigns</button>
              </Link>
              <button className="btn delete" onClick={handleDelete}>
                Delete campaign
              </button>
              <Link to={`/update/${campaign.campaign_id}`}>
                <button className="btn update">Edit campaign</button>
              </Link>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default ShowCampaign;
