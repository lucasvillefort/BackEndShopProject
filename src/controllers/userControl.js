const databaseConnection = require("../database/databaseConnections.js");
const bcrypt = require("bcrypt"); // to create the hash of password
const jwt = require("jsonwebtoken"); // to create a token (assignature) to allow a user do something
const senhajwt = require("../senhajwt.js"); // this password is necessary to validation the creation of the token

const userRegister = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const foundEmail = await databaseConnection.query(
      "select * from usuarios where email = $1",
      [email]
    );

    if (foundEmail.rowCount > 0) {
      return res.status(400).json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }

    const encryptedPassword = await bcrypt.hash(senha, 10);
    const newUser = await databaseConnection.query(
      "insert into usuarios (nome, email, senha) values ($1, $2, $3) returning*",
      [nome, email, encryptedPassword]
    );
    const resToRequest = await databaseConnection.query(
      "select id, nome, email from usuarios where email = $1",
      [email]
    );
    return res.status(201).json(resToRequest.rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: error.mensagem });
  }
};

const userLogin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const founduser = await databaseConnection.query(
      "select * from usuarios where email = $1",
      [email]
    );
    if (founduser.rowCount < 1) {
      return res
        .status(404)
        .json({ mensagem: "usuario ou senha incorretos. tente novamente" });
    }
    const validPassword = await bcrypt.compare(senha, founduser.rows[0].senha);
    if (!validPassword) {
      return res
        .status(400)
        .json({ mensagem: "usuario ou senha incorretos. tente novamente " });
    }
    const tokenToUser = jwt.sign(
      { id: founduser.rows[0].id, email: founduser.rows[0].email },
      senhajwt,
      { expiresIn: "10h" }
    );
    const { senha: notToUse, ...dataToUse } = founduser.rows[0];
    return res.json({ usuario: dataToUse, token: tokenToUser });
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Erro inexperado ao tentar logar" });
  }
};

const userProfile = (req, res) => {
  const profile = req.usuario;
  const { senha: notToUse, ...dataToUse } = profile;
  return res.status(200).json(dataToUse);
};

const userUpdate = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const { id } = req.usuario;
    const foundUserWithNewEmail = await databaseConnection.query(
      "select * from usuarios where email = $1",
      [email]
    );
    if (foundUserWithNewEmail.rowCount > 0) {
      return res.status(400).json({
        mensagem: "O e-mail informado já está sendo utilizado por um usuário.",
      });
    }
    const newCryptPassword = await bcrypt.hash(senha, 10);
    const alteredUser = await databaseConnection.query(
      "UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 returning *",
      [nome, email, newCryptPassword, id]
    );
    const { senha: NotShow, ...update } = alteredUser.rows[0];
    return res.status(201).json(update);
  } catch (error) {
    return res.status(500).json({
      mensagem:
        "Erro sistemico ao tentar atualizar o cadastro. Entre em contato mais tarde",
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userProfile,
  userUpdate,
};
