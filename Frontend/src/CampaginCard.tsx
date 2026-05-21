import { Link } from "react-router-dom";
import "./CampaignCard.css";

type Props = {
  campaign_id: number;
  name: string;
  due_date: string | null;
  status?: string;
};

const CampaignCard = ({ campaign_id, name, due_date, status }: Props) => {
  const normalizedStatus = (status || "active").toLowerCase();

  const formattedDate = due_date
    ? new Date(due_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No due date";

  return (
    <div className="campaign-card">
      <div className="card-top">
        <span className="card-id">#CMP-{campaign_id}</span>
        <span className={`card-status status-${normalizedStatus}`}>
          {normalizedStatus}
        </span>
      </div>

      <div className="card-header">
        <h2>{name}</h2>
      </div>

      <div className="card-body">
        <div className="meta-row">
          <span className="meta-icon" aria-hidden="true">📅</span>
          <span className="meta-text">{formattedDate}</span>
        </div>
      </div>

      <div className="card-actions">
        <Link to={`/campaigns/${campaign_id}`}>
          <button className="btn view">View details &rarr;</button>
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
