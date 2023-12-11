const express = require("express");
const multer = require("multer");

const {
  userRegister,
  userLogin,
  userProfile,
  userUpdate,
} = require("../controllers/userControl");
const {
  newProductRegister,
  productAltering,
  productsArray,
  idProductArray,
  idProductDelete,
} = require("../controllers/productControll");
const { categoriesList } = require("../controllers/categoriesControl");
const {
  clientRegisterByUser,
  idClientAlteration,
  clientsArray,
  clientRegistedForUser,
} = require("../controllers/clientsControlls");
const tokenValidation = require("../validations/tokenValidation");
const {
  withoutBody,
  withoutQuery,
  canHaveQuery2,
} = require("../middlewares/middlewareFuntions");
const fieldsCheck1 = require("../validations/fieldsCheck1");
const fieldsCheck2 = require("../validations/fieldsCheck2");
const fieldsCheck3 = require("../validations/fieldsCheck3");
const fieldsCheck4 = require("../validations/fieldsCheck4");
const fieldsCheck5 = require("../validations/fieldsCheck5");
const validarCorpoRequisicao = require("../middlewares/generalMiddleware");

//---------------------------------------------------------------------------------------------------------------
const update = multer({});
const routes = express();

routes.get("/", (req, res) => {
  return res.status(200).json({
    message: "you're welcome to the TEAM CODE_21",
    integrantes: `INTEGRANTES:
    LUCAS MATHEUS DE SOUZA
    GUILHERME SANTOS BRAHIM PEREIRA
    RANCISCO ALYSSON DOS SANTOS ARAUJO
    CARLOS ANTONIO MONTEIRO FILHO
    MATHEUS RODRIGUES GASPARETO `,
  });
});
routes.post(
  "/cadastro",
  withoutQuery,
  validarCorpoRequisicao(fieldsCheck1),
  userRegister
);
routes.post(
  "/login",
  withoutQuery,
  validarCorpoRequisicao(fieldsCheck2),
  userLogin
);

routes.use(tokenValidation);

routes.get("/usuario", withoutQuery, withoutBody, userProfile);

routes.put(
  "/usuario",
  withoutQuery,
  validarCorpoRequisicao(fieldsCheck1),
  userUpdate
);

routes.get("/categoria", withoutQuery, withoutBody, categoriesList);

routes.post(
  "/produto",
  update.single("produto_imagem"),
  withoutQuery,
  validarCorpoRequisicao(fieldsCheck3),
  newProductRegister
);
routes.put(
  "/produto/:id",
  update.single("produto_imagem"),
  withoutQuery,
  validarCorpoRequisicao(fieldsCheck3),
  productAltering
);
routes.get("/produto", withoutBody, productsArray);
routes.get("/produto/:id", withoutQuery, withoutBody, idProductArray);
routes.delete("/produto/:id", withoutQuery, withoutBody, idProductDelete);

routes.post(
  "/cliente",
  withoutQuery,
  validarCorpoRequisicao(fieldsCheck4),
  clientRegisterByUser
);
routes.put(
  "/cliente/:id",
  withoutQuery,
  validarCorpoRequisicao(fieldsCheck5),
  idClientAlteration
);
routes.get("/cliente", withoutQuery, withoutBody, clientsArray);
routes.get("/cliente/:id", withoutQuery, withoutBody, clientRegistedForUser);

module.exports = routes;
