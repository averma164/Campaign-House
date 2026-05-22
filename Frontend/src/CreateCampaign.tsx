import { useEffect, useState } from "react";
import './CreateCampaign.css';
import { Link, useNavigate } from "react-router-dom";
import Alert, { type AlertColor } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

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

function CreateCampaign() {
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [categoryId, setCategoryId] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [submitting, setSubmitting] = useState(false);
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
        if (!res.ok) throw new Error("Failed to verify access");
        return res.json();
      })
      .then((me) => {
        if (!me) return;
        if (me.role !== "admin") {
          showAlert("Only admins can create campaigns.", "info");
          setTimeout(() => navigate("/campaigns"), 1500);
          return;
        }
        setAuthorized(true);
      })
      .catch(() => {
        navigate("/campaigns");
      });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const body: Record<string, unknown> = {
      name: name.trim(),
      status,
    };

    if (dueDate) body.due_date = dueDate;
    if (description.trim()) body.description = description.trim();
    if (categoryId.trim()) body.category_id = Number(categoryId);
    if (city.trim()) body.city = city.trim();
    if (state.trim()) body.state = state.trim();
    if (pincode.trim()) body.pincode = pincode.trim();

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://127.0.0.1:8000/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        let message = "Failed to create campaign.";
        if (typeof errorData?.detail === "string") {
          message = errorData.detail;
        } else if (Array.isArray(errorData?.detail) && errorData.detail[0]?.msg) {
          message = errorData.detail[0].msg;
        }
        showAlert(message, "error");
        return;
      }

      const data = await res.json();
      console.log("Created:", data);

      showAlert("Campaign created!", "success");
      setTimeout(() => navigate("/campaigns"), 1500);
    } finally {
      setSubmitting(false);
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

        <h2>Create New Campaign</h2>

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
              value={dueDate}
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
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
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
            City
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Optional"
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
            <button className="sbtn" type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
      {snackbarEl}
    </div>
  );
}

export default CreateCampaign;
