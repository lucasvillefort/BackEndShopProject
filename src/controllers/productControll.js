const databaseConnection = require("../database/databaseConnections.js");
const { emailFunction, emailFunction2 } = require("../email/emailFunction.js");
const supabase = require("../email/sendEmail.js");
const newProductRegister = async (req, res) => {
  const { id } = req.usuario;
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

  if (!req.file) {
    try {
      const insertProducts = await databaseConnection.query(
        "insert into produtos (descricao, quantidade_estoque, valor, categoria_id, usuarios_id) values($1, $2, $3, $4, $5) returning *",
        [descricao, quantidade_estoque, valor, categoria_id, Number(id)]
      );
      const {
        path_image: notShow,
        id: notShow2,
        usuarios_id: notShow3,
        ...restTOShow
      } = insertProducts.rows[0];
      return res.status(201).json(restTOShow);
    } catch (error) {
      return res.status(400).json({
        mensagem: error.message,
      });
    }
  } else if (req.file) {
    try {
      const { originalname, mimetype, buffer } = req.file; // we need to have just this variable to send the image

      const insertProducts = await databaseConnection.query(
        "insert into produtos (descricao, quantidade_estoque, valor, categoria_id, usuarios_id ) values($1, $2, $3, $4, $5) returning *",
        [descricao, quantidade_estoque, valor, categoria_id, Number(id)]
      );
      const url = await emailFunction(
        insertProducts,
        originalname,
        buffer,
        mimetype
      );
      await databaseConnection.query(
        "UPDATE produtos set produto_imagem = $1 where id = $2 ",
        [url.urlImage, Number(insertProducts.rows[0].id)]
      );
      const updateProductWithImage = await databaseConnection.query(
        "UPDATE produtos set path_image = $1 where id = $2 returning *",
        [url.path_image, Number(insertProducts.rows[0].id)]
      );
      const {
        path_image: notShow,
        id: notShow2,
        usuarios_id: notShow3,
        ...restTOShow
      } = updateProductWithImage.rows[0];
      return res.status(201).json(restTOShow);
    } catch (error) {
      return res.status(500).json({ mensagem: error.message });
    }
  }
};

const productAltering = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const id = req.params.id;
  try {
    const foundId = await databaseConnection.query(
      "select * from produtos where id = $1",
      [Number(id)]
    );
    if (foundId.rowCount === 0) {
      return res.status(400).json({
        mensagem: "O <ID> colocado para o produto nao consta no banco de dados",
      });
    }
    if (descricao) {
      let AtualizacaoTransacao = await databaseConnection.query(
        "UPDATE produtos set descricao = $1 where id = $2",
        [descricao, id]
      );
    }
    if (quantidade_estoque) {
      let AtualizacaoTransacao = await databaseConnection.query(
        "UPDATE produtos set quantidade_estoque = $1 where id = $2",
        [quantidade_estoque, id]
      );
    }
    if (valor) {
      let AtualizacaoTransacao = await databaseConnection.query(
        "UPDATE produtos set valor = $1 where id = $2",
        [valor, id]
      );
    }
    if (categoria_id) {
      let AtualizacaoTransacao = await databaseConnection.query(
        "UPDATE produtos set categoria_id = $1 where id = $2",
        [categoria_id, id]
      );
    }
    if (req.file) {
      const { originalname, buffer, mimetype } = req.file;

      const idProduct = await databaseConnection.query(
        "select * from produtos where id = $1",
        [Number(id)]
      );
      const resulted = await supabase.storage
        .from("lastprojectteamcode21")
        .remove(`${idProduct.rows[0].path_image}`);

      const resulted_ = await emailFunction2(
        id,
        originalname,
        buffer,
        mimetype
      );
      const updateProductWithImage1 = await databaseConnection.query(
        "update produtos set produto_imagem = $1 where id = $2  returning * ",
        [resulted_.urlImage, idProduct.rows[0].id]
      );
      const updateProductWithImage2 = await databaseConnection.query(
        "update produtos set path_image = $1 where id = $2  returning * ",
        [resulted_.path_image, idProduct.rows[0].id]
      );
    }
    const idProduct2 = await databaseConnection.query(
      "select * from produtos where id = $1",
      [Number(id)]
    );
    const {
      path_image: notShow,
      id: notShow2,
      usuarios_id: notShow3,
      ...restTOShow
    } = idProduct2.rows[0];
    return res.status(200).json(restTOShow);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};
const productsArray = async (req, res) => {
  const { categoria_id } = req.query;

  if (!categoria_id) {
    try {
      const fixedArray = await databaseConnection.query(
        "select * from produtos"
      );
      if (fixedArray.rowCount === 0) {
        return res
          .status(200)
          .json({ mensagem: "nenhum produto foi encontrado" });
      }
      return res.status(200).json(fixedArray.rows);
    } catch (error) {
      return res.status(400).json({ mensagem: error.message });
    }
  } else {
    try {
      const fixedArray = await databaseConnection.query(
        "select * from produtos where categoria_id = $1",
        [Number(categoria_id)]
      );
      if (fixedArray.rowCount === 0) {
        return res
          .status(200)
          .json({ mensagem: "nenhum produto foi encontrado" });
      }
      return res.status(200).json(fixedArray.rows);
    } catch (error) {
      return res.status(400).json({ mensagem: error.message });
    }
  }
};

const idProductArray = async (req, res) => {
  const filtedProductId = req.params.id;
  const { id } = req.usuario;
  if (!filtedProductId) {
    return res.status(400).json({ mensagem: `ID errado informado` });
  }
  try {
    const fixedArray = await databaseConnection.query(
      "select * from produtos where id = $1 and usuarios_id = $2 ",
      [Number(filtedProductId), id]
    );
    if (fixedArray.rowCount === 0) {
      return res.status(200).json({
        menssage: `nenhum produto foi encontrado com o <${filtedProductId}> para esse usuario logado `,
      });
    }
    return res.status(200).json(fixedArray.rows);
  } catch (error) {
    return res.status(400).json({ mensagem: error.menssage });
  }
};
const idProductDelete = async (req, res) => {
  const { id } = req.usuario;
  const filtedProductId = req.params.id;

  try {
    const foundProductById = await databaseConnection.query(
      "select * from produtos where id = $1",
      [Number(filtedProductId)]
    );
    if (foundProductById.rowCount === 0) {
      return res.status(400).json({
        mensagem: "Produto para esse id nao foi encontrado",
      });
    }
    const orderedProductById = await databaseConnection.query(
      "select * from pedido_produtos where produto_id = $1",
      [Number(filtedProductId)]
    );
    if (orderedProductById.rowCount !== 0) {
      return res.status(400).json({
        mensagem:
          "O produto encontrasse em varios pedido, portanto nao pode ser deletado",
      });
    }
    const deleteProductById = await databaseConnection.query(
      "DELETE FROM produtos WHERE id = $1 RETURNING * ",
      [Number(filtedProductId)]
    );
    await supabase.storage
      .from("lastprojectteamcode21")
      .remove(`${foundProductById.rows[0].path_image}`);
    return res.status(200).json({
      mensagem: "produto deletado com sucesso",
    });
  } catch (error) {
    return res.status(400).json({ mensagem: error.menssage });
  }
};

module.exports = {
  newProductRegister,
  productAltering,
  productsArray,
  idProductArray,
  idProductDelete,
};
