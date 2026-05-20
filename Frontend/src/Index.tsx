import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./index.css";
import Crousel from "./Crousel";

const features = [
  "🚀 Fast Campaign Creation",
  "📊 Real-time Analytics",
  "🎯 Smart Targeting",
  "⚡ Instant Updates",
  "🔒 Secure Data",
  "📈 Growth Insights"
];

function Index() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % features.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>

      {/* Navbar */}
      <div className="topcontainer">
        <div className="left">
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>
        </div>

        <h2>Campaign House</h2>

        <div className="right">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </div>
      </div>

      {/* Hero */}
      <div className="hero">
        <h1>Discover Campaigns</h1>
        <h1>That Matter</h1>
        <p>Explore ongoing campaigns</p>
        <p>Around you</p>
        <p>Be the part of the change!</p>
      </div>

        <Crousel/>

      {/* Stats */}
      <div className="index-stats">
        <div className="card">
          <p>250+</p>
          <p>Campaigns</p>
        </div>

        <div className="card">
          <p>120K+</p>
          <p>People Joined</p>
        </div>

        <div className="card">
          <p>50+</p>
          <p>Companies</p>
        </div>
      </div>

      {/* Footer */}
      <footer>
        © 2026 Aditi Verma All Rights Reserved
      </footer>

    </div>
  );
}

export default Index;