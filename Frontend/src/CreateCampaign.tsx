
import { useState } from "react";
import './CreateCampaign.css';
import { Link } from "react-router-dom";

function CreateCampaign() {
  const [name, setname] = useState("");
  const [due_date, setDue_date] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name,
      due_date: due_date || null,
    }
    const res = await fetch("http://127.0.0.1:8000/campaings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    console.log("Created:", data);

    alert("Campaign created!");
  };

  return (
    <div className="maincreate">
      <Link to={"/"}>
        <button className="rbtn">Return</button>
      </Link>
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
          <button className="sbtn" type="submit">Create</button>
        </form>
      </div>
    </div>
  )
};
export default CreateCampaign;
