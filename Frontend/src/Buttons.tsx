import { Link, useNavigate } from "react-router-dom";
import './Buttons.css';

type Props = {
    onNext?: React.MouseEventHandler<HTMLButtonElement>;
    onPrev?: React.MouseEventHandler<HTMLButtonElement>;
    showCreate?: boolean;
    showPager?: boolean;
};

function Buttons({ onNext, onPrev, showCreate = true, showPager = true }: Props){
        const navigate = useNavigate();

        const handleLogout = () => {
            localStorage.removeItem("token");
            navigate("/login");
        };

        return(
                <div className="Bcontainer">
                    {showCreate && (
                        <div className="left">
                            <Link to="/create">
                                <button className="btn create">Create new Campaign</button>
                            </Link>
                            <Link to="/about">
                                <button className="btn about">About</button>
                            </Link>
                            <button className="btn logout" onClick={handleLogout}>Logout</button>
                        </div>
                    )}

                    {showPager && (
                        <div className="right">
                            <button className="btn pager" onClick={onPrev}>Prev</button>
                            <button className="btn pager" onClick={onNext}>Next</button>
                        </div>
                    )}
                </div>
        )
}

export default Buttons;