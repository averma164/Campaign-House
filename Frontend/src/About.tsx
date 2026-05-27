import { useNavigate } from "react-router-dom";
import "./About.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshakeSimple, faStar, faStarHalfStroke, faTools } from "@fortawesome/free-solid-svg-icons";

function About() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  return (
    <div className="about-page">

      <div className="about-header">
        <span className="about-eyebrow">About</span>
        <h1>Campaign House</h1>
        <p>
          Empowering people to create, join, and support meaningful campaigns.
        </p>
      </div>

      <div className="about-content">

        <article className="about-section">
          <div className="about-section-icon" aria-hidden="true"><FontAwesomeIcon icon={faHandshakeSimple} /></div>
          <div className="about-section-body">
            <h2>Our Mission</h2>
            <p>
              Our mission is to connect people with impactful campaigns around
              them. Whether it’s social work, environmental initiatives, or
              community support — we aim to bring positive change through
              collective effort.
            </p>
          </div>
        </article>

        <article className="about-section">
          <div className="about-section-icon" aria-hidden="true"><FontAwesomeIcon icon={faTools} /></div>
          <div className="about-section-body">
            <h2>What We Do</h2>
            <p>
              Campaign House provides a platform where users can explore ongoing
              campaigns, stay updated with upcoming initiatives, and actively
              participate in causes they care about.
            </p>
          </div>
        </article>

        <article className="about-section">
          <div className="about-section-icon" aria-hidden="true"><FontAwesomeIcon icon={faStarHalfStroke} /></div>
          <div className="about-section-body">
            <h2>Why Choose Us?</h2>
            <ul>
              <li>Easy access to campaigns</li>
              <li>Connect with like-minded people</li>
              <li>Stay informed about upcoming events</li>
              <li>Simple and user-friendly platform</li>
            </ul>
          </div>
        </article>

        <button
          className="about-back-button"
          onClick={() => navigate(isLoggedIn ? "/campaigns" : "/")}
        >
          {isLoggedIn ? "Return to Dashboard" : "Return to Home"}
        </button>
      </div>

      <footer className="about-footer">
        © 2026 Aditi Verma — All Rights Reserved
      </footer>

    </div>
  );
}

export default About;