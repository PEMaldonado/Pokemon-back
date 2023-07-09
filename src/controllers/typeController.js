const { Type } = require("../db");
const axios = require("axios");

const getType = async () => {
  const typesApi = (await axios.get(`https://pokeapi.co/api/v2/type`)).data
    .results;
  const types = typesApi.map((type) => ({
    name: type.name,
  }));
  const count = await Type.count();

  if (count === 0) {
    await Type.bulkCreate(types);
  }

  return types;
};

module.exports = { getType };
