import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Landing";
import Handdraw from "./Handdraw";
import Footer from "./Footer";

function App() {
  const appStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  const contentStyle = {
    flex: 1,
  };

  return (
    <BrowserRouter>
      <div style={appStyle}>
        <div style={contentStyle}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/draw"
              element={
                <div className="App">
                  <h3
                    style={{
                      position: "absolute",
                      top: "20px",
                      left: "40%",
                      transform: "translateX(-50%)",
                      zIndex: 3,
                      color: "lightpink",
                    }}
                  >
                    🫧have fun using beadoodle🫧
                  </h3>
                  <Handdraw />
                </div>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
