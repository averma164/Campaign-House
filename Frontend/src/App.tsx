import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampaignCard from "./CampaginCard";
import Buttons from "./Buttons";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevStack, setPrevStack] = useState<any[][]>([]);
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });


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

  return (
    <div className="app">
      <div className="layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <h2 className="sidebar-h2"><b>Campaign House</b></h2>
          <nav>

            <p className={!showAllCampaigns ? "active" : ""} onClick={() => setShowAllCampaigns(false)}>Dashboard</p>
            <p className={showAllCampaigns ? "active" : ""} onClick={() => setShowAllCampaigns(true)}>Campaigns</p>
            <Link to="/analytics" className="Link">
              <p>Analytics</p>
            </Link>
            <p>Settings</p>
            <Link to="/" className="Link"><p>Index</p></Link>
          </nav>

          <div className="sidebar-actions">
            <h3>Quick Actions</h3>
            <Buttons showCreate={true} showPager={false} />
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <header className="header">
            <h1>Dashboard</h1>
            <p className="p-quote">“Alone we can do so little; together we can do so much.”</p>
            <p>Manage and monitor all your campaigns</p>
          </header>

          {/* STATS */}
          <div className="stats">
            <div className="stat-card">Total<br /><b>{stats.total}</b></div>
            <div className="stat-card">Active<br /><b>{stats.active}</b></div>
            <div className="stat-card">Completed<br /><b>{stats.completed}</b></div>
          </div>

          {/* CAMPAIGNS */}
          <div className="container">
            {campaigns.length > 0 ? (
              (showAllCampaigns ? campaigns : campaigns.slice(0, 2)).map((c) => (
                <CampaignCard
                  key={c.campaign_id}
                  campaign_id={c.campaign_id}
                  name={c.name}
                  due_date={c.due_date}
                  status={c.status}
                />
              ))
            ) : (
              <p className="empty">No campaigns found </p>
            )}
          </div>

          {/* PAGINATION */}
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