import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import "./App.css";

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

  const COLORS = ["#6D28D9", "#DC2626"];
  const totalValue = stats.active + stats.completed;

  return (
    <div className="analytics-page">

      <h1>📊 Analytics Dashboard</h1>

      {/* ✅ STATS */}
      <div className="stats">
        <div className="stat-card">Total<br /><b>{stats.total}</b></div>
        <div className="stat-card">Active<br /><b>{stats.active}</b></div>
        <div className="stat-card">Completed<br /><b>{stats.completed}</b></div>
      </div>

      {/* ✅ PIE */}
      <div className="analytics-section-center">
        <h2>Status Distribution</h2>

        <PieChart width={300} height={300}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={(entry) => {
              const percent = totalValue
                ? (entry.value / totalValue) * 100
                : 0;
              return percent > 0 ? `${percent.toFixed(0)}%` : "";
            }}
          >
            {pieData.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="18"
            fill="#4C1D95"
          >
            {totalValue
              ? `${Math.round((stats.active / totalValue) * 100)}%`
              : "0%"}
          </text>

          <Tooltip />
        </PieChart>
      </div>
      {/* ✅ DEADLINES */}
<div className="deadlines-wrapper">

  {/* UPCOMING */}
  <div className="deadline-card">
    <div className="card-head">Upcoming</div>

    <div className="card-body">
      {upcoming.length > 0 ? (
        upcoming.map(c => (
          <div
            key={c.campaign_id}
            className="deadline-item"
            onClick={() => navigate(`/campaigns/${c.campaign_id}`)}
          >
            <span>{c.name}</span>
            <span className="date">
              {new Date(c.due_date!).toLocaleDateString()}
            </span>
          </div>
        ))
      ) : (
        <p className="empty-text">No upcoming ✅</p>
      )}
    </div>
  </div>

    {/* OVERDUE */}
    <div className="deadline-card">
        <div className="card-head">Overdue</div>

        <div className="card-body">
        {overdue.length > 0 ? (
            overdue.map(c => (
            <div
                key={c.campaign_id}
                className="deadline-item overdue"
                onClick={() => navigate(`/campaigns/${c.campaign_id}`)}
            >
                <span>{c.name}</span>
                <span className="date">
                {new Date(c.due_date!).toLocaleDateString()}
                </span>
            </div>
            ))
        ) : (
            <p className="empty-text">No overdue 🚀</p>
        )}
        </div>
    </div>

    </div>

    </div>
  );
}

export default Analytics;
