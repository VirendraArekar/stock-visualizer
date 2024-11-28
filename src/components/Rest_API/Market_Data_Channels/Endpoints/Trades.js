import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import 'bootstrap/dist/css/bootstrap.min.css';

const API_KEY = "L_aeUHEjW5ATmIIeTQPeviyJpg4ODuYG";
const WEBSOCKET_URL = "wss://socket.polygon.io/stocks";

const LiveTradeGraph = () => {
  const [priceData, setPriceData] = useState({
    timestamps: [],
    prices: [],
  });
  const [symbol, setSymbol] = useState("");
  const [inputSymbol, setInputSymbol] = useState("");
  const [isTickerSubmitted, setIsTickerSubmitted] = useState(false);

  useEffect(() => {
    let websocket;

    if (isTickerSubmitted) {
      websocket = new WebSocket(WEBSOCKET_URL);
      websocket.onopen = () => {
        websocket.send(JSON.stringify({ action: "auth", params: API_KEY }));
        websocket.send(JSON.stringify({ action: "subscribe", params: `T.${symbol}` }));
      };

      websocket.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        if (Array.isArray(messageData) && messageData[0].ev === 'T') {
          const price = messageData[0].p;
          const tradeTime = new Date(messageData[0].t);
          setPriceData((prevData) => ({
            timestamps: [...prevData.timestamps, tradeTime.toISOString()],
            prices: [...prevData.prices, price],
          }));
        }
      };

      // Cleanup on component unmount
      return () => {
        websocket.close();
      };
    }
  }, [symbol, isTickerSubmitted]); // Re-run effect when the symbol or submission state changes

  const handleTickerSubmit = (e) => {
    e.preventDefault();
    if (inputSymbol.trim()) {
      setSymbol(inputSymbol.trim().toUpperCase());
      setPriceData({ timestamps: [], prices: [] }); // Reset price data for the new symbol
      setIsTickerSubmitted(true);
      setInputSymbol(''); // Clear input field
    }
  };

  const plotData = [{
    x: priceData.timestamps,
    y: priceData.prices,
    mode: 'lines+markers',
    type: 'scatter',
    marker: { color: 'rgb(240, 108, 0)', size: 4 },
    line: { color: 'rgb(240, 108, 0)' },
  }];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#333333", padding: "20px", height: "100vh", width: "100%" }}>
      
      {/* Ticker input form with Bootstrap styling */}
      <form onSubmit={handleTickerSubmit} className="d-flex mb-3">
        <input
          type="text"
          value={inputSymbol}
          onChange={(e) => setInputSymbol(e.target.value)}
          placeholder="Enter Stock Ticker"
          className="form-control me-2"
          style={{ color: "white", backgroundColor: "#555", border: "1px solid white" }}
        />
        <button 
          type="submit" 
          className="btn"
          style={{ backgroundColor: "rgb(240, 108, 0)", color: "white" }}
        >
          Submit
        </button>
      </form>

      {isTickerSubmitted && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "1600px", height: "600px" }}>
          <Plot
            data={plotData}
            layout={{
              title: `Live Line Graph for ${symbol}`,
              xaxis: {
                title: 'Time',
                rangeslider: { visible: false }
              },
              yaxis: {
                title: 'Price',
                range: [Math.min(...priceData.prices) || 0, Math.max(...priceData.prices) || 1],
              },
              plot_bgcolor: '#333333',
              paper_bgcolor: '#333333',
              font: { color: 'white' },
              height: 600,
              width: 1000,  // Increased width for the plot
            }}
            config={{ responsive: true }}
          />
        </div>
      )}
    </div>
  );
};

export default LiveTradeGraph;
