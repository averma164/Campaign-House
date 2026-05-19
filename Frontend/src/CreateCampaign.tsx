
import { useState } from "react";
import './CreateCampaign.css';
import { Link, useNavigate } from "react-router-dom";

function CreateCampaign() {
  const [name, setname] = useState("");
  const [due_date, setDue_date] = useState("");
  const navigate = useNavigate();
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name,
      due_date: due_date || null,
      description: description || null,
    };
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:8000/campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      const message = errorData?.detail || "Failed to create campaign.";
      alert(message);
      return;
    }

    const data = await res.json();
    console.log("Created:", data);

    alert("Campaign created!");
    navigate("/campaigns");
  };

  return (
    <div className="maincreate">
      
      <div className="form-container">

        <h2 >Create New Campaign</h2>

        <form onSubmit={handleSubmit} className="form">
          <br />
          <label>
            Campaign Name :
            <input
              type="text"
              value={name}
              onChange={(e) => setname(e.target.value)}
              required
            />
            <br />
          </label>
          <br /><br />
          <label>
            Due Date :
            <input
              type="datetime-local"
              value={due_date}
              onChange={(e) => setDue_date(e.target.value)}
            />
            <br />
          </label>
          <br /><br />
          <label>
            Campaign Description :
            <input
              type="textArea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <br /><br />
          <Link to={"/campaigns"}>
        <button className="rbtn">Return</button>
      </Link>
          <button className="sbtn" type="submit">Create</button>
        </form>
      </div>
    </div>
  )
};
export default CreateCampaign;
