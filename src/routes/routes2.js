const express = require("express");
const {
  withoutBody,
  withoutQuery,
  canHaveQuery,
} = require("../middlewares/middlewareFuntions");
const { purchaseOrderRegister } = require("../controllers/purchaseOrder");
const { orderArray } = require("../controllers/purshaseRegisted");
const fieldsCheck6 = require("../validations/fieldsCheck6");
const validarCorpoRequisicao = require("../middlewares/generalMiddleware");

const routes2 = express();

routes2.post(
  "/pedido",
  withoutQuery,
  validarCorpoRequisicao(fieldsCheck6),
  purchaseOrderRegister
);

routes2.get("/pedido", withoutBody, canHaveQuery, orderArray);

module.exports = routes2;
