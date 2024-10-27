import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [quote, setQuote] = useState(null);
  const [message, setMessage] = useState("");

  // Function to register a new user
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

  // Function to log in a user
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
      setMessage(`Login successful! Token: ${data.token}`);
    } else {
      const errorData = await response.json();
      setMessage(errorData.error);
    }
  };

  // Function to fetch a random quote
  const fetchRandomQuote = async () => {
    const response = await fetch("http://localhost:5001/quotes/random");
    if (response.ok) {
      const data = await response.json();
      setQuote(data.quote);
    } else {
      const errorData = await response.json();
      setMessage(errorData.error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>TEST</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      {/* User Registration */}
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>

      {/* User Login */}
      <h2>Login</h2>
      <button onClick={handleLogin}>Login</button>

      {/* Fetch Random Quote */}
      <h2>Get a Random Quote</h2>
      <button onClick={fetchRandomQuote}>Get Quote</button>
      {quote && <p>Random Quote: {quote}</p>}

      {/* Messages */}
      {message && <p>{message}</p>}

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
