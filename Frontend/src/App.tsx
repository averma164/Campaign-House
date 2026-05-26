import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampaignCard from "./CampaginCard";
import Buttons from "./Buttons";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faChartPie,
  faCircle,
  faGlobe,
  faHouse,
  faSquareCheck,
  faSquarePlus,
  faUser,
  faFolder,
  faMagnifyingGlass,
  faXmark,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

const API = "http://127.0.0.1:8000";

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

type Filters = {
  categoryId: string;
  state: string;
  city: string;
  dueBy: string;
  status: string;
};

const EMPTY_FILTERS: Filters = {
  categoryId: "",
  state: "",
  city: "",
  dueBy: "",
  status: "",
};

function App() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevStack, setPrevStack] = useState<any[][]>([]);
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);


  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [debouncedFilters, setDebouncedFilters] = useState<Filters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const setFilter = (key: keyof Filters, value: string) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const clearFilters = () => setFilters(EMPTY_FILTERS);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchStats();

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

    fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((me) => {
        if (me?.role === "admin") setIsAdmin(true);
      })
      .catch(() => {});
  }, [navigate]);

  // Debounce search + filter changes together so rapid edits result
  // in a single API call after the user pauses.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setDebouncedFilters(filters);
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm, filters]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setSearching(true);

    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (debouncedFilters.categoryId)
      params.set("category_id", debouncedFilters.categoryId);
    if (debouncedFilters.state.trim())
      params.set("state", debouncedFilters.state.trim());
    if (debouncedFilters.city.trim())
      params.set("city", debouncedFilters.city.trim());
    if (debouncedFilters.dueBy)
      params.set("due_by", new Date(debouncedFilters.dueBy).toISOString());
    if (debouncedFilters.status)
      params.set("status", debouncedFilters.status);

    const query = params.toString();
    const url = query ? `${API}/campaigns?${query}` : `${API}/campaigns`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setCampaigns([]);
          setNextUrl(null);
          return;
        }
        setCampaigns(data.data || []);
        setNextUrl(data.next || null);
        setPrevStack([]);
      })
      .catch(() => {
        setCampaigns([]);
        setNextUrl(null);
      })
      .finally(() => setSearching(false));
  }, [debouncedSearch, debouncedFilters]);

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

  const hasSearch = debouncedSearch.length > 0;
  const hasFilters = Object.values(debouncedFilters).some(Boolean);
  const visibleCampaigns =
    showAllCampaigns || hasSearch || hasFilters
      ? campaigns
      : campaigns.slice(0, 2);

  const sectionTitle = hasSearch
    ? `Search results for "${debouncedSearch}"`
    : hasFilters
    ? "Filtered campaigns"
    : showAllCampaigns
    ? "All Campaigns"
    : "Recent Campaigns";

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
              <h2>{sectionTitle}</h2>
              <span className="section-count">{campaigns.length}</span>
            </div>

            <div className="search-bar">
              <span className="search-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
              <input
                type="search"
                className="search-input"
                placeholder="Search campaigns by name or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search campaigns"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
              <button
                type="button"
                className={`filter-toggle ${filtersOpen ? "open" : ""}`}
                onClick={() => setFiltersOpen((v) => !v)}
                aria-expanded={filtersOpen}
                aria-controls="filter-panel"
              >
                <FontAwesomeIcon icon={faFilter} /> Filters
                {activeFilterCount > 0 && (
                  <span className="filter-toggle-badge">{activeFilterCount}</span>
                )}
              </button>
              {searching && <span className="search-status">Searching…</span>}
            </div>

            {filtersOpen && (
              <div className="filter-panel" id="filter-panel">
                <div className="filter-grid">
                  <label className="filter-field">
                    <span>Category</span>
                    <select
                      value={filters.categoryId}
                      onChange={(e) => setFilter("categoryId", e.target.value)}
                    >
                      <option value="">All categories</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="filter-field">
                    <span>Status</span>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilter("status", e.target.value)}
                    >
                      <option value="">Any status</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </label>

                  <label className="filter-field">
                    <span>City</span>
                    <input
                      type="text"
                      value={filters.city}
                      onChange={(e) => setFilter("city", e.target.value)}
                      placeholder="e.g. Mumbai"
                    />
                  </label>

                  <label className="filter-field">
                    <span>State</span>
                    <input
                      type="text"
                      value={filters.state}
                      onChange={(e) => setFilter("state", e.target.value)}
                      placeholder="e.g. Maharashtra"
                    />
                  </label>

                  <label className="filter-field">
                    <span>Due by</span>
                    <input
                      type="date"
                      value={filters.dueBy}
                      onChange={(e) => setFilter("dueBy", e.target.value)}
                    />
                  </label>
                </div>

                {activeFilterCount > 0 && (
                  <div className="filter-actions">
                    <span className="filter-count-text">
                      {activeFilterCount} filter
                      {activeFilterCount === 1 ? "" : "s"} active
                    </span>
                    <button
                      type="button"
                      className="filter-clear"
                      onClick={clearFilters}
                    >
                      <FontAwesomeIcon icon={faXmark} /> Clear all
                    </button>
                  </div>
                )}
              </div>
            )}

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
              ) : hasSearch ? (
                <div className="empty">
                  <p className="empty-title">
                    No campaigns match "{debouncedSearch}"
                  </p>
                  <span>Try a different name or keyword.</span>
                </div>
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