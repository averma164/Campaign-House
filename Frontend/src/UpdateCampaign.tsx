import { useEffect, useState } from "react";
import "./CreateCampaign.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert, { type AlertColor } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import PosterImageUpload from "./PosterImageUpload";

const CATEGORIES: { id: number; name: string }[] = [
  { id: 1, name: "Others" },
  { id: 2, name: "Digital Marketing" },
  { id: 3, name: "Product Launch" },
  { id: 4, name: "Brand Awareness" },
  { id: 5, name: "Lead Generation" },
  { id: 6, name: "Customer Retention" },
  { id: 7, name: "Fundraising" },
  { id: 8, name: "Event Promotion" },
  { id: 9, name: "Social Media Campaign" },
  { id: 10, name: "Seasonal Campaign" },
  { id: 11, name: "Affiliate Marketing" },
];

function UpdateCampaign() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [due_date, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [originPageUrl, setOriginPageUrl] = useState("");
  const [posterImage, setPosterImage] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "info" });

  const showAlert = (message: string, severity: AlertColor = "info") =>
    setSnackbar({ open: true, message, severity });
  const closeAlert = () => setSnackbar((s) => ({ ...s, open: false }));

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
          showAlert("Unable to load campaign.", "error");
          setTimeout(() => navigate("/campaigns"), 1500);
          return;
        }

        const campaignData = await campaignRes.json();
        const me = meRes.ok ? await meRes.json() : null;
        const campaign = campaignData.data;

        if (!me || campaign?.owner_id !== me.id) {
          showAlert("Only the campaign owner can edit this campaign.", "info");
          setTimeout(() => navigate(`/campaigns/${id}`), 1500);
          return;
        }

        setName(campaign.name || "");
        setDueDate(
          campaign.due_date
            ? new Date(campaign.due_date).toISOString().slice(0, 16)
            : ""
        );
        setDescription(campaign.description || "");
        setCategoryId(
          campaign.category_id != null ? String(campaign.category_id) : ""
        );
        setOriginPageUrl(campaign.origin_page_url || "");
        setPosterImage(campaign.poster_image || "");
        setState(campaign.state || "");
        setPincode(campaign.pincode || "");
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
      category_id: categoryId.trim() ? Number(categoryId) : null,
      origin_page_url: originPageUrl.trim() || null,
      poster_image: posterImage.trim() || null,
      state: state.trim() || null,
      pincode: pincode.trim() || null,
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

      showAlert("Campaign Updated!", "success");
      setTimeout(() => navigate("/campaigns"), 1500);
    } catch (error) {
      console.error("Error updating campaign:", error);
      showAlert("Update failed!", "error");
    }
  };

  const snackbarEl = (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={closeAlert}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={closeAlert}
        variant="standard"
        color={snackbar.severity}
        severity={snackbar.severity}
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );

  if (authorized !== true) {
    return (
      <div className="maincreate">
        <div className="form-container">
          <h2>Checking access...</h2>
        </div>
        {snackbarEl}
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

          <label>
            Category
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select a category (optional)</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Origin Url
            <input
              type="url"
              value={originPageUrl}
              onChange={(e) => setOriginPageUrl(e.target.value)}
              placeholder="Optional"
            />
          </label>

          <label>
            Poster Image
            <PosterImageUpload
              value={posterImage}
              onChange={setPosterImage}
            />
          </label>

          <label>
            State
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Optional"
            />
          </label>

          <label>
            Pincode
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Optional"
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
      {snackbarEl}
    </div>
  );
}

export default UpdateCampaign;
