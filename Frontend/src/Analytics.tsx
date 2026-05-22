import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip,Legend  } from "recharts";
import "./Analytics.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
    
type Campaign = {
  campaign_id: number;
  name: string;
  due_date: string | null;
};

function Analytics() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/campaigns/stats", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data));

    fetch("http://127.0.0.1:8000/campaigns", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCampaigns(data.data || []));
  }, []);

  const now = new Date();

  const upcoming = campaigns
    .filter(c => c.due_date && new Date(c.due_date) > now)
    .slice(0, 3);

  const overdue = campaigns.filter(
    c => c.due_date && new Date(c.due_date) <= now
  );

  const pieData = [
    { name: "Active", value: stats.active },
    { name: "Completed", value: stats.completed }
  ];

  const COLORS = ["#7C3AED", "#94A3B8"];

  const completionPct =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
  <div className="analytics-container">
    <header className="analytics-header">
      <div>
        <span className="analytics-eyebrow">Insights</span>
        <h1>Analytics</h1>
        <p className="analytics-sub">A real-time look at your campaigns.</p>
      </div>
      <Link to="/campaigns" className="analytics-back"><FontAwesomeIcon icon={faLeftLong} /> Back to Dashboard</Link>
    </header>

    <div className="grid">

      {/* ✅ CARD 1 – STATS SUMMARY */}
      <div className="card highlight">
        <h2>Campaign Overview</h2>
        <p className="sub">Real-time performance summary</p>

        <div className="stats-row">
          <div>Total <b>{stats.total}</b></div>
          <div>Active <b>{stats.active}</b></div>
          <div>Completed <b>{stats.completed}</b></div>
        </div>
        
        <p className="trend">
           {stats.active} campaigns currently running
        </p>

      <div className="progress-section">
        <div className="progress-head">
          <span>Completion</span>
          <span className="progress-value">{completionPct}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      </div>

      {/* PIE CHART */}
      <div className="card">
        <h3>Status Distribution</h3>

        <PieChart width={350} height={240}>
          <Pie
            data={pieData}
            cx="65%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
          >
            {pieData.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          
          <Legend 
            verticalAlign="bottom"
            align="right"
            layout="horizontal"
          />

        </PieChart>
      </div>

      {/* UPCOMING */}
      <div className="card">
        <h3>Upcoming Campaigns</h3>

        {upcoming.length > 0 ? (
          upcoming.map(c => (
            <div
              key={c.campaign_id}
              className="list-item"
              onClick={() => navigate(`/campaigns/${c.campaign_id}`)}
            >
              <span>{c.name}</span>
              <small>{new Date(c.due_date!).toLocaleDateString()}</small>
            </div>
          ))
        ) : (
          <p className="empty">No upcoming </p>
        )}
      </div>

      {/* OVERDUE */}
      <div className="card">
        <h3>Overdue Campaigns</h3>

        {overdue.length > 0 ? (
          overdue.map(c => (
            <div
              key={c.campaign_id}
              className="list-item overdue"
              onClick={() => navigate(`/campaigns/${c.campaign_id}`)}
            >
              <span>{c.name}</span>
              <small>{new Date(c.due_date!).toLocaleDateString()}</small>
            </div>
          ))
        ) : (
          <p className="empty">No overdue </p>
        )}
      </div>

    </div>
  </div>

  );
}

export default Analytics;
