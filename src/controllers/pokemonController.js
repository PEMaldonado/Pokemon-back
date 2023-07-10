const axios = require("axios");
const { Pokemon, Type } = require("../db");
const { Op } = require("sequelize");

const pokemonFormater = (pokemon) => {
  const pokemonFormateado = {
    id: pokemon.id,
    name: pokemon.name,
    image:
      pokemon.sprites.other.dream_world.front_default ||
      pokemon.sprites.other.home.front_default,
    life: pokemon.stats[0].base_stat,
    attack: pokemon.stats[1].base_stat,
    defense: pokemon.stats[2].base_stat,
    speed: pokemon.stats[5].base_stat,
    height: pokemon.height,
    weight: pokemon.weight,
    type: pokemon.types.map((element) => element.type.name).join(", "),
    created: false,
  };
  return pokemonFormateado;
};

const getAllPokemons = async (offset) => {
  const pokemons = (
    await axios.get(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=50`
    )
  ).data.results;

  const pokemonData = await Promise.all(
    pokemons.map(async (pokemon) => (await axios.get(pokemon.url)).data)
  );

  const pokemonsInfo = pokemonData.map((pokemon) => pokemonFormater(pokemon));

  const dbPokemons = await Pokemon.findAll({
    include: { model: Type, through: { attributes: [] } },
  });
  return [...dbPokemons, ...pokemonsInfo];
};

const getPokemonsByName = async (name) => {
  let creado = true;
  let pokemons = await Pokemon.findAll({
    where: {
      name: {
        [Op.iLike]: `%${name}%`,
      },
    },
    include: { model: Type, through: { attributes: [] } },
  });
  if (pokemons.length === 0) {
    creado = false;
    pokemons = (
      await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
    ).data;
  }

  if (creado) {
    return pokemons;
  } else {
    return pokemonFormater(pokemons);
  }
};

const getPokemonsById = async (idPokemon, idType) => {
  const pokemon =
    idType === "api"
      ? (await axios.get(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)).data
      : await Pokemon.findByPk(idPokemon, {
          include: { model: Type, through: { attributes: [] } },
        });

  if (idType !== "api") return pokemon;
  const pokemonInfo = pokemonFormater(pokemon);

  return pokemonInfo;
};

const createPokemon = async (pokemon) => {
  const { name, image, life, attack, defense, speed, height, weight, types } =
    pokemon;

  const typeIds = [];

  for (let i = 0; i < types.length; i++) {
    const typeInDb = await Type.findOne({
      where: {
        name: {
          [Op.iLike]: `%${types[i]}%`,
        },
      },
    });

    if (typeInDb) {
      typeIds.push(typeInDb.id);
    }
  }

  const newPokemon = await Pokemon.create({
    name,
    image,
    life,
    attack,
    defense,
    speed,
    height,
    weight,
  });
  await newPokemon.addTypes(typeIds);

  return newPokemon;
};

module.exports = {
  createPokemon,
  getPokemonsById,
  getPokemonsByName,
  getAllPokemons,
};
