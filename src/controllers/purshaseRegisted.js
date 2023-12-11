const databaseConnection = require("../database/databaseConnections.js");

const orderArray = async (req, res) => {
  const { cliente_id } = req.query;

  if (!cliente_id) {
    try {
      const arrayResulted = [];
      const fullOrderArray = await databaseConnection.query(
        "select * from pedidos"
      );
      if (fullOrderArray.rowCount === 0) {
        return res
          .status(404)
          .json({ mensagem: "nenhum pedidos foi encontrado" });
      }
      for (let each of fullOrderArray.rows) {
        const orderId = each.id;
        const fullOrderArrayPedido_Produtos = await databaseConnection.query(
          "select * from pedido_produtos where pedido_id = $1",
          [orderId]
        );
        arrayResulted.push({
          pedido: each,
          pedido_produtos: fullOrderArrayPedido_Produtos.rows,
        });
      }
      return res.status(200).json(arrayResulted);
    } catch (error) {
      return res.status(400).json(`mensagem: ${error.message}`);
    }
  } else {
    try {
      const foundIdClient = await databaseConnection.query(
        "select * from clientes where id=$1",
        [cliente_id]
      );
      if (foundIdClient.rowCount === 0) {
        return res.status(404).json({
          mensagem: `Cliente com o ID <${cliente_id}> nao foi encontrado em nosso banco de dados para poder pesquisar sobre pedidos`,
        });
      }
      const clientOrderArray = await databaseConnection.query(
        "select * from pedidos where cliente_id = $1",
        [Number(cliente_id)]
      );
      if (clientOrderArray.rowCount === 0) {
        return res.status(404).json({
          mensagem: `nenhum produto foi encontrado para o cliente <${cliente_id}>`,
        });
      }
      //--------------------------------------------
      const arrayResulted = [];
      for (let each of clientOrderArray.rows) {
        const orderId = each.id;
        const fullOrderArrayPedido_Produtos = await databaseConnection.query(
          "select * from pedido_produtos where pedido_id = $1",
          [orderId]
        );
        arrayResulted.push({
          pedido: each,
          pedido_produtos: fullOrderArrayPedido_Produtos.rows,
        });
      }
      return res.status(200).json(arrayResulted);
    } catch (error) {
      return res.json({ mensagem: error.message });
    }
  }
};
module.exports = { orderArray };
