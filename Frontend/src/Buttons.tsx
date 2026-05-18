import { Link } from "react-router-dom";
import './Buttons.css';

type Props = {
  onNext?: React.MouseEventHandler<HTMLButtonElement>;
  onPrev?: React.MouseEventHandler<HTMLButtonElement>;
};

function Buttons({ onNext, onPrev }: Props){
    
    return(
        <div className="Bcontainer">
        <div className="left">
            <Link to="/create">
                <button className="btn">Create new Campaign</button>
            </Link>
            
        </div>
        <div className="right">
            <button className="btn" onClick={onNext}>Next</button>
            <button className="btn" onClick={onPrev}>Prev</button>
        </div>
        </div>
    )
}
export default Buttons;