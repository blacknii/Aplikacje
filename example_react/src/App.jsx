import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [quote, setQuote] = useState(null);
  const [message, setMessage] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [token, setToken] = useState(null);

  const handleRegister = async () => {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      setMessage("User registered successfully!");
    } else {
      const errorData = await response.json();
      setMessage(errorData.error);
    }
  };

  const handleLogin = async () => {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      setMessage("Login successful!");
    } else {
      const errorData = await response.json();
      setMessage(errorData.error);
    }
  };

  const fetchRandomQuote = async () => {
    const response = await fetch("http://localhost:5001/quotes/random");
    if (response.ok) {
      const data = await response.json();
      setQuote(data);
    } else {
      const errorData = await response.json();
      setMessage(errorData.error);
    }
  };

  const addFavorite = async (quoteId) => {
    if (!token) {
      setMessage("Please log in to add favorites.");
      return;
    }

    const response = await fetch("http://localhost:5000/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quoteId }),
    });

    if (response.ok) {
      setMessage("Quote added to favorites!");
    } else {
      const errorData = await response.json();
      setMessage(errorData.error);
    }
  };

  const fetchFavorites = async () => {
    if (!token) {
      setMessage("Please log in to view favorites.");
      return;
    }

    const response = await fetch("http://localhost:5000/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setFavorites(data);
    } else {
      const errorData = await response.json();
      setMessage(errorData.error);
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
