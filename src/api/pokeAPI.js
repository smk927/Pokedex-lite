import axios from "axios";

const API_BASE_URL = "https://pokeapi.co/api/v2/";

export const fetchPokemonList = async (limit = 20, offset = 0) => {
  try {
    const response = await axios.get(`${API_BASE_URL}pokemon`, {
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch Pokémon list.");
  }
};

export const fetchPokemonDetails = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}pokemon/${name}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch details for ${name}.`);
  }
};

// Fetch available Pokémon types dynamically
export const fetchPokemonTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}type`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch Pokémon types.");
  }
};
