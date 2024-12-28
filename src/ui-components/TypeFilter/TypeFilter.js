import React, { useState, useEffect } from "react";
import "./TypeFilterStyles.css"; 

const TypeFilter = ({ selectedType, onTypeChange }) => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/type");
        const data = await response.json();
        setTypes(data.results);
      } catch (error) {
        console.error("Error fetching Pokémon types", error);
      }
    };

    fetchTypes();
  }, []);

  return (
    <div style={{ marginBottom: "20px" }}>
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", width: "300px" }}
      >
        <option value="">All Types</option>
        {types.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TypeFilter;
