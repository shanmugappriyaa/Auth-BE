const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const AppRoutes = require("./src/routes");

dotenv.config();
const Port = process.env.Port;
const app = express();
app.use(cors());

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
app.use(express.json());

app.use("/", AppRoutes);

app.listen(Port, () => console.log(`Server is listening in ${Port}`));
