const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
});

app.use(cors());
app.use(express.json());

// Register a new user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, hashedPassword]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: "User registration failed" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length > 0) {
      const match = await bcrypt.compare(password, user.rows[0].password);
      if (match) {
        const token = jwt.sign({ id: user.rows[0].id }, process.env.SECRET_KEY);
        res.json({ token });
      } else {
        res.status(401).json({ error: "Invalid password" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.listen(port, () => {
  console.log(`Backend 1 running on http://localhost:${port}`);
});
