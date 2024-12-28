import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainView from "./views/MainView/MainView";
import PokemonDetailsView from "./views/PokemonDetailsView/PokemonDetailsView";
import "./styles/global.css";

function AppEntry() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/pokemon/:name" element={<PokemonDetailsView />} />
      </Routes>
    </Router>
  );
}

export default AppEntry;
