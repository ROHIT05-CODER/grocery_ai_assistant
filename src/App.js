import { useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    try {
      const res = await axios.post("https://grocery-ai-backend.onrender.com", {
        query,
      });
      setAnswer(res.data.answer);
    } catch (error) {
      setAnswer("Error: Could not connect to backend.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛒 Grocery AI Assistant</h1>
        <p>Ask me anything about groceries!</p>

        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Type your grocery query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: '10px',
              width: '300px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
          />
          <button
            onClick={handleAsk}
            style={{
              padding: '10px 20px',
              marginLeft: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#4CAF50',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Ask
          </button>
        </div>

        {answer && (
          <div style={{ marginTop: "20px", maxWidth: "500px" }}>
            <h3>Answer:</h3>
            <p>{answer}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
