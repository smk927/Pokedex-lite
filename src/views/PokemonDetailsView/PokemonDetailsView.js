import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPokemonDetails } from "../../api/pokeAPI";
import "./PokemonDetailsView.css"; // Import the updated CSS file for styling

function PokemonDetailsView() {
  const { name } = useParams(); // Get the Pokémon name from the URL params
  const navigate = useNavigate(); // Hook to navigate back to the main view
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPokemonDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchPokemonDetails(name);
        setPokemon(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPokemonDetails();
  }, [name]);

  const handleClose = () => {
    navigate("/"); // Navigate back to the main page
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pokemon) return <div>No Pokémon found.</div>;

  // Extracting more data for the view
  const { sprites, stats, abilities, types, height, weight, moves, species } = pokemon;

  return (
    <div className="details-container fadeIn">
      <button onClick={handleClose}>← Back to List</button>

      <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>

      <div className="main-content">
        {/* Pokemon Sprite */}
        <div className="sprite-container">
          <h2>Sprites</h2>
          <img src={sprites.front_default} alt={pokemon.name} />
          <h3>Shiny Sprite</h3>
          <img src={sprites.front_shiny} alt={`${pokemon.name} Shiny`} />
        </div>

        {/* Pokémon Details */}
        <div className="details-container-right">
          {/* Stats */}
          <div className="details-list">
            <div>
              <h2>Stats</h2>
              <ul>
                {stats.map((stat) => (
                  <li key={stat.stat.name}>
                    <strong>{stat.stat.name}: </strong>
                    {stat.base_stat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Abilities */}
            <div>
              <h2>Abilities</h2>
              <ul>
                {abilities.map((ability) => (
                  <li key={ability.ability.name}>{ability.ability.name}</li>
                ))}
              </ul>
            </div>

            {/* Types */}
            <div>
              <h2>Types</h2>
              <ul>
                {types.map((type) => (
                  <li key={type.type.name}>{type.type.name}</li>
                ))}
              </ul>
            </div>

            {/* Height & Weight */}
            <div className="height-weight">
              <h2>Height & Weight</h2>
              <p>Height: {height / 10} meters</p>
              <p>Weight: {weight / 10} kg</p>
            </div>
          </div>

          {/* Moves */}
          <div className="moves">
            <h2>Moves</h2>
            <ul>
              {moves.slice(0, 10).map((move) => (
                <li key={move.move.name}>
                  {move.move.name.charAt(0).toUpperCase() + move.move.name.slice(1)}
                </li>
              ))}
            </ul>
          </div>

          {/* Species */}
          <div>
            <h2>Species</h2>
            <p>{species.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetailsView;
