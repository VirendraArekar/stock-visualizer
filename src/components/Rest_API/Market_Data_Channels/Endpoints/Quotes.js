import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import 'bootstrap/dist/css/bootstrap.min.css';

// Polygon.io WebSocket URL and API key
const WEBSOCKET_URL = "wss://socket.polygon.io/stocks";
const API_KEY = "L_aeUHEjW5ATmIIeTQPeviyJpg4ODuYG";

const QuotesLiveGraph = () => {
  const [symbol, setSymbol] = useState(""); // Ticker symbol input from the user
  const [ticker, setTicker] = useState(null); // Ticker to be used for fetching data
  const [bidPrices, setBidPrices] = useState([]);
  const [askPrices, setAskPrices] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    if (!ticker) return; // Skip if no ticker is set

    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => {
      // Authenticate
      ws.send(JSON.stringify({ action: "auth", params: API_KEY }));
      // Subscribe to the chosen stock symbol
      ws.send(JSON.stringify({ action: "subscribe", params: `Q.${ticker}` }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)[0];
      if (data && data.ev === "Q" && data.sym === ticker) {
        // Append new data
        setBidPrices((prev) => [...prev.slice(-999), data.bp]);
        setAskPrices((prev) => [...prev.slice(-999), data.ap]);
        setTimestamps((prev) => [...prev.slice(-999), new Date(data.t).toISOString()]);
      }
    };

    return () => ws.close(); // Clean up on component unmount or ticker change
  }, [ticker]);

  // Handle form submission to set ticker symbol
  const handleSubmit = (e) => {
    e.preventDefault();
    setBidPrices([]); // Clear previous data
    setAskPrices([]);
    setTimestamps([]);
    setTicker(symbol.toUpperCase()); // Set the ticker for streaming
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#333333", padding: "20px", height: "100vh", width: "100%" }}>
      
      {/* Input form for ticker symbol */}
      <form onSubmit={handleSubmit} className="d-flex mb-3" style={{ color: "white" }}>
        <input 
          type="text" 
          value={symbol} 
          onChange={(e) => setSymbol(e.target.value)} 
          placeholder="Enter Ticker Symbol" 
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

      {/* Plotly graph */}
      {ticker && (
        <Plot
          data={[
            {
              x: timestamps,
              y: bidPrices,
              fill: "tozeroy",
              mode: "none",
              name: "Bid Price (bp)",
              fillcolor: "rgba(0, 255, 0, 0.4)", // Green with slight transparency
              type: "scatter"
            },
            {
              x: timestamps,
              y: askPrices,
              mode: "lines",
              name: "Ask Price (ap)",
              line: { color: "red", width: 2 },
              type: "scatter"
            }
          ]}
          layout={{
            title: `Live Bid and Ask Prices for ${ticker}`,
            xaxis: { title: "Time", type: "date", color: "white" },
            yaxis: {
              title: "Price (USD)",
              range: [
                Math.min(...bidPrices, ...askPrices) * 0.999,
                Math.max(...bidPrices, ...askPrices) * 1.001
              ],
              color: "white"
            },
            template: "plotly_dark",
            plot_bgcolor: "#333333", // Background color of the plot
            paper_bgcolor: "#333333", // Background color of the entire graph area
            font: { color: "white" }, // Font color for axis labels and titles
            height: 600
          }}
          style={{ width: "100%", height: "600px" }} // Set the graph to cover the full width of the section
        />
      )}
    </div>
  );
};

export default QuotesLiveGraph;
