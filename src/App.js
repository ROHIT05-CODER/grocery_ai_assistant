import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  // 🔎 Search items
  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `https://grocery-ai-backend.onrender.com/api/items?q=${query}`
      );
      setItems(res.data);
    } catch (error) {
      setMessage("⚠️ Error: Could not connect to backend.");
    }
  };

  // 🛒 Place order
  const handleOrder = async (item) => {
    try {
      const res = await axios.post(
        "https://grocery-ai-backend.onrender.com/api/order",
        {
          item: item["Item Name"],
          quantity: "1 unit",
          customer: "Test User",
        }
      );
      setMessage(res.data.status);
    } catch (error) {
      setMessage("⚠️ Error placing order.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛒 Grocery AI Assistant</h1>
        <p>Search groceries and place your order!</p>

        {/* Search bar */}
        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Search item (e.g., Apple)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: "10px",
              width: "300px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "10px 20px",
              marginLeft: "10px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>

        {/* Search results */}
        {items.length > 0 && (
          <div style={{ marginTop: "30px", textAlign: "left" }}>
            <h3>Results:</h3>
            <ul>
              {items.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: "12px",
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <b>{item["Item Name"]}</b> ({item.Category}) - ₹
                  {item["Price (₹)"]}
                  <br />
                  <small>{item.Description}</small>
                  <br />
                  <button
                    onClick={() => handleOrder(item)}
                    style={{
                      marginTop: "8px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "#2196F3",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Order
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Status / Message */}
        {message && (
          <div style={{ marginTop: "20px" }}>
            <h4>{message}</h4>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
