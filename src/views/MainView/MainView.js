import React, { useState, useEffect } from "react";
import { fetchPokemonList, fetchPokemonDetails, fetchPokemonTypes } from "../../api/pokeAPI";
import PaginationControls from "../../ui-components/PaginationControls/PaginationControls";
import Sidebar from "../../ui-components/Sidebar/Sidebar"; 
import { usePersistentStorage } from "../../custom-hooks/usePersistentStorage";
import "./MainViewStyles.css";
function MainView() {
  const [pokemon, setPokemon] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPokemon, setTotalPokemon] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = usePersistentStorage("favorites", []);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); 

  const pokemonPerPage = 20;

  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setLoading(true);
        const data = await fetchPokemonList(pokemonPerPage, currentPage * pokemonPerPage);
        setTotalPokemon(data.count);
        setPokemon(data.results);

        const detailedPokemon = await Promise.all(
          data.results.map(async (pokemon) => {
            const details = await fetchPokemonDetails(pokemon.name);
            return details;
          })
        );
        setPokemonDetails(detailedPokemon);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const loadTypes = async () => {
      try {
        const data = await fetchPokemonTypes();
        setTypes(data.results);
      } catch (err) {
        setError(err.message);
      }
    };

    loadPokemon();
    loadTypes();
  }, [currentPage]);

  const filteredPokemon = pokemonDetails.filter((p) => {
    const matchesType = selectedType === "" || p.types.some((type) => type.type.name === selectedType);
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const favoritedPokemon = pokemonDetails.filter((p) => favorites.includes(p.id));

  const toggleFavorite = (pokemonId) => {
    const newFavorites = favorites.includes(pokemonId)
      ? favorites.filter((id) => id !== pokemonId)
      : [...favorites, pokemonId];

    setFavorites(newFavorites);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-container">
      <h1 className="heading">Pokedex Lite</h1>
  
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "red",
          padding: "10px",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isSidebarVisible ? "Close Favorites" : "Show Favorites"}
      </button>
  
      {/* Sidebar */}
      <Sidebar
        favorites={favoritedPokemon}
        toggleSidebar={toggleSidebar}
        isSidebarVisible={isSidebarVisible}
        toggleFavorite={toggleFavorite}
      />
  
      {/* Search Box */}
      <div>
        <label htmlFor="search">Search by Name: </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Pokémon..."
          style={{ marginLeft: "10px" }}
        />
      </div>
  
      {/* Type Filter Dropdown */}
      <div style={{ marginTop: "10px" }}>
        <label htmlFor="typeFilter">Filter by Type: </label>
        <select
          id="typeFilter"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type.name} value={type.name}>
              {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            </option>
          ))}
        </select>
      </div>
  
      {/* Pokémon Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {filteredPokemon.map((p) => (
          <div key={p.id} style={{ border: "2px solid #fff", padding: "10px", textAlign: "center" }}>
            <img
              src={p.sprites.front_default}
              alt={p.name}
              style={{ width: "125px", height: "125px" }}
            />
            <h3>{p.name}</h3>
            <p>Types: {p.types.map((type) => type.type.name).join(", ")}</p>
  
            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(p.id)}
              style={{
                backgroundColor: favorites.includes(p.id) ? "#f30611" : "#4caf50",
                padding: "5px 10px",
                border: "none",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              {favorites.includes(p.id) ? "Unfavorite" : "Favorite"}
            </button>
  
            <a href={`/pokemon/${p.name}`} style={{ display: "block", marginTop: "10px" }}>
              Details
            </a>
          </div>
        ))}
      </div>
  
      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalItems={totalPokemon}
        itemsPerPage={pokemonPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
  
}

export default MainView;
