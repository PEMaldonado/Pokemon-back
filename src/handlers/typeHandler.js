const { getType } = require("../controllers/typeController");

const getTypeHandler = async (req, res) => {
  try {
    const types = await getType();
    res.status(200).json(types);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getTypeHandler };
