import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [quote, setQuote] = useState(null);
  const [message, setMessage] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [token, setToken] = useState(null);

  const apiRequest = async (
    url,
    method = "GET",
    body = null,
    requireAuth = false
  ) => {
    const headers = { "Content-Type": "application/json" };
    if (requireAuth && token) headers.Authorization = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed");
    return data;
  };

  const handleRegister = async () => {
    try {
      await apiRequest("http://localhost:5000/register", "POST", {
        username,
        password,
      });
      setMessage("User registered successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const data = await apiRequest("http://localhost:5000/login", "POST", {
        username,
        password,
      });
      setToken(data.token);
      setMessage("Login successful!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const fetchRandomQuote = async () => {
    try {
      const data = await apiRequest("http://localhost:5001/quotes/random");
      setQuote(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const addFavorite = async (quoteId) => {
    if (!token) {
      setMessage("Please log in to add favorites.");
      return;
    }

    try {
      await apiRequest(
        "http://localhost:5000/favorites",
        "POST",
        { quoteId },
        true
      );
      setMessage("Quote added to favorites!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const fetchFavorites = async () => {
    if (!token) {
      setMessage("Please log in to view favorites.");
      return;
    }

    try {
      const data = await apiRequest(
        "http://localhost:5000/favorites",
        "GET",
        null,
        true
      );
      setFavorites(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Quotes App</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>

      <h2>Random Quote</h2>
      <button onClick={fetchRandomQuote}>Get Random Quote</button>
      {quote && (
        <div>
          <p>
            {quote.text} - {quote.author}
          </p>
          <button onClick={() => addFavorite(quote.id)}>
            Add to Favorites
          </button>
        </div>
      )}

      <h2>Favorites</h2>
      <button onClick={fetchFavorites}>Fetch Favorites</button>
      {favorites.map((fav, idx) => (
        <p key={idx}>
          {fav.text} - {fav.author}
        </p>
      ))}

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
