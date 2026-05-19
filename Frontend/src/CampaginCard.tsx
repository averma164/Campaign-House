import { Link } from "react-router-dom";
import "./CampaignCard.css";

type Props = {
  campaign_id: number;
  name: string;
  due_date: string | null;
  status?: string;
};

const CampaignCard = ({ campaign_id, name, due_date, status }: Props) => {
  return (
    <div className="campaign-card">

      <div className="card-header">
        <h2>{name}</h2>
      </div>

      <div className="card-body">
        <p>🆔 {campaign_id}</p>
        <p>📊 {status}</p>
        <p>
          📅 {due_date
            ? new Date(due_date).toLocaleDateString()
            : "No due date"}
        </p>
      </div>

      <div className="card-actions">
        <Link to={`/campaigns/${campaign_id}`}>
          <button className="btn view">View</button>
        </Link>
      </div>

    </div>
  );
};

export default CampaignCard;