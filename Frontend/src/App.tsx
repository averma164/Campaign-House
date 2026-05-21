import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampaignCard from "./CampaginCard";
import Buttons from "./Buttons";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faChartPie, faCircle, faGlobe, faHouse, faSquareCheck, faSquarePlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
function App() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevStack, setPrevStack] = useState<any[][]>([]);
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/campaigns", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setCampaigns([]);
          return;
        }
        setCampaigns(data.data || []);
        setNextUrl(data.next || null);
      })
      .catch(() => setCampaigns([]));
    
    fetchStats()

    fetch("http://127.0.0.1:8000/campaigns/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
      })
      .catch(err => console.error("Stats error:", err));

    fetch("http://127.0.0.1:8000/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (!payload?.data) return;
        const unread = payload.data.filter((n: any) => !n.is_read).length;
        setUnreadCount(unread);
      })
      .catch(() => {});

    fetch("http://127.0.0.1:8000/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((me) => {
        if (me?.role === "admin") setIsAdmin(true);
      })
      .catch(() => {});
  }, [navigate]);

  const fetchStats = () => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/campaigns/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setStats(data));
  };

  const fetchData = async (url: string, isNext = true) => {
    const token = localStorage.getItem("token");
    const res = await fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = await res.json();

    if (isNext) {
      setPrevStack((prev) => [...prev, campaigns]);
    }

    setCampaigns(data.data);
    setNextUrl(data.next);
  };

  const handleNext = () => nextUrl && fetchData(nextUrl, true);

  const handlePrev = () => {
    if (prevStack.length === 0) return;
    const last = prevStack[prevStack.length - 1];
    setCampaigns(last);
    setPrevStack((prev) => prev.slice(0, -1));
  };

  const visibleCampaigns = showAllCampaigns ? campaigns : campaigns.slice(0, 2);

  return (
    <div className="app">
      <div className="layout">

        <aside className="sidebar">
          <Link to="/" className="sidebar-brand">
            <span className="sidebar-mark" aria-hidden="true">CH</span>
            <span className="sidebar-brand-name">Campaign House</span>
          </Link>

          <nav className="sidebar-nav">
            <p
              className={`nav-item ${!showAllCampaigns ? "active" : ""}`}
              onClick={() => setShowAllCampaigns(false)}
            >
<span className="nav-icon" aria-hidden="true"><FontAwesomeIcon icon={faHouse} /></span> Dashboard            </p>
            <p
              className={`nav-item ${showAllCampaigns ? "active" : ""}`}
              onClick={() => setShowAllCampaigns(true)}
            >
              <span className="nav-icon" aria-hidden="true"><FontAwesomeIcon icon={faFolder} /></span> Campaigns
            </p>
            <Link to="/analytics" className="Link">
              <p className="nav-item">
                <span className="nav-icon" aria-hidden="true"><FontAwesomeIcon icon={faChartPie} /></span> Analytics
              </p>
            </Link>
            <Link to="/notifications" className="Link">
              <p className="nav-item">
                <span className="nav-icon" aria-hidden="true"><FontAwesomeIcon icon={faBell} /></span> Notifications
                {unreadCount > 0 && (
                  <span className="nav-badge">{unreadCount}</span>
                )}
              </p>
            </Link>
            <Link to="/profile" className="Link">
              <p className="nav-item">
                <span className="nav-icon" aria-hidden="true"><FontAwesomeIcon icon={faUser} /></span> Profile
              </p>
            </Link>
            <Link to="/" className="Link">
              <p className="nav-item">
                <span className="nav-icon" aria-hidden="true"><FontAwesomeIcon icon={faGlobe} /></span> Home
              </p>
            </Link>
          </nav>

          <div className="sidebar-actions">
            <h3>Quick Actions</h3>
            <Buttons showCreate={true} showPager={false} isAdmin={isAdmin} />
          </div>
        </aside>

        <main className="main">
          <header className="header">
            <div className="header-titles">
              <h1>Dashboard</h1>
              <p className="header-sub">Manage and monitor all your campaigns</p>
            </div>
            <blockquote className="p-quote">
              “Alone we can do so little; together we can do so much.”
            </blockquote>
          </header>

          <section className="stats">
            <div className="stat-card stat-total">
              <div className="stat-card-head">
                <span className="stat-icon" aria-hidden="true"><FontAwesomeIcon icon={faSquarePlus} /></span>
                <span className="stat-label">Total Campaigns</span>
              </div>
              <b className="stat-number">{stats.total}</b>
            </div>
            <div className="stat-card stat-active">
              <div className="stat-card-head">
                <span className="stat-icon" aria-hidden="true"><FontAwesomeIcon icon={faCircle} /></span>
                <span className="stat-label">Active</span>
              </div>
              <b className="stat-number">{stats.active}</b>
            </div>
            <div className="stat-card stat-completed">
              <div className="stat-card-head">
                <span className="stat-icon" aria-hidden="true"><FontAwesomeIcon icon={faSquareCheck} /></span>
                <span className="stat-label">Completed</span>
              </div>
              <b className="stat-number">{stats.completed}</b>
            </div>
          </section>

          <section className="campaigns-section">
            <div className="section-head">
              <h2>{showAllCampaigns ? "All Campaigns" : "Recent Campaigns"}</h2>
              <span className="section-count">{campaigns.length}</span>
            </div>

            <div className="container">
              {visibleCampaigns.length > 0 ? (
                visibleCampaigns.map((c) => (
                  <CampaignCard
                    key={c.campaign_id}
                    campaign_id={c.campaign_id}
                    name={c.name}
                    due_date={c.due_date}
                    status={c.status}
                  />
                ))
              ) : (
                <div className="empty">
                  <p className="empty-title">No campaigns yet</p>
                  <span>Once campaigns are created, they'll appear here.</span>
                </div>
              )}
            </div>
          </section>

          <div className="bottom-bar">
            <Buttons
              showCreate={false}
              showPager={true}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div>
        </main>

      </div>
    </div>
  );
}

export default App;