import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const WEBSOCKET_URL = "wss://socket.polygon.io/stocks";
const API_KEY = "L_aeUHEjW5ATmIIeTQPeviyJpg4ODuYG";
const baseUrl = "https://api.polygon.io/v2/aggs/ticker";

const AggregatePerSecond = () => {
  const [data, setData] = useState({
    timestamp: [],
    open: [],
    high: [],
    low: [],
    close: [],
  });
  const [ticker, setTicker] = useState("AAPL");
  const [inputTicker, setInputTicker] = useState(""); // Start with empty input box
  const [showGraph, setShowGraph] = useState(false); // New state for showing graph
  const [timeFrame, setTimeFrame] = useState('all'); // Add state for selected time frame
  const [submitted, setSubmitted] = useState(false); // New state to track ticker submission

  const fetchHistoricalData = async (seconds) => {
    const endTime = new Date();
    const startTime = new Date(endTime - seconds * 1000);
    const startTimestamp = Math.floor(startTime.getTime());
    const endTimestamp = Math.floor(endTime.getTime());

    const url = `${baseUrl}/${ticker}/range/1/second/${startTimestamp}/${endTimestamp}?adjusted=true&sort=asc&apiKey=${API_KEY}`;
    const response = await fetch(url);
    if (response.ok) {
      const jsonData = await response.json();
      const results = jsonData.results || [];

      setData({
        timestamp: results.map((entry) => new Date(entry.t).toISOString()),
        open: results.map((entry) => entry.o),
        high: results.map((entry) => entry.h),
        low: results.map((entry) => entry.l),
        close: results.map((entry) => entry.c),
      });
    }
  };

  useEffect(() => {
    if (showGraph) {
      fetchHistoricalData(30); // Fetch initial historical data if graph is shown

      const ws = new WebSocket(WEBSOCKET_URL);

      ws.onopen = () => {
        ws.send(JSON.stringify({ action: "auth", params: API_KEY }));
        ws.send(JSON.stringify({ action: "subscribe", params: `T.${ticker}` }));
      };

      ws.onmessage = (event) => {
        const eventData = JSON.parse(event.data)[0];
        if (eventData && eventData.ev === "A") {
          setData((prevData) => ({
            timestamp: [...prevData.timestamp, new Date(eventData.s).toISOString()],
            open: [...prevData.open, eventData.o],
            high: [...prevData.high, eventData.h],
            low: [...prevData.low, eventData.l],
            close: [...prevData.close, eventData.c],
          }));
        }
      };

      return () => ws.close(); // Clean up WebSocket on unmount
    }
  }, [ticker, showGraph]); // Re-run useEffect when ticker or showGraph changes

  const handleTickerSubmit = (e) => {
    e.preventDefault();
    setTicker(inputTicker); // Update ticker state
    setShowGraph(true); // Show the graph after submission
    setSubmitted(true); // Mark the ticker as submitted
  };

  const handleTimeFrameChange = (time) => {
    setTimeFrame(time);
    let seconds;
    switch (time) {
      case '1h': seconds = 3600; break;
      case '30m': seconds = 1800; break;
      case '15m': seconds = 900; break;
      case '5m': seconds = 300; break;
      default: seconds = 30; break;
    }
    fetchHistoricalData(seconds); // Fetch new data based on the selected time frame
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#333333", padding: "20px", height: "100vh", width: "100%" }}>
      <form onSubmit={handleTickerSubmit} className="d-flex mb-3">
          <input
              type="text"
              className="form-control me-2"
              value={inputTicker}
              onChange={(e) => setInputTicker(e.target.value.toUpperCase())}
              placeholder="Enter Ticker Symbol"
              style={{
                  color: "white",
                  backgroundColor: "#555",
                  border: "1px solid white",
              }}
          />
          <button
              type="submit"
              className="btn"
              style={{
                  backgroundColor: "rgb(240, 108, 0)",
                  color: "white",
              }}
          >
              Submit
          </button>
      </form>

      {/* Time Frame Buttons - Show only after ticker is submitted */}
      {submitted && (
        <div className="btn-group mb-3">
          {['all', '1h', '30m', '15m', '5m'].map(time => (
            <button
              key={time}
              className={`btn ${timeFrame === time ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() => handleTimeFrameChange(time)}
            >
              {time === 'all' ? 'All' : time}
            </button>
          ))}
        </div>
      )}

      {showGraph && ( // Conditionally render the Plot component
        <Plot
          data={[{
            x: data.timestamp,
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close,
            type: "candlestick",
            name: 'OHLC',
            xaxis: "x",
            yaxis: "y",
          }]}
          layout={{
            title: {
              text: `Live Candlestick Chart for ${ticker}`,
              font: { color: 'white' },
            },
            xaxis: { 
              title: 'Time', 
              color: 'white', 
              rangeslider: { visible: false },
            },
            yaxis: { title: 'Price (USD)', color: 'white' },
            height: 600,
            paper_bgcolor: '#333333',
            plot_bgcolor: '#333333',
          }}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
};

export default AggregatePerSecond;
