import { useEffect, useState } from "react";
import "./CreateCampaign.css";
import { Link, useNavigate, useParams } from "react-router-dom";

function UpdateCampaign() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [due_date, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadAndAuthorize = async () => {
      try {
        const [campaignRes, meRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/campaigns/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://127.0.0.1:8000/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (meRes.status === 401 || campaignRes.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!campaignRes.ok) {
          alert("Unable to load campaign.");
          navigate("/campaigns");
          return;
        }

        const campaignData = await campaignRes.json();
        const me = meRes.ok ? await meRes.json() : null;
        const campaign = campaignData.data;

        if (!me || campaign?.owner_id !== me.id) {
          alert("Only the campaign owner can edit this campaign.");
          navigate(`/campaigns/${id}`);
          return;
        }

        setName(campaign.name || "");
        setDueDate(
          campaign.due_date
            ? new Date(campaign.due_date).toISOString().slice(0, 16)
            : ""
        );
        setDescription(campaign.description || "");
        setAuthorized(true);
      } catch (error) {
        console.error("Error loading campaign:", error);
        navigate("/campaigns");
      }
    };

    loadAndAuthorize();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = {
      name,
      due_date: due_date || null,
      description,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/campaigns/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Update:", data);

      alert("Campaign Updated!");
      navigate("/campaigns");
    } catch (error) {
      console.error("Error updating campaign:", error);
      alert("Update failed!");
    }
  };

  if (authorized !== true) {
    return (
      <div className="maincreate">
        <div className="form-container">
          <h2>Checking access...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="maincreate">
      <div className="form-container">
        <h2>Edit Campaign</h2>

        <form onSubmit={handleSubmit} className="form">

          <label>
            Campaign Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Due Date
            <input
              type="datetime-local"
              value={due_date}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </label>

          <div className="form-actions">
            <Link to="/campaigns">
              <button type="button" className="rbtn">Return</button>
            </Link>
            <button className="sbtn" type="submit">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateCampaign;
