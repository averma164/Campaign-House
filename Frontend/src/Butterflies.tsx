import "./Butterflies.css";

const COUNT = 9;

function Butterflies() {
  return (
    <div className="butterflies" aria-hidden="true">
      {Array.from({ length: COUNT }).map((_, i) => (
        <span key={i} className={`butterfly butterfly-${i + 1}`}>
          <span className="butterfly-wing">🦋</span>
        </span>
      ))}
    </div>
  );
}

export default Butterflies;
