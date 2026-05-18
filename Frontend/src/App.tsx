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
  }, [navigate]);

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
            <p>Analytics</p>
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
            <div className="stat-card">Total<br /><b>{campaigns.length}</b></div>
            <div className="stat-card">Active<br /><b>3</b></div>
            <div className="stat-card">Completed<br /><b>4</b></div>
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