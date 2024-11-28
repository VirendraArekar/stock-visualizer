import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const EmaGraph = () => {
  const location = useLocation();
  const { formData } = location.state || {};

  const [stockData, setStockData] = useState([]);
  const [formInputs, setFormInputs] = useState({
    stocksTicker: formData?.stocksTicker || "AAPL",
    timestamp: formData?.timestamp || "2024-10-15",
    timespan: formData?.timespan || "day",
    adjusted: formData?.adjusted || "true",
    window: formData?.window || 50,
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
      const url = `https://api.polygon.io/v1/indicators/ema/${formInputs.stocksTicker}`;
      const response = await axios.get(url, {
        params: {
          ...formInputs,
          apiKey,
        },
      });
      const aggregates = response.data?.results?.underlying?.aggregates;
      if (aggregates && aggregates.length > 0) {
        const processedData = aggregates.map(item => ({
          date: new Date(item.t),
          open: item.o,
          high: item.h,
          low: item.l,
          close: item.c,
        }));
        const df = calculateEMA(processedData);
        setStockData(df);
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

  const calculateEMA = (data) => {
    const calculateSingleEMA = (data, span) => {
      const multiplier = 2 / (span + 1);
      let ema = [];
      data.forEach((item, index) => {
        if (index === 0) ema.push(item.close);
        else ema.push(((item.close - ema[index - 1]) * multiplier) + ema[index - 1]);
      });
      return ema;
    };

    const emaData = data.map((item, index) => ({
      ...item,
      EMA_10: calculateSingleEMA(data, 10)[index],
      EMA_20: calculateSingleEMA(data, 20)[index],
      EMA_30: calculateSingleEMA(data, 30)[index],
      EMA_40: calculateSingleEMA(data, 40)[index],
      EMA_50: calculateSingleEMA(data, 50)[index],
      EMA_60: calculateSingleEMA(data, 60)[index],
      EMA_70: calculateSingleEMA(data, 70)[index],
    }));

    return emaData;
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStockData();
  };

  const renderChart = () => {
    return (
      <Plot
        data={[
          {
            x: stockData.map(item => item.date),
            open: stockData.map(item => item.open),
            high: stockData.map(item => item.high),
            low: stockData.map(item => item.low),
            close: stockData.map(item => item.close),
            type: "candlestick",
            name: "Candlestick",
          },
          ...[10, 20, 30, 40, 50, 60, 70].map(span => ({
            x: stockData.map(item => item.date),
            y: stockData.map(item => item[`EMA_${span}`]),
            type: "scatter",
            mode: "lines",
            name: `${span}-Day EMA`,
            line: { width: 1.5 },
          })),
        ]}
        layout={{
          title: "Candlestick Chart with EMAs",
          height: 700,
          showlegend: true,
          xaxis: { title: "Date", color: "#FFFFFF", rangeslider: { visible: false } },
          yaxis: { title: "Price", color: "#FFFFFF" },
          paper_bgcolor: "#333333",
          plot_bgcolor: "#333333",
          font: { color: "#FFFFFF" },
          template: "plotly_dark",
        }}
        config={{ responsive: true }}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
      />
    );
  };

  return (
    <div className="vh-100" style={{ backgroundColor: "#333333", color: "#FFFFFF", overflowY: "auto" }}>
      <div className="container-fluid vh-100">
        <div className="text-center py-3">
          <h1>EMA Chart</h1>
        </div>
        <form onSubmit={handleSubmit} className="text-center mb-4">
          <div className="mb-4">
            <div className="row g-2 justify-content-center">
              {[
                { label: "Ticker", name: "stocksTicker", type: "text", placeholder: "AAPL" },
                { label: "Timestamp", name: "timestamp", type: "date" },
                { label: "Timespan", name: "timespan", type: "select", options: ["minute", "hour", "day", "week", "month", "quarter", "year"] },
                { label: "Adjusted", name: "adjusted", type: "select", options: ["true", "false"] },
                { label: "Window", name: "window", type: "number", placeholder: "14" },
                { label: "Series Type", name: "series_type", type: "select", options: ["close", "open", "high", "low"] },
                { label: "Order", name: "order", type: "select", options: ["asc", "desc"] },
                { label: "Limit", name: "limit", type: "number", placeholder: "100" },
              ].map((field, index) => (
                <div className="col-auto" key={index}>
                  <label className="visually-hidden">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      className="form-control"
                      name={field.name}
                      value={formInputs[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.label}
                    >
                      {field.options.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="form-control"
                      name={field.name}
                      value={formInputs[field.name]}
                      placeholder={field.placeholder || field.label}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Fetch Data</button>
        </form>

        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-12"> {/* Changed from col-md-10 to col-md-12 for full width */}
            <div className="text-center">
              {loading ? <div>Loading...</div> : renderChart()}
              {error && <div className="text-danger">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmaGraph;
