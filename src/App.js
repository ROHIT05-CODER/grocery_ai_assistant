import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");

  // customer details
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 🛠️ Axios instance (backend URL common)
  const api = axios.create({
    baseURL: "https://grocery-ai-backend.onrender.com/api",
  });

  // 🔎 Search items
  const handleSearch = async () => {
    if (!query.trim()) return setMessage("⚠️ Enter item name!");
    try {
      const res = await api.get(`/items?q=${query}`);
      setItems(res.data);
      setMessage(res.data.length ? "" : "❌ No items found");
    } catch {
      setMessage("⚠️ Backend connection error.");
    }
  };

  // ➕ Add to Cart
  const handleAddToCart = (item) => {
    setCart((prev) => {
      const exist = prev.find((p) => p["Item Name"] === item["Item Name"]);
      return exist
        ? prev.map((p) =>
            p["Item Name"] === item["Item Name"]
              ? { ...p, qty: (p.qty || 1) + 1 }
              : p
          )
        : [...prev, { ...item, qty: 1 }];
    });
    setMessage(`${item["Item Name"]} added ✅`);
  };

  // 🗑 Remove from cart
  const handleRemoveFromCart = (i) =>
    setCart((prev) => prev.filter((_, idx) => idx !== i));

  // 💰 Cart total
  const getTotal = () =>
    cart.reduce(
      (sum, i) => sum + (i["Price (₹)"] || 0) * (i.qty || 1),
      0
    );

  // 🛒 Place order
  const handleOrder = async () => {
    if (!cart.length) return setMessage("⚠️ Cart is empty!");
    if (!customer || !phone || !address)
      return setMessage("⚠️ Please enter customer details!");

    try {
      const res = await api.post("/order", {
        items: cart.map((i) => ({
          item: i["Item Name"],
          quantity: i.qty,
          price: i["Price (₹)"],
        })),
        customer,
        phone,
        address,
        total: getTotal(),
      });
      setMessage(`✅ ${res.data.status} | Total: ₹${res.data.total}`);
      setCart([]);
      setCustomer("");
      setPhone("");
      setAddress("");
    } catch {
      setMessage("⚠️ Order failed!");
    }
  };

  // 🎨 Button style
  const btnStyle = (bg) => ({
    padding: "8px 14px",
    margin: "4px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: bg,
    color: "white",
    cursor: "pointer",
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛒 Grocery AI Assistant</h1>
        <p>Search groceries, add to cart & order instantly</p>

        {/* 👤 Customer Details */}
        <div style={{ marginTop: 20, textAlign: "left" }}>
          <h3>Customer Details</h3>
          <input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Customer Name"
            style={{ padding: "10px", width: "280px", margin: "5px" }}
          />
          <br />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            style={{ padding: "10px", width: "280px", margin: "5px" }}
          />
          <br />
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Delivery Address"
            style={{ padding: "10px", width: "280px", margin: "5px" }}
          />
        </div>

        {/* 🔍 Search */}
        <div style={{ marginTop: 20 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search item (e.g., Apple)..."
            style={{
              padding: "10px",
              width: "280px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <button onClick={handleSearch} style={btnStyle("#4CAF50")}>
            Search
          </button>
        </div>

        {/* 📦 Results */}
        {items.length > 0 && (
          <div style={{ marginTop: 30, textAlign: "left" }}>
            <h3>Results:</h3>
            <ul>
              {items.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: 12,
                    border: "1px solid #ddd",
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  <b>{item["Item Name"]}</b> ({item.Category}) - ₹
                  {item["Price (₹)"]}
                  <br />
                  <small>{item.Description}</small>
                  <br />
                  <button
                    onClick={() => handleAddToCart(item)}
                    style={btnStyle("#FF9800")}
                  >
                    ➕ Add
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 🛒 Cart */}
        {cart.length > 0 && (
          <div style={{ marginTop: 30, textAlign: "left" }}>
            <h3>Your Cart</h3>
            <ul>
              {cart.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: 10,
                    border: "1px solid #ccc",
                    padding: 8,
                    borderRadius: 6,
                  }}
                >
                  {item["Item Name"]} - ₹{item["Price (₹)"]} × {item.qty}
                  <button
                    onClick={() => handleRemoveFromCart(idx)}
                    style={btnStyle("red")}
                  >
                    ❌ Remove
                  </button>
                </li>
              ))}
            </ul>
            <h4>Total: ₹{getTotal()}</h4>
            <button onClick={handleOrder} style={btnStyle("#2196F3")}>
              ✅ Place Order
            </button>
          </div>
        )}

        {/* 📢 Status */}
        {message && <h4 style={{ marginTop: 20 }}>{message}</h4>}
      </header>
    </div>
  );
}

export default App;
