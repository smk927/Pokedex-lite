import React from "react";
import "./SidebarStyles.css"; 

function Sidebar({ favorites, toggleSidebar, isSidebarVisible, toggleFavorite }) {
  return (
    <div className={`sidebar ${isSidebarVisible ? "visible" : ""}`}>
      <div className="sidebar-content">
        <button className="close-btn" onClick={toggleSidebar}>
          &times;
        </button>
        <h2>Your Favorites</h2>
        <div className="favorites-list">
          {favorites.length > 0 ? (
            favorites.map((p) => (
              <div key={p.id} className="favorite-item">
                <img src={p.sprites.front_default} alt={p.name} className="favorite-img" />
                <div className="favorite-info">
                  <h3>{p.name}</h3>
                  <p>Types: {p.types.map((type) => type.type.name).join(", ")}</p>
                  <button
                    onClick={() => toggleFavorite(p.id)}
                    className="unfavorite-btn"
                  >
                    Unfavorite
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No favorites yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
