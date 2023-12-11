const databaseConnection = require("../database/databaseConnections.js");
const compiladorHtml = require("../utils/compilator");
const sgMail = require("@sendgrid/mail");

const purchaseOrderRegister = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;

  if (pedido_produtos.length === 0) {
    return res.status(400).json({
      mensagem: `E preciso que haja pedido`,
    });
  }
  for (let product of pedido_produtos) {
    if (
      !Number(product.produto_id) ||
      product.produto_id < 1 ||
      !Number(product.quantidade_produto) ||
      product.quantidade_produto < 1
    ) {
      return res.status(400).json({
        mensagem: `Os Campos produto_id e quantidade_produto precisam ser numeros maiores que zero `,
      });
    }
  }
  try {
    const foundIdClient = await databaseConnection.query(
      "select * from clientes where id=$1",
      [cliente_id]
    );
    if (foundIdClient.rowCount === 0) {
      return res.status(404).json({
        mensagem: `Cliente com o ID <${cliente_id}> nao foi encontrado em nosso banco de dados`,
      });
    }
    const orderArray = [];
    let buyValue = 0;
    const productHowMany = [];
    for (let purchase of pedido_produtos) {
      const foundProduct = await databaseConnection.query(
        "select * from produtos where id=$1",
        [purchase.produto_id]
      );
      if (!purchase.produto_id) {
        return res.status(400).json({
          mensagem: `E preciso colocar o produto_id`,
        });
      }
      if (!purchase.quantidade_produto) {
        return res.status(400).json({
          mensagem: `E preciso colocar o quantidade_produto`,
        });
      }
      if (foundProduct.rowCount === 0) {
        return res.status(404).json({
          mensagem: `Produto com o ID <${purchase.produto_id}> nao foi encontrado em nosso banco de dados`,
        });
      }
      if (
        foundProduct.rows[0].quantidade_estoque < purchase.quantidade_produto
      ) {
        return res.status(404).json({
          mensagem: `Tem apenas <${foundProduct.rows[0].quantidade_estoque}> desse produto com o ID <${purchase.produto_id}> em estoque. Compra nao efetuada. Valor requerido superior `,
        });
      }
      const storeRest =
        foundProduct.rows[0].quantidade_estoque - purchase.quantidade_produto;
      await databaseConnection.query(
        "UPDATE produtos set quantidade_estoque = $1 where id = $2 ",
        [storeRest, purchase.produto_id]
      );
      orderArray.push(purchase);
      buyValue += foundProduct.rows[0].valor * purchase.quantidade_produto;
      productHowMany.push(foundProduct.rows[0].valor);
    }

    const idReturn = await databaseConnection.query(
      "insert into pedidos(cliente_id, observacao, valor_total) values ($1,$2,$3) returning*",
      [Number(cliente_id), observacao, Number(buyValue)]
    );

    for (let i = 0; i < orderArray.length; i++) {
      const idOfOrder = idReturn.rows[0].id;
      const idProductOrder = orderArray[i].produto_id;
      const howManyProduct = orderArray[i].quantidade_produto;
      const howcastProduct = productHowMany[i];

      await databaseConnection.query(
        "insert into pedido_produtos (pedido_id, produto_id, quantidade_produto, valor_produto) values ($1,$2,$3,$4)",
        [
          Number(idOfOrder),
          Number(idProductOrder),
          Number(howManyProduct),
          Number(howcastProduct),
        ]
      );
    }

    if (!observacao) {
      const orderResulted = { cliente_id, orderArray };
      const html = await compiladorHtml("./src/templates/purchase.html", {
        cliente_id: `${idReturn.rows[0].cliente_id}`,
        observacao: "Nada declarado",
        valor_total: `${idReturn.rows[0].valor_total}`,
      });

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: `${foundIdClient.rows[0].email}`, // Change to your recipient
        from: `${process.env.EMAIL_FROM}`, // Change to your verified sender
        subject: "Voce acaba de comprar um novo produto",
        text: "Compra efetuada com sucesso",
        html: html,
      };
      sgMail
        .send(msg)
        .then(() => {
          return res.status(201).json(orderResulted);
        })
        .catch((error) => {
          return res.status(400).json(error.message);
        });
    } else if (observacao.length === 0) {
      return res.status(500).json({
        mensagem: "Voce selecionou o campo comentario vc precisa preenche-lo",
      });
    } else {
      const orderResulted = { cliente_id, observacao, orderArray };
      const html = await compiladorHtml("./src/templates/purchase.html", {
        cliente_id: `${idReturn.rows[0].cliente_id}`,
        observacao: `${idReturn.rows[0].observacao}`,
        valor_total: `${idReturn.rows[0].valor_total}`,
      });

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: `${foundIdClient.rows[0].email}`, // Change to your recipient
        from: `${process.env.EMAIL_FROM}`, // Change to your verified sender
        subject: "Voce acaba de comprar um novo produto",
        text: "Compra efetuada com sucesso",
        html: html,
      };
      sgMail
        .send(msg)
        .then(() => {
          return res.status(201).json(orderResulted);
        })
        .catch((error) => {
          return res.status(400).json(error.message);
        });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
module.exports = { purchaseOrderRegister };
