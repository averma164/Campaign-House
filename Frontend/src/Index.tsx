import { Link, NavLink } from "react-router-dom";
import "./index.css";
import Crousel from "./Crousel";
import ParticleBackground from "./ParticleBackground";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";

const STATS = [
  { value: "250+", label: "Campaigns running" },
  { value: "120K+", label: "Members engaged" },
  { value: "50+",  label: "Partner companies" },
];

function Index() {
  return (
    <div className="index-page">
      <header className="topcontainer">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">CH</span>
          <span className="brand-name">Campaign House</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        <div className="nav-cta">
          <Link to="/login">
            <button className="btn-ghost">Login</button>
          </Link>
          <Link to="/signup">
            <button className="btn-primary">Sign Up</button>
          </Link>
        </div>
      </header>

      <section className="hero">
        <ParticleBackground id="hero-particles" className="hero-particles" />
        <div className="hero-orbs" aria-hidden="true">
          <span className="orb orb-1" />
          <span className="orb orb-2" />
          <span className="orb orb-3" />
        </div>

        <div className="hero-content">
          <span className="hero-eyebrow">Discover. Engage. Impact.</span>
          <h1 className="hero-title">
            Campaigns that <span className="hero-shine" data-shine="matter">matter</span>,
            <br /> people that move.
          </h1>
          <p className="hero-sub">
            Explore ongoing initiatives around you and be the part of the change you want to see.
          </p>

          <div className="hero-actions">
            <Link to="/signup">
              <button className="btn-ghost btn-lg">Get Started</button>
            </Link>
            <Link to="/about">
              <button className="btn-ghost btn-lg">Learn more</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="carousel-section">
        <h2 className="section-title">Why teams pick Campaign House</h2>
        <p className="section-sub">A platform built for momentum.</p>
        <Crousel />
      </section>

      <section className="index-stats" aria-label="Platform stats">
        {STATS.map((s) => (
          <div className="stat-card" key={s.label}>
            <p className="stat-value">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </section>

      <footer className="index-footer">
        <div className="footer-inner">
          <span className="brand-mark sm" aria-hidden="true">CH</span>
          <p><FontAwesomeIcon icon={faCopyright} /> 2026 Aditi Verma — All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}

export default Index;
