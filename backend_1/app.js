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

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

app.post("/favorites", authenticate, async (req, res) => {
  const { quoteId } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      "INSERT INTO favorite_quotes (quote_id, user_id) VALUES ($1, $2)",
      [quoteId, userId]
    );
    res.status(201).json({ message: "Quote added to favorites" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add favorite quote" });
  }
});

app.get("/favorites", authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT quotes.text, quotes.author FROM favorite_quotes JOIN quotes ON favorite_quotes.quote_id = quotes.id WHERE favorite_quotes.user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favorite quotes" });
  }
});

app.listen(port, () => {
  console.log(`Backend 1 running on http://localhost:${port}`);
});
