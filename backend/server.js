require("dotenv").config();
const express = require("express");
const cors = require("cors");


try {
    analyzeRoutes = require("./routes/analyze");
    console.log("✅ analyze routes loaded");
} catch (err) {
    console.error("❌ Failed to load analyze routes:", err);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (analyzeRoutes) {
    app.use("/api/analyze-symptoms", analyzeRoutes);
}

app.get("/", (req, res) => res.send("OK"));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});