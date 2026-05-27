
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
import AppShell from "./AppShell";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/campaigns" element={<AppShell><App /></AppShell>} />
      <Route path="/campaigns/:id" element={<AppShell><ShowCampaign /></AppShell>} />
      <Route path="/about" element={<AppShell><About /></AppShell>} />
      <Route path="/create" element={<AppShell><CreateCampaign /></AppShell>} />
      <Route path="/update/:id" element={<AppShell><UpdateCampaign /></AppShell>} />
      <Route path="/analytics" element={<AppShell><Analytics /></AppShell>} />
      <Route path="/profile" element={<AppShell><Profile /></AppShell>} />
      <Route path="/notifications" element={<AppShell><Notifications /></AppShell>} />
    </Routes>
  </BrowserRouter>
);
