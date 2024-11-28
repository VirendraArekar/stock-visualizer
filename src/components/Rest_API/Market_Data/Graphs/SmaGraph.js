import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const SmaGraph = () => {
  const location = useLocation();
  const { formData } = location.state || {};

  const [stockData, setStockData] = useState([]);
  const [formInputs, setFormInputs] = useState({
    stocksTicker: formData?.stocksTicker || "AAPL",
    timestamp: formData?.timestamp || "2024-10-15",
    timespan: formData?.timespan || "day",
    adjusted: formData?.adjusted || "true",
    window: formData?.window || 30,
    series_type: formData?.series_type || "open",
    expand_underlying: formData?.expand_underlying || "true",
    order: formData?.order || "asc",
    limit: formData?.limit || 100,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = "L_aeUHEjW5ATmIIeTQPeviyJpg4ODuYG";

  const fetchStockData = async () => {
    setLoading(true);
    setError("");
    try {
      const url = `https://api.polygon.io/v1/indicators/sma/${formInputs.stocksTicker}`;
      const response = await axios.get(url, {
        params: {
          ...formInputs,
          apiKey,
        },
      });
      const aggregates = response.data?.results?.underlying?.aggregates;
      if (aggregates && aggregates.length > 0) {
        const processedData = aggregates.map((item) => ({
          date: new Date(item.t),
          open: item.o,
          high: item.h,
          low: item.l,
          close: item.c,
        }));
        setStockData(processedData);
      } else {
        setStockData([]);
        setError("No data available.");
      }
    } catch (error) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStockData();
  };

  const calculateSMA = (data, windowSize) => {
    return data.map((_, index) => {
      if (index < windowSize - 1) return null;
      const slice = data.slice(index - windowSize + 1, index + 1);
      const avg = slice.reduce((sum, item) => sum + item.close, 0) / windowSize;
      return avg;
    });
  };

  const renderChart = () => {
    const smaShort = calculateSMA(stockData, 5);
    const smaLong = calculateSMA(stockData, 20);
    const goldenCross = [];
    const deathCross = [];

    for (let i = 1; i < smaShort.length; i++) {
      if (smaShort[i - 1] < smaLong[i - 1] && smaShort[i] > smaLong[i]) {
        goldenCross.push({ x: stockData[i].date, y: smaShort[i] });
      } else if (smaShort[i - 1] > smaLong[i - 1] && smaShort[i] < smaLong[i]) {
        deathCross.push({ x: stockData[i].date, y: smaShort[i] });
      }
    }

    return (
      <Plot
        data={[
          {
            x: stockData.map((item) => item.date),
            open: stockData.map((item) => item.open),
            high: stockData.map((item) => item.high),
            low: stockData.map((item) => item.low),
            close: stockData.map((item) => item.close),
            type: "candlestick",
            name: "Candlestick",
          },
          {
            x: stockData.map((item) => item.date),
            y: smaShort,
            type: "scatter",
            mode: "lines",
            name: "5-day SMA",
            line: { color: "blue" },
          },
          {
            x: stockData.map((item) => item.date),
            y: smaLong,
            type: "scatter",
            mode: "lines",
            name: "20-day SMA",
            line: { color: "pink" },
          },
          {
            x: goldenCross.map((point) => point.x),
            y: goldenCross.map((point) => point.y),
            mode: "markers",
            name: "Golden Cross",
            marker: { color: "purple", size: 10, symbol: "circle" },
          },
          {
            x: deathCross.map((point) => point.x),
            y: deathCross.map((point) => point.y),
            mode: "markers",
            name: "Death Cross",
            marker: { color: "orange", size: 10, symbol: "circle" },
          },
        ]}
        layout={{
          title: "Candlestick Chart with SMAs, Golden and Death Crosses",
          xaxis: { title: "Date", color: "#FFFFFF", rangeslider: { visible: false }},
          yaxis: { title: "Price", color: "#FFFFFF" },
          paper_bgcolor: "#333333",
          height: 700,
          plot_bgcolor: "#333333",
          font: { color: "#FFFFFF" },
          template: "plotly_dark",
          sliders: [],  // Ensure no sliders are present
        }}
        style={{ width: "100%", height: "100%" }}
      />
    );
  };

  return (
    <div style={{ backgroundColor: "#333333", color: "#FFFFFF", minHeight: "100vh", overflow: "auto" }}>
      <div className="container-fluid vh-100">
        <h1 className="text-center text-light py-4">Stock Analysis with SMA Indicators</h1>
        
        <form onSubmit={handleSubmit} className="row justify-content-center mb-4" style={{ textAlign: "center" }}>
          <div className="col-md-8 col-lg-6">
          <div className="row g-2 justify-content-center">
            {[
              { name: "stocksTicker", type: "text", placeholder: "Ticker (e.g., AAPL)" },
              { name: "timestamp", type: "date", placeholder: "Timestamp" },
              { name: "timespan", type: "select", options: ["day", "week", "month", "quarter", "year"], placeholder: "Timespan" },
              { name: "adjusted", type: "select", options: ["true", "false"], placeholder: "Adjusted" },
              { name: "window", type: "number", placeholder: "Window (e.g., 30)" },
              { name: "order", type: "select", options: ["asc", "desc"], placeholder: "Order" },
              { name: "limit", type: "number", placeholder: "Limit (e.g., 100)" },
            ].map((field, index) => (
              <div className="col-6 col-md-3" key={index}>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formInputs[field.name]}
                    onChange={handleInputChange}
                    className="form-control"
                    style={{
                      backgroundColor: "#FFFFFF",
                      color: "#000000",
                      borderRadius: "4px",
                      padding: "8px 12px",
                      border: "1px solid #555"
                    }}
                  >
                    <option value="" disabled>{field.placeholder}</option>
                    {field.options.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
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
                    style={{
                      backgroundColor: "#FFFFFF",
                      color: "#000000",
                      borderRadius: "4px",
                      padding: "8px 12px",
                      border: "1px solid #555"
                    }}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
            <div className="text-center mt-3">
              <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px", borderRadius: "4px" }}>
                Submit
              </button>
            </div>
          </div>
        </form>

        <div className="row justify-content-center">
          <div className="col-12">
            {loading ? <p className="text-center">Loading...</p> : error ? <p className="text-danger">{error}</p> : renderChart()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmaGraph;
