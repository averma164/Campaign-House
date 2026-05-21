import { useEffect, useState } from "react";
import "./App.css";
import "./Crousel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faRightLong } from "@fortawesome/free-solid-svg-icons";

const features = [
  "🚀 Fast Campaign Creation",
  "📊 Real-time Analytics",
  "🎯 Smart Targeting",
  "⚡ Instant Updates",
  "🔒 Secure Data",
  "📈 Growth Insights"
];

function FeatureSlider() { 
  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false);


 
    useEffect(() => {
    if (pause) return;

    const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % features.length);
    }, 2500);

    return () => clearInterval(interval);
    }, [pause]);


  return (
    
<div
  className="feature-slider"
  onMouseEnter={() => setPause(true)}
  onMouseLeave={() => setPause(false)}
>

  {/* ARROWS */}
  <button
    className="arrow left"
    onClick={() =>
      setIndex((prev) => (prev - 1 + features.length) % features.length)
    }
  >
    <FontAwesomeIcon icon={faLeftLong} />
  </button>

  <button
    className="arrow right"
    onClick={() =>
      setIndex((prev) => (prev + 1) % features.length)
    }
  >
    <FontAwesomeIcon icon={faRightLong} />
  </button>

  {/* SLIDES */}
  <div className="slider-track">
    {features.map((text, i) => (
      <div
        key={i}
        className={`slide ${
          i === index ? "active" : "inactive"
        }`}
      >
        {text}
      </div>
    ))}
  </div>

  {/* DOTS */}
  <div className="dots">
    {features.map((_, i) => (
      <span
        key={i}
        className={`dot ${i === index ? "active-dot" : ""}`}
        onClick={() => setIndex(i)}
      />
    ))}
  </div>

</div>

  );
}

export default FeatureSlider;