import React, { useState, useEffect } from "react";
import { fetchPokemonList, fetchPokemonDetails, fetchPokemonTypes } from "../../api/pokeAPI";
import PaginationControls from "../../ui-components/PaginationControls/PaginationControls";
import Sidebar from "../../ui-components/Sidebar/Sidebar";
import { usePersistentStorage } from "../../custom-hooks/usePersistentStorage";
import { Link } from "react-router-dom"; // Import Link for navigation

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
    <div style={{ padding: "20px" }}>
      <h1>Pokedex Lite</h1>

      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "gold",
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

      {/* Pokémon List */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "20px" }}>
        {filteredPokemon.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center" }}>
            <h3>{p.name}</h3>
            <img src={p.sprites.front_default} alt={p.name} style={{ width: "100px", height: "100px" }} />
            <p>Types: {p.types.map((t) => t.type.name).join(", ")}</p>
            <p>HP: {p.stats.find((stat) => stat.stat.name === "hp")?.base_stat}</p>

            <button onClick={() => toggleFavorite(p.id)}>
              {favorites.includes(p.id) ? "Unfavorite" : "Favorite"}
            </button>

            <Link to={`/pokemon/${p.name}`} style={{ display: "block", marginTop: "10px" }}>
              Details
            </Link>
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
