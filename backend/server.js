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

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}
else {
    app.listen(PORT);
}