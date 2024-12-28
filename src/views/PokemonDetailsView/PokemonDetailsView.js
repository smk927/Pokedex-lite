import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchPokemonDetails } from "../../api/pokeAPI";

function PokemonDetailsView() {
  const { name } = useParams(); // Get the Pokémon name from the URL
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{pokemon.name}</h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <div>
        <h3>Stats</h3>
        <ul>
          <li>HP: {pokemon.stats[0].base_stat}</li>
          <li>Attack: {pokemon.stats[1].base_stat}</li>
          <li>Defense: {pokemon.stats[2].base_stat}</li>
          <li>Speed: {pokemon.stats[5].base_stat}</li>
        </ul>
      </div>
      <div>
        <h3>Abilities</h3>
        <ul>
          {pokemon.abilities.map((ability) => (
            <li key={ability.ability.name}>{ability.ability.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PokemonDetailsView;
