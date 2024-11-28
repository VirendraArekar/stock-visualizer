import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const AggregatesGraph = () => {
  const location = useLocation();
  const { formData } = location.state || {};

  const [stockData, setStockData] = useState([]);
  const [macdData, setMacdData] = useState({ macd: [], signalLine: [] });
  const [formInputs, setFormInputs] = useState(formData || {
    stocksTicker: '',
    multiplier: 1,
    timespan: 'day',
    from: new Date().toISOString().slice(0, 10),
    to: new Date().toISOString().slice(0, 10),
    adjusted: 'true',
    sort: 'asc',
    limit: 100
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateEMA = (data, span) => {
    const k = 2 / (span + 1);
    const emaArray = [data[0]];
    for (let i = 1; i < data.length; i++) {
      emaArray.push(data[i] * k + emaArray[i - 1] * (1 - k));
    }
    return emaArray;
  };

  const calculateMACD = (data) => {
    const closePrices = data.map((item) => item.Close);
    const ema12 = calculateEMA(closePrices, 12);
    const ema26 = calculateEMA(closePrices, 26);
    const macd = ema12.map((value, index) => value - ema26[index]);
    const signalLine = calculateEMA(macd, 9);
    return { macd, signalLine };
  };

  const constructApiUrl = () => {
    const { stocksTicker, multiplier, timespan, from, to, adjusted, sort, limit } = formInputs;
    return `https://api.polygon.io/v2/aggs/ticker/${stocksTicker}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=${adjusted}&sort=${sort}&limit=${limit}&apiKey=L_aeUHEjW5ATmIIeTQPeviyJpg4ODuYG`;
  };

  const fetchStockData = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = constructApiUrl();
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      const results = data.results || [];
      const processedData = results.map((result) => ({
        Volume: result.v,
        VWAP: result.vw,
        Open: result.o,
        Close: result.c,
        High: result.h,
        Low: result.l,
        Timestamp: new Date(result.t).toISOString().slice(0, 19).replace("T", " "),
        Transactions: result.n,
      }));
      setStockData(processedData);
      const { macd, signalLine } = calculateMACD(processedData);
      setMacdData({ macd, signalLine });
    } catch (error) {
      setError(error.message);
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData) {
      fetchStockData(); // Automatically fetch stock data when the component mounts
    }
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStockData();
  };

  return (
    <div className="vh-100" style={{ backgroundColor: "#333333", margin: 0 }}>
      <div className="container-fluid vh-100" style={{ color: "#FFFFFF", padding: 0 }}>
        <div className="text-center py-3">
          <h1>Aggregates Graph</h1>
        </div>

        <form onSubmit={handleSubmit} className="text-center mb-4">
          <div className="mb-4">
            <div className="row g-2 justify-content-center">
            {[
                { label: "Ticker", name: "stocksTicker", type: "text", placeholder: "AAPL" },
                { label: "Multiplier", name: "multiplier", type: "number", placeholder: "1" },
                {
                  label: "Timespan",
                  name: "timespan",
                  type: "select",
                  options: [
                    { value: "", label: "Select timespan" },
                    { value: "second", label: "Second" },
                    { value: "minute", label: "Minute" },
                    { value: "hour", label: "Hour" },
                    { value: "day", label: "Day" },
                    { value: "week", label: "Week" },
                    { value: "month", label: "Month" },
                    { value: "quarter", label: "Quarter" },
                    { value: "year", label: "Year" },
                  ],
                },
                { label: "From", name: "from", type: "date" },
                { label: "To", name: "to", type: "date" },
                { 
                  label: "Adjusted", 
                  name: "adjusted", 
                  type: "select", 
                  options: [
                    { value: "", label: "" },
                    { value: "true", label: "True" },
                    { value: "false", label: "False" }
                  ], 
                },
                { label: "Sort", 
                  name: "sort", 
                  type: "select", 
                  options: [
                    { value: "", label: "" },
                    { value: "asc", label: "Asc" },
                    { value: "dsc", label: "Dsc" }
                  ], 
                },
                { label: "Limit", name: "limit", type: "number", placeholder: "100" },
              ].map((field, index) => (
                <div className="col-auto" key={index}>
                  <label className="visually-hidden">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formInputs[field.name]}
                      onChange={handleInputChange}
                      className="form-control"
                      style={{ backgroundColor: "#FFFFFF", color: "#333333", border: "none" }}
                    >
                      {field.options.map((option, idx) => (
                        <option key={idx} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formInputs[field.name]}
                      onChange={handleInputChange}
                      className="form-control"
                      style={{ backgroundColor: "#FFFFFF", color: "#333333", border: "none" }}
                      placeholder={field.label}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Fetch Data
          </button>
        </form>

        {loading && <div className="text-light">Loading...</div>}
        {error && <div className="text-light">Error: {error}</div>}

        <div className="row" style={{ overflowX: "hidden" }}>
          <div className="col-12">
            <Plot
              data={[
                {
                  x: stockData.map((item) => item.Timestamp),
                  open: stockData.map((item) => item.Open),
                  high: stockData.map((item) => item.High),
                  low: stockData.map((item) => item.Low),
                  close: stockData.map((item) => item.Close),
                  type: "candlestick",
                  name: "Candlestick",
                  xaxis: "x",
                  yaxis: "y1",
                },
                {
                  x: stockData.map((item) => item.Timestamp),
                  y: macdData.macd,
                  type: "scatter",
                  mode: "lines",
                  name: "MACD",
                  line: { color: "blue" },
                  xaxis: "x",
                  yaxis: "y2",
                },
                {
                  x: stockData.map((item) => item.Timestamp),
                  y: macdData.signalLine,
                  type: "scatter",
                  mode: "lines",
                  name: "Signal Line",
                  line: { color: "red" },
                  xaxis: "x",
                  yaxis: "y2",
                },
              ]}
              layout={{
                title: "Live Candlestick Chart with MACD & Signal Line",
                template: "plotly_dark",
                height: 700,
                showlegend: true,
                xaxis: { title: "Timestamp", rangeslider: { visible: false } },
                yaxis1: { title: "Stock Price", domain: [0.3, 1], anchor: "x" },
                yaxis2: { title: "MACD", domain: [0, 0.25], anchor: "x" },
                grid: { rows: 2, columns: 1, subplots: [["xy"], ["xy2"]] },
                paper_bgcolor: "#333333",
                plot_bgcolor: "#333333",
                font: { color: "#FFFFFF" },
              }}
              config={{ responsive: true }}
              useResizeHandler
              style={{ width: "100%", height: "100%", overflow: "hidden"  }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AggregatesGraph;
