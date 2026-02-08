require("dotenv").config();
const express = require("express");
const cors = require("cors");


const analyzeRoutes = require("./routes/analyze");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/analyze-symptoms", analyzeRoutes);

app.get("/", (req, res) => res.send("OK"));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});