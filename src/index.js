require("dotenv").config();
const express = require("express");
const routes = require("./routes/routes");
const routes2 = require("./routes/routes2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(routes2);
const port = process.env.PORT_APP || 3000;
app.listen(port);
