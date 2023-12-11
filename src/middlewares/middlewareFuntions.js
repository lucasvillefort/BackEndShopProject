const withoutBody = (req, res, next) => {
  const fieldBody = Object.keys(req.body);
  if (fieldBody.length > 0) {
    return res.status(400).json({
      mensagem: "E proibido colocar campos dentro do corpo da requisicao",
    });
  }
  next();
};

const withoutQuery = (req, res, next) => {
  const queryArray = Object.keys(req.query);
  if (queryArray.length > 0) {
    return res.status(400).json({ mensagem: "Nao e permitido colocar query" });
  }
  next();
};

const canHaveQuery = (req, res, next) => {
  const queryArray = Object.keys(req.query);
  if (queryArray.length > 1) {
    return res.status(400).json({
      mensagem:
        "Voce colocou quantidade de parametros a mais na query. Por favor, tente novamente.",
    });
  }
  const { cliente_id } = req.query;
  if (!queryArray.includes("cliente_id")) {
    return res.status(400).json(`coloque o parametro correto`);
  }
  next();
};
const canHaveQuery2 = (req, res, next) => {
  const queryArray = Object.keys(req.query);
  if (queryArray.length > 1) {
    return res.status(400).json({
      mensagem:
        "Voce colocou parametros a mais na query. Por favor, tente novamente.",
    });
  }
  const { categoria_id } = req.query;
  if (!Object.keys(req.query).includes("categoria_id")) {
    return res.status(400).json(`coloque o parametro correto`);
  }
  next();
};
module.exports = { withoutBody, withoutQuery, canHaveQuery, canHaveQuery2 };
