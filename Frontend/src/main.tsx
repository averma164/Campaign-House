
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./theme.css";
import App from "./App";
import CreateCampaign from "./CreateCampaign";
import ReactDOM from "react-dom/client";
import UpdateCampaign from "./UpdateCampaign";
import Index from "./Index";
import Login from "./Login";
import Signup from "./Signup"
import About from "./About";
import ShowCampaign from "./ShowCampaign";
import Analytics from "./Analytics";
import Profile from "./Profile";
import Notifications from "./Notifications";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/campaigns" element={<App />} />
      <Route path="/campaigns/:id" element={<ShowCampaign />} />
      <Route path="/about" element={<About />} />
      <Route path="/create" element={<CreateCampaign />} />
      <Route path="/update/:id" element={<UpdateCampaign />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  </BrowserRouter>
);
