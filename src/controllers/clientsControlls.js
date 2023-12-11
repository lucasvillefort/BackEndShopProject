const databaseConnection = require("../database/databaseConnections.js");

const clientRegisterByUser = async (req, res) => {
  const { id } = req.usuario;
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;
  try {
    const foundClientSameEmail = await databaseConnection.query(
      "select * from clientes where email = $1",
      [email]
    );
    if (foundClientSameEmail.rowCount > 0) {
      return res
        .status(400)
        .json({ mensagem: "Esse email ja consta no nosso banco de dados" });
    }
    const foundClientSameCPF = await databaseConnection.query(
      "select * from clientes where cpf = $1",
      [cpf]
    );
    if (foundClientSameCPF.rowCount > 0) {
      return res
        .status(400)
        .json({ messagem: "Esse CPF ja consta no nosso banco de dados" });
    }

    //----------------------------------------------------------------------------------------------------
    const registedClient = await databaseConnection.query(
      "insert into clientes (nome, email, cpf, cep, rua, numero, bairro, cidade, estado, usuarios_id) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
      [nome, email, cpf, cep, rua, numero, bairro, cidade, estado, Number(id)]
    );
    return res.status(201).json({
      mensagem: `Cliente registrado com sucesso pelo usuario com o id: ${id}`,
    });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const idClientAlteration = async (req, res) => {
  const { id } = req.params;
  if (!Number(id) || Number(id) == 0) {
    return res
      .status(400)
      .json({ messagem: "ha alguma coisa de errado com o id informado " });
  }
  const { nome, email, cpf } = req.body;
  const { id: userIt, ...notUser } = req.usuario;
  try {
    const foundId = await databaseConnection.query(
      "select * from clientes where id=$1 ",
      [Number(id)]
    );
    const emailFound = await databaseConnection.query(
      "select from clientes where email=$1",
      [email]
    );
    const cpfFound = await databaseConnection.query(
      "select from clientes where cpf=$1",
      [cpf]
    );
    if (foundId.rowCount === 0) {
      return res.status(400).json({
        messagem: `Esse ID <${id}> mencionado nao consta em nosso banco de dados`,
      });
    }

    if (emailFound.rowCount > 0) {
      return res
        .status(400)
        .json({ messagem: "Esse email ja consta no banco de dados" });
    }
    if (cpfFound.rowCount > 0) {
      return res
        .status(400)
        .json({ messagem: "Esse CPF ja consta no banco de dados" });
    }

    //----------------------------------------------------------------------------------------------------------
    if (nome) {
      let AtualizacaoTransacao = await databaseConnection.query(
        "UPDATE clientes set nome = $1 where id = $2 ",
        [nome, id]
      );
    }
    if (email) {
      let AtualizacaoTransacao = await databaseConnection.query(
        "UPDATE clientes set email = $1  where id = $2",
        [email, id]
      );
    }
    if (cpf) {
      let AtualizacaoTransacao = await databaseConnection.query(
        "UPDATE clientes set cpf = $1  where id = $2",
        [cpf, id]
      );
    }
    return res.status(200).json({
      mensagem: `Alteracoes realizadas no cliente de ID <${id}> feitas com sucesso`,
    });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const clientsArray = async (req, res) => {
  try {
    const FoundClientsArray = await databaseConnection.query(
      "select id, nome, email, cpf, cep, rua, numero, bairro, cidade, estado  from clientes"
    );
    if (FoundClientsArray.rowCount > 0) {
      return res.status(200).json(FoundClientsArray.rows);
    } else if (FoundClientsArray.rowCount === 0) {
      return res.status(404).json({
        mensagem: "Nao consta nenhum cliente em nosso banco de dados",
      });
    }
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const clientRegistedForUser = async (req, res) => {
  const { id } = req.params;

  if (!Number(id) || Number(id) === 0) {
    return res.status(400).json({
      mensagem:
        "Parametro usado e invalido. Voce deve colocar apenas numeros inteiros e maior que zero",
    });
  }

  try {
    const UserClientsArray = await databaseConnection.query(
      "select id, nome, email, cpf, cep, rua, numero, bairro, cidade, estado from clientes where id=$1",
      [Number(id)]
    );
    if (UserClientsArray.rowCount > 0) {
      return res.status(200).json(UserClientsArray.rows);
    } else {
      return res.status(400).json({
        mensagem: `Nao consta para esse usuario um cliente com ID <${id}>`,
      });
    }
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};
module.exports = {
  clientRegisterByUser,
  idClientAlteration,
  clientsArray,
  clientRegistedForUser,
};
