import { useEffect, useState } from "react";
import "./CreateCampaign.css";
import { Link, useNavigate, useParams } from "react-router-dom";

function UpdateCampaign() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [due_date, setDueDate] = useState("");
  
  
  
  useEffect(() => {
    if (!id) return;
    const fetchCampaign = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/campaings/${id}`,{
          method: "GET",
        }
      );

        const data = await res.json();
        console.log("Fetched:", data);

        const campaign = data.data; 

        setName(campaign.name || "");
        setDueDate(
          campaign.due_date
            ? new Date(campaign.due_date).toISOString().slice(0, 16)
            : ""
        );
      } catch (error) {
        console.error("Error fetching campaign:", error);
      }
    };

    fetchCampaign();
  }, [id]);

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = {
      name,
      due_date: due_date || null,
    };

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/campaings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      console.log("Update:", data);

      alert("Campaign Updated!");
      navigate("/");
    } catch (error) {
      console.error("Error updating campaign:", error);
      alert("Update failed!");
    }
  };

  return (
    <div className="maincreate">
      <Link to={"/"}>
        <button className="rbtn">Return</button>
      </Link>

      <div className="form-container">
        <h2>Update Campaign</h2>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Campaign Name :
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <br /><br />

          <label>
            Due Date :
            <input
              type="datetime-local"
              value={due_date}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>

          <br /><br />

          <button className="sbtn" type="submit">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCampaign;
//   const fetchCampaign = async () => {
  //     try {
  //       const res = await fetch(`http://127.0.0.1:8000/campaings/{id}`);
  //       const data = await res.json();

  //       console.log("Fetched:", data);

  //       setName(data.name || "");
  //       setDueDate(
  //         data.due_date
  //           ? new Date(data.due_date).toISOString().slice(0, 16) 
  //           : ""
  //       );
  //     } catch (error) {
  //       console.error("Error fetching campaign:", error);
  //     }
  //   fetchCampaign();