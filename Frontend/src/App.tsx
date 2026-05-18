import { useEffect, useState } from "react";
import CampaignCard from "./CampaginCard";
import Buttons from "./Buttons";

import './App.css'
function App() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [nextUrl,setNextUrl] = useState<string | null>(null);
  const [prevStack,setPrevStack] = useState<any[][]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/campaings")
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data.data);
        setNextUrl(data.next);
      })
      .catch((err) => console.error("ERROR:", err));
  }, []);

  
  const fetchData = async (url: string, isNext = true) => {
    const res = await fetch(url);
    const data = await res.json();
    
    setCampaigns(data.data);
    if (isNext && nextUrl) {
      setPrevStack((prev) => [...prev, campaigns]);
    }
    setCampaigns(data.data);
    setNextUrl(data.next);
  };

  
  const handleNext = () => {
    if (nextUrl) {
      fetchData(nextUrl, true);
    }
  };

  const handlePrev = () => {
    if(prevStack.length === 0) return;
    const lastPage = prevStack[prevStack.length-1];
    setCampaigns(lastPage)
    setPrevStack((prev) => prev.slice(0,-1));
  }
  
  const handleDelete = async (id: number) => {
    const res = await fetch(`http://127.0.0.1:8000/campaigns/${id}`, {
      method: "DELETE",
    });

    if (res.status === 204) {
      setCampaigns((prev) => prev.filter((c) => c.campaign_id !== id));
      alert("Campaign Deleted!")
    } else {
      alert("Error deleting campaign");
    }
  };


  return (
    <div className="body">
      <h1 className="h1">Campaigns</h1>
      <div><Buttons onNext={handleNext} onPrev = {handlePrev}/></div>
      <div className="container">
        {campaigns.map((c) => (
            <CampaignCard key={c.campaign_id} campaign_id={c.campaign_id} name={c.name} due_date={c.due_date} onDelete = {handleDelete}/>
        ))}
        </div>
      </div>
  );
}

export default App; 