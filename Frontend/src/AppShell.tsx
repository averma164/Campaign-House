import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faBell,
  faChartPie,
  faCircleInfo,
  faFolder,
  faHouse,
  faPlus,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./AppShell.css";

const API = "http://127.0.0.1:8000";

type NavItem = {
  to: string;
  icon: typeof faHouse;
  label: string;
  match: (pathname: string, search: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    to: "/campaigns",
    icon: faHouse,
    label: "Dashboard",
    match: (path, search) =>
      path === "/campaigns" && new URLSearchParams(search).get("view") !== "all",
  },
  {
    to: "/campaigns?view=all",
    icon: faFolder,
    label: "Campaigns",
    match: (path, search) =>
      (path === "/campaigns" &&
        new URLSearchParams(search).get("view") === "all") ||
      path.startsWith("/campaigns/"),
  },
  {
    to: "/analytics",
    icon: faChartPie,
    label: "Analytics",
    match: (path) => path === "/analytics",
  },
  {
    to: "/profile",
    icon: faUser,
    label: "Profile",
    match: (path) => path === "/profile",
  },
];

type Props = {
  children: ReactNode;
};

function AppShell({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [expanded, setExpanded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((me) => {
        if (me?.role === "admin") setIsAdmin(true);
      })
      .catch(() => {});

    fetch(`${API}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (!payload?.data) return;
        const unread = payload.data.filter((n: any) => !n.is_read).length;
        setUnreadCount(unread);
      })
      .catch(() => {});
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (item: NavItem) =>
    item.match(location.pathname, location.search);

  return (
    <div className={`shell ${expanded ? "shell-expanded" : "shell-collapsed"}`}>
      <aside className="shell-sidebar" aria-expanded={expanded}>
        <button
          type="button"
          className="shell-toggle"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
          title={expanded ? "Collapse" : "Expand"}
        >
          <FontAwesomeIcon icon={expanded ? faAnglesLeft : faAnglesRight} />
        </button>

        <Link to="/campaigns" className="shell-brand" title="Campaign House">
          <span className="shell-mark" aria-hidden="true">CH</span>
          <span className="shell-brand-name">Campaign House</span>
        </Link>

        <nav className="shell-nav">
          {NAV_ITEMS.map((item, idx) => {
            const active = isActive(item);
            return (
              <Link
                key={`${item.to}-${idx}`}
                to={item.to}
                className={`shell-nav-item ${active ? "active" : ""}`}
                title={item.label}
                aria-label={item.label}
              >
                <span className="shell-nav-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={item.icon} />
                </span>
                <span className="shell-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="shell-main">
        <div className="shell-quick-actions" role="toolbar" aria-label="Quick actions">
          {isAdmin && (
            <Link
              to="/create"
              className="qa-btn qa-create"
              title="Create new campaign"
              aria-label="Create new campaign"
            >
              <FontAwesomeIcon icon={faPlus} />
            </Link>
          )}
          <Link
            to="/notifications"
            className="qa-btn qa-notifications"
            title="Notifications"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
          >
            <FontAwesomeIcon icon={faBell} />
            {unreadCount > 0 && (
              <span className="qa-badge" aria-hidden="true">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
          <Link
            to="/about"
            className="qa-btn qa-about"
            title="About"
            aria-label="About"
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </Link>
          <button
            type="button"
            className="qa-btn qa-logout"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        </div>

        <div className="shell-content">{children}</div>
      </div>
    </div>
  );
}

export default AppShell;
