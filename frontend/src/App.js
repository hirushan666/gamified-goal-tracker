import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import GoalsPage from "./pages/GoalsPage";
import FriendsPage from "./pages/FriendsPage";
import ChallengesPage from "./pages/ChallengesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
