import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Notifications.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeftLong,
  faBullhorn,
  faPenToSquare,
  faTrashCan,
  faBell,
  faLocationDot,
  faClock,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

type Notification = {
  id: number;
  user_id: number;
  campaign_id: number | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

type Campaign = {
  campaign_id: number;
  name: string;
  description: string | null;
  city: string | null;
  state: string | null;
};

const API = "http://127.0.0.1:8000";

function Notifications() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Notification[]>([]);
  const [campaigns, setCampaigns] = useState<Record<number, Campaign>>({});
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

  // Hydrate each referenced campaign so we can show name/description/location.
  // Failed lookups (e.g. deleted campaigns) are silently skipped.
  useEffect(() => {
    if (!token) return;
    const ids = Array.from(
      new Set(
        items
          .map((n) => n.campaign_id)
          .filter((id): id is number => typeof id === "number")
      )
    );
    const missing = ids.filter((id) => !(id in campaigns));
    if (missing.length === 0) return;

    let cancelled = false;
    Promise.all(
      missing.map((id) =>
        fetch(`${API}/campaigns/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((p) =>
            p && p.data ? ([id, p.data as Campaign] as const) : null
          )
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return;
      setCampaigns((prev) => {
        const next = { ...prev };
        for (const r of results) if (r) next[r[0]] = r[1];
        return next;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [items, token, campaigns]);

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

  const formatAbsolute = (iso: string) => {
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

  const timeAgo = (iso: string) => {
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return iso;
    const diff = Date.now() - t;
    if (diff < 0) return "just now";
    const s = Math.floor(diff / 1000);
    if (s < 45) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} min${m === 1 ? "" : "s"} ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
    const d = new Date(iso);
    const today = new Date();
    const isToday =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();
    if (isToday) {
      return `Today at ${d.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    }
    const days = Math.floor(h / 24);
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Messages may be plain ("created", "updated") or carry a deleted
  // campaign reference ("deleted CMP-12") because the FK is gone.
  const parseMessage = (n: Notification) => {
    const match = /^([a-zA-Z]+)(?:\s+(CMP-\d+))?$/.exec(n.message.trim());
    if (!match) return { action: n.message.toLowerCase(), label: null as string | null };
    return { action: match[1].toLowerCase(), label: match[2] ?? null };
  };

  type Variant = {
    title: string;
    description: string;
    icon: typeof faBell;
    cta: { label: string; to?: string } | null;
  };

  const buildVariant = (n: Notification): Variant => {
    const { action } = parseMessage(n);
    const campaign = n.campaign_id ? campaigns[n.campaign_id] : null;
    const desc = campaign?.description?.trim() || "";

    if (action === "created") {
      return {
        title: "New Campaign Near You!",
        description: desc || "A new campaign just launched — jump in and make an impact.",
        icon: faBullhorn,
        cta: n.campaign_id
          ? { label: "Join Now", to: `/campaigns/${n.campaign_id}` }
          : null,
      };
    }
    if (action === "updated") {
      return {
        title: "Campaign Update",
        description: desc || "Details for this campaign were updated. Take a quick look.",
        icon: faPenToSquare,
        cta: n.campaign_id
          ? { label: "View Campaign", to: `/campaigns/${n.campaign_id}` }
          : null,
      };
    }
    if (action === "deleted") {
      return {
        title: "Campaign Removed",
        description: "This campaign is no longer available.",
        icon: faTrashCan,
        cta: null,
      };
    }
    return {
      title: "Notification",
      description: n.message,
      icon: faBell,
      cta: n.campaign_id
        ? { label: "View Campaign", to: `/campaigns/${n.campaign_id}` }
        : null,
    };
  };

  const unreadCount = items.filter((n) => !n.is_read).length;

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
        {error && (
          <p className="notifications-status notifications-error">{error}</p>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="notifications-empty">
            <p>No notifications yet.</p>
            <span>
              You'll see updates here when campaigns are created or changed.
            </span>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <ul className="notifications-list">
            {items.map((n) => {
              const { action } = parseMessage(n);
              const variant = buildVariant(n);
              const campaign = n.campaign_id ? campaigns[n.campaign_id] : null;
              const campaignName =
                campaign?.name ??
                (n.campaign_id ? `Campaign #${n.campaign_id}` : "Campaign");
              const location = campaign
                ? [campaign.city, campaign.state].filter(Boolean).join(", ")
                : "";

              return (
                <li
                  key={n.id}
                  className={`notification-card ${n.is_read ? "read" : "unread"} variant-${action}`}
                >
                  <div className="notification-icon" aria-hidden="true">
                    <FontAwesomeIcon icon={variant.icon} />
                  </div>

                  <div className="notification-body">
                    <div className="notification-top">
                      <span className="notification-title">
                        {variant.title}
                      </span>
                      {!n.is_read && (
                        <span className="notification-pill" aria-label="Unread">
                          NEW
                        </span>
                      )}
                    </div>

                    <h3 className="notification-campaign">{campaignName}</h3>

                    <p className="notification-description">
                      {variant.description}
                    </p>

                    <div className="notification-meta">
                      {location && (
                        <span className="meta-chip">
                          <FontAwesomeIcon icon={faLocationDot} />
                          {location}
                        </span>
                      )}
                      <span
                        className="meta-chip subtle"
                        title={formatAbsolute(n.created_at)}
                      >
                        <FontAwesomeIcon icon={faClock} />
                        {timeAgo(n.created_at)}
                      </span>
                    </div>

                    {(variant.cta || !n.is_read) && (
                      <div className="notification-cta-row">
                        {variant.cta && (
                          <Link
                            to={variant.cta.to ?? "#"}
                            className="notification-cta"
                          >
                            {variant.cta.label}
                          </Link>
                        )}
                        {!n.is_read && (
                          <button
                            type="button"
                            className="notification-mark-read"
                            onClick={() => markOneRead(n.id)}
                          >
                            <FontAwesomeIcon icon={faCheck} />
                            Mark as read
                          </button>
                        )}
                      </div>
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
