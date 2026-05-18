import { Link } from 'react-router-dom';
import './CampaignCard.css'
type Props = {
  campaign_id: number;
  name: string;
  due_date: string | null;
  onDelete: (id: number)=>void;
};

const CampaignCard = ({ campaign_id, name, due_date, onDelete }: Props) => {
  return (
    <div  className="CampaignCard">
      <div className='heading'>      
        <h2 className='h2'>{name}</h2>
      </div>
      <div className='description'>
        <p>ID: {campaign_id}</p>
        <p>Due: {due_date ? new Date(due_date).toLocaleString() : "No due date"}</p>
      </div>
      <div className='cardbtns'>
        <button className='dbtn' onClick={() => onDelete(campaign_id)}>Delete</button>
        <Link to= {`/update/${campaign_id}`}>
        <button className='ubtn'>Update</button>
        </Link>
      </div>
      
    </div>
  );
};

export default CampaignCard;
``


