import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🛒 Grocery AI Assistant</h1>
        <p>Ask me anything about groceries, and I’ll help you!</p>

        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Type your grocery query..."
            style={{
              padding: '10px',
              width: '300px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
          />
          <button
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
      </header>
    </div>
  );
}

export default App;
