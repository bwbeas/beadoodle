import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css"; // Create this file for styling

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="overlay-content">
        <h1 className="landing-title"><i>Draw your own filter stickers at</i> <spawn>🫧beadoodle🫧</spawn></h1>
        <h3 className="landing-subtitle">have you been the person who never liked the available stickers at any webcam app? wouldn't it be more fun if you could draw your own ones?</h3>
        <h4 className="landing-subtitle-2">[works best on desktop 🍒]</h4>
        <button className="landing-button" onClick={() => navigate("/draw")}>
          🫧open camera🫧
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
