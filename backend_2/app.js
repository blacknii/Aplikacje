const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = 5001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
});

app.use(cors());
app.use(express.json());

app.get("/quotes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM quotes");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quotes" });
  }
});

app.get("/quotes/random", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM quotes ORDER BY RANDOM() LIMIT 1"
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch random quote" });
  }
});

app.listen(port, () => {
  console.log(`Backend 2 running on http://localhost:${port}`);
});
