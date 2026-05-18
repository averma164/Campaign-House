import { useNavigate } from "react-router-dom";
import "./About.css";

function About() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div className="about-page">

      {/* Header */}
      <div className="about-header">
        <h1>About Campaign House</h1>
        <p>
          Empowering people to create, join, and support meaningful campaigns.
        </p>
      </div>

      {/* Content */}
      <div className="about-content">

        

        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to connect people with impactful campaigns around them.
            Whether it’s social work, environmental initiatives, or community
            support, we aim to bring positive change through collective effort.
          </p>
        </div>

        <div className="about-section">
          <h2>What We Do</h2>
          <p>
            Campaign House provides a platform where users can explore ongoing
            campaigns, stay updated with upcoming initiatives, and actively
            participate in causes they care about.
          </p>
        </div>

        <div className="about-section">
          <h2>Why Choose Us?</h2>
          <ul>
            <li>Easy access to campaigns</li>
            <li>Connect with like-minded people</li>
            <li>Stay informed about upcoming events</li>
            <li>Simple and user-friendly platform</li>
          </ul>
        </div>
        <button
          className="about-back-button"
          onClick={() => navigate(token ? "/campaigns" : "/")}
        >
          Return to Dashboard
        </button>
      </div>
      <footer>
        © 2026 Aditi Verma All Rights Reserved
      </footer>

    </div>
  );
}

export default About;