import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./CreateCampaign.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faCalendarDays, faHashtag, faLeftLong, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import Alert, { type AlertColor } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

function ShowCampaign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<{
    campaign_id: number;
    name: string;
    due_date: string | null;
    status: string;          
    description?: string;
    owner_id?: number;
    poster_image?: string;
    origin_page_url?: string | null;
  } | null>(null);

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [posterFailed, setPosterFailed] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "info" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const showAlert = (message: string, severity: AlertColor = "info") =>
    setSnackbar({ open: true, message, severity });
  const closeAlert = () => setSnackbar((s) => ({ ...s, open: false }));

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

    fetch("http://127.0.0.1:8000/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((me) => {
        if (me?.id != null) setCurrentUserId(me.id);
      })
      .catch(() => {});
  }, [id, navigate]);

  const isOwner =
    campaign != null &&
    currentUserId != null &&
    campaign.owner_id === currentUserId;

  const handleDelete = () => {
    if (!id) return;
    if (!isOwner) {
      showAlert("Only the campaign owner can delete this campaign.", "info");
      return;
    }
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/campaigns/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      setConfirmOpen(false);

      if (res.status === 204) {
        showAlert("Campaign deleted successfully.", "success");
        setTimeout(() => navigate("/campaigns"), 1500);
      } else {
        const data = await res.json().catch(() => null);
        const message = data?.detail || "Unable to delete campaign.";
        showAlert(message, "error");
      }
    } finally {
      setDeleting(false);
    }
  };
  
  const normalizeUrl = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  const prettyHost = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
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
            {/* TOP ROW */}
            <div className="top-row">
              <h3 className="campaign-id">
              <FontAwesomeIcon icon={faHashtag} />CMP-{campaign.campaign_id}
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

            {/*NAME */}
            <p className="campaign-title">
              Campaign Name: {campaign.name}
            </p>

            {/* DATE */}
            <div className="campaign-meta">
            <FontAwesomeIcon icon={faCalendarDays} /> Date:{" "}
              {campaign.due_date
                ? new Date(
                    campaign.due_date
                  ).toLocaleString()
                : "No due date"}
            </div>

            {/* POSTER IMAGE */}
            {campaign.poster_image && !posterFailed && (
              <div className="poster-image">
                <img
                  src={campaign.poster_image}
                  alt={`${campaign.name} poster`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => setPosterFailed(true)}
                />
              </div>
            )}

            {/* DESCRIPTION */}
            <div className="description-box">
              <p className="desc-label">Description:</p>
              <p className="desc-text">
                {campaign.description ? campaign.description : "Never doubt that a small group of thoughtful, committed citizens can change the world. — Margaret Mead"}
              </p>
            </div>

            {/* ORIGIN URL */}
            {campaign.origin_page_url &&
              (() => {
                const href = normalizeUrl(campaign.origin_page_url);
                if (!href) return null;
                return (
                  <div className="origin-link-box">
                    <p className="desc-label">Source:</p>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="origin-link"
                    >
                      <span className="origin-link-host">
                        {prettyHost(href)}
                      </span>
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </a>
                  </div>
                );
              })()}

            {/* ACTION BUTTONS */}
            <div className="action-buttons">
              {isOwner && (
                <Link to={`/update/${campaign.campaign_id}`}>
                  <button className="btn primary">
                  <FontAwesomeIcon icon={faPencil} />Edit Campaign
                  </button>
                </Link>
              )}

              {isOwner && (
                <button
                  className="btn danger"
                  onClick={handleDelete}
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete Campaign
                </button>
              )}

              <Link to="/campaigns">
                <button className="btn secondary">
                <FontAwesomeIcon icon={faLeftLong} /> Back
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}

      </div>

      <Dialog
        open={confirmOpen}
        onClose={() => !deleting && setConfirmOpen(false)}
        aria-labelledby="delete-campaign-title"
      >
        <DialogTitle id="delete-campaign-title">Delete campaign?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this campaign? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmOpen(false)}
            disabled={deleting}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={deleting}
            color="error"
            variant="contained"
            autoFocus
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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
    </div>
  );
};

export default ShowCampaign;
