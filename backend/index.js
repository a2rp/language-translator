require("dotenv").config();

const cors = require("cors");
const express = require("express");
const app = express();

const translateRoutes = require("./src/routes/translate.route");

app.use(express.json());
app.use(cors());
app.use("/api/v1/translate", translateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`server running http://localhost:${PORT}`));

