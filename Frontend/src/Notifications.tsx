import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Notifications.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";

type Notification = {
  id: number;
  user_id: number;
  campaign_id: number | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

const API = "http://127.0.0.1:8000";

function Notifications() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchNotifications = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError("");

    fetch(`${API}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return null;
        }
        if (!res.ok) throw new Error("Failed to load notifications");
        return res.json();
      })
      .then((payload) => {
        if (payload) setItems(payload.data ?? []);
      })
      .catch((err) => setError(err.message || "Something went wrong"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchNotifications, [navigate]);

  const markOneRead = async (id: number) => {
    if (!token) return;
    const res = await fetch(`${API}/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    }
  };

  const markAllRead = async () => {
    if (!token) return;
    const res = await fetch(`${API}/notifications/read-all`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const unreadCount = items.filter((n) => !n.is_read).length;

  // Messages may be plain ("created", "updated") or carry a deleted
  // campaign reference ("deleted CMP-12") because the FK is gone.
  const parseMessage = (n: Notification) => {
    const match = /^([a-zA-Z]+)(?:\s+(CMP-\d+))?$/.exec(n.message.trim());
    if (!match) return { action: n.message, label: null as string | null };
    return { action: match[1], label: match[2] ?? null };
  };

  return (
    <div className="notifications-page">
      <div className="notifications-container">

        <div className="notifications-header">
          <Link to="/campaigns" className="notifications-back">
          <FontAwesomeIcon icon={faLeftLong} /> Back to Dashboard
          </Link>
          <h1>Notifications</h1>
          <p className="notifications-subtitle">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
              : "You're all caught up"}
          </p>
        </div>

        <div className="notifications-toolbar">
          <button
            type="button"
            className="toolbar-btn"
            onClick={fetchNotifications}
            disabled={loading}
          >
            Refresh
          </button>
          <button
            type="button"
            className="toolbar-btn primary"
            onClick={markAllRead}
            disabled={loading || unreadCount === 0}
          >
            Mark all as read
          </button>
        </div>

        {loading && <p className="notifications-status">Loading...</p>}
        {error && <p className="notifications-status notifications-error">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <div className="notifications-empty">
            <p>No notifications yet.</p>
            <span>You'll see updates here when campaigns are created or changed.</span>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <ul className="notifications-list">
            {items.map((n) => {
              const { action, label } = parseMessage(n);
              const reference = n.campaign_id
                ? `#${n.campaign_id}`
                : label ?? "";
              return (
                <li
                  key={n.id}
                  className={`notification-item ${n.is_read ? "read" : "unread"}`}
                >
                  <div className="notification-dot" aria-hidden="true" />

                  <div className="notification-body">
                    <div className="notification-message">
                      Campaign {reference}{" "}
                      <span className={`action action-${action}`}>{action}</span>
                    </div>
                    <div className="notification-meta">{formatDate(n.created_at)}</div>
                  </div>

                  <div className="notification-actions">
                    {n.campaign_id && (
                      <Link
                        to={`/campaigns/${n.campaign_id}`}
                        className="action-link"
                      >
                        View
                      </Link>
                    )}
                    {!n.is_read && (
                      <button
                        type="button"
                        className="action-link ghost"
                        onClick={() => markOneRead(n.id)}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Notifications;
