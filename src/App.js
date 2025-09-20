import { useState } from "react";
import axios from "axios";
import "./App.css";
import HologramAssistant from "./HoloAssistant";


function App() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 🛠️ Axios instance
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

  // 🔄 Update Quantity (increase / decrease)
  const handleUpdateQty = (idx, change) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, qty: Math.max(1, (item.qty || 1) + change) } : item
      )
    );
  };

  // 🗑 Remove from cart
  const handleRemoveFromCart = (i) =>
    setCart((prev) => prev.filter((_, idx) => idx !== i));

  // 💰 Cart total
  const getTotal = () =>
    cart.reduce((sum, i) => sum + (i["Price (₹)"] || 0) * (i.qty || 1), 0);

  // 🛒 Place order
  const handleOrder = async () => {
    if (!cart.length) return setMessage("⚠️ Cart is empty!");
    if (!customer || !phone || !address)
      return setMessage("⚠️ Please enter customer details!");

    // 📞 Validate phone
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return setMessage("⚠️ Enter a valid 10-digit phone number");
    }

    const formattedPhone = `+91${phone}`;

    try {
      const res = await api.post("/order", {
        items: cart.map((i) => ({
          item: i["Item Name"],
          quantity: i.qty,
          price: i["Price (₹)"],
        })),
        customer,
        phone: formattedPhone,
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
    padding: "6px 12px",
    margin: "2px",
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
                  <br />
                  <button
                    onClick={() => handleUpdateQty(idx, -1)}
                    style={btnStyle("#9C27B0")}
                  >
                    ➖
                  </button>
                  <button
                    onClick={() => handleUpdateQty(idx, 1)}
                    style={btnStyle("#009688")}
                  >
                    ➕
                  </button>
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

            {/* 🧑 Customer Details */}
            <div style={{ marginBottom: 15 }}>
              <input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="👤 Enter your name"
                style={{ padding: "8px", width: "250px", margin: "4px" }}
              />
              <br />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="📞 Enter 10-digit phone"
                maxLength={10}
                style={{ padding: "8px", width: "250px", margin: "4px" }}
              />
              <br />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="📍 Enter delivery address"
                style={{ padding: "8px", width: "250px", margin: "4px" }}
              />
            </div>

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
