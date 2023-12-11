const databaseConnection = require("../database/databaseConnections.js");

const categoriesList = async (req, res) => {
  try {
    const foundCategorie = await databaseConnection.query(
      "select * from categorias"
    );
    if (foundCategorie.rowCount == 0) {
      return res
        .status(404)
        .json({ mensagem: "Nao ha categorias cadastradas" });
    }
    return res.status(200).json(foundCategorie.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: error.mensagem });
  }
};

module.exports = {
  categoriesList,
};
