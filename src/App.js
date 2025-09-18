import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");

  // 🔎 Search items
  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `https://grocery-ai-backend.onrender.com/api/items?q=${query}`
      );
      setItems(res.data);
      setMessage("");
    } catch (error) {
      setMessage("⚠️ Error: Could not connect to backend.");
    }
  };

  // ➕ Add to Cart (with quantity check)
  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p["Item Name"] === item["Item Name"]);
      if (existing) {
        return prev.map((p) =>
          p["Item Name"] === item["Item Name"]
            ? { ...p, qty: (p.qty || 1) + 1 }
            : p
        );
      } else {
        return [...prev, { ...item, qty: 1 }];
      }
    });
    setMessage(`${item["Item Name"]} added to cart ✅`);
  };

  // 🗑️ Remove from Cart
  const handleRemoveFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  // 🛒 Place Order (Cart)
  const handleOrderCart = async () => {
    try {
      const res = await axios.post(
        "https://grocery-ai-backend.onrender.com/api/order",
        {
          items: cart.map((item) => ({
            item: item["Item Name"],
            quantity: item.qty || 1,
            price: item["Price (₹)"],
          })),
          customer: "Test User",
          total: getTotal(),
        }
      );
      setMessage(`✅ ${res.data.status}`);
      setCart([]); // clear cart after order
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Error placing order.");
    }
  };

  // 💰 Calculate Total
  const getTotal = () =>
    cart.reduce(
      (sum, item) => sum + (item["Price (₹)"] || 0) * (item.qty || 1),
      0
    );

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛒 Grocery AI Assistant</h1>
        <p>Search groceries, add to cart, and order!</p>

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
                    onClick={() => handleAddToCart(item)}
                    style={{
                      marginTop: "8px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "#FF9800",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    ➕ Add to Cart
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cart */}
        {cart.length > 0 && (
          <div style={{ marginTop: "30px", textAlign: "left" }}>
            <h3>🛒 Your Cart:</h3>
            <ul>
              {cart.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    padding: "8px",
                    borderRadius: "6px",
                  }}
                >
                  {item["Item Name"]} - ₹{item["Price (₹)"]} × {item.qty}
                  <button
                    onClick={() => handleRemoveFromCart(idx)}
                    style={{
                      marginLeft: "10px",
                      padding: "4px 8px",
                      border: "none",
                      borderRadius: "6px",
                      backgroundColor: "red",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    ❌ Remove
                  </button>
                </li>
              ))}
            </ul>
            <h4>Total: ₹{getTotal()}</h4>
            <button
              onClick={handleOrderCart}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#2196F3",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ✅ Place Order
            </button>
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
