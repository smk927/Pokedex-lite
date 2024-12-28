import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainView from "./views/MainView/MainView";
import PokemonDetailsView from "./views/PokemonDetailsView/PokemonDetailsView";
import "./styles/global.css";
import "./styles/pageTransition.css";  // Import the page transition CSS

function AppEntry() {
  return (
    <Router>
      <div className="page-transition-container">
        <Routes>
          <Route path="/" element={<MainView />} />
          <Route path="/pokemon/:name" element={<PokemonDetailsView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppEntry;
