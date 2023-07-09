const {
  getPokemonsByName,
  getAllPokemons,
  getPokemonsById,
  createPokemon,
} = require("../controllers/pokemonController");

const getPokemonsHandler = async (req, res) => {
  const { name, offset } = req.query;

  try {
    if (name) {
      const pokemons = await getPokemonsByName(name);
      res.status(200).json(pokemons);
    } else {
      const pokemons = await getAllPokemons(offset);
      res.status(200).json(pokemons);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPokemonByIdHandler = async (req, res) => {
  const { idPokemon } = req.params;

  const idType = isNaN(idPokemon) ? "bdd" : "api";

  try {
    const pokemon = await getPokemonsById(idPokemon, idType);
    res.status(200).json(pokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createPokemonHandler = async (req, res) => {
  const pokemon = req.body;
  try {
    const newPokemon = await createPokemon(pokemon);
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getPokemonsHandler,
  getPokemonByIdHandler,
  createPokemonHandler,
};
