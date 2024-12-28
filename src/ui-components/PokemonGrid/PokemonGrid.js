// src/ui-components/PokemonGrid/PokemonGrid.js

import React from 'react';
import PokemonItem from '../PokemonItem';

const PokemonGrid = ({ data }) => {
  return (
    <div className="pokemon-grid">
      {data.map(pokemon => (
        <PokemonItem key={pokemon.name} pokemon={pokemon} />
      ))}
    </div>
  );
};

export default PokemonGrid;
