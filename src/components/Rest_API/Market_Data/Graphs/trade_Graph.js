import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useLocation } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const TradesGraph = () => {
  const location = useLocation();
  const { formData } = location.state || {};

  const [tradeData, setTradeData] = useState([]);
  const [formInputs, setFormInputs] = useState({
    stocksTicker: formData?.stocksTicker,
    timestamp: formData?.timestamp,
    sort: formData?.sort,
    order: formData?.order,
    limit: formData?.limit,
  });

  const fetchTradeData = async () => {
    try {
      const response = await axios.get(`https://api.polygon.io/v3/trades/${formInputs.stocksTicker}`, {
        params: {
          timestamp: formInputs.timestamp,
          order: formInputs.order,
          limit: formInputs.limit,
          sort: formInputs.sort,
          apiKey: "L_aeUHEjW5ATmIIeTQPeviyJpg4ODuYG",
        },
      });
      const data = response.data.results || [];
      processTradeData(data);
    } catch (error) {
      console.error("Error fetching trade data:", error);
    }
  };

  const processTradeData = (trades) => {
    const processedData = trades.map((trade) => ({
      ...trade,
      participant_timestamp: new Date(trade.participant_timestamp / 1e6).toISOString().slice(0, 19).replace("T", " "),
      sip_timestamp: new Date(trade.sip_timestamp / 1e6).toISOString().slice(0, 19).replace("T", " "),
    }));

    const cumulativeData = calculateVWAP(processedData);
    setTradeData(cumulativeData);
  };

  const calculateVWAP = (data) => {
    let cumulativeVolume = 0;
    let cumulativeDollarVolume = 0;

    const updatedData = data.map((trade) => {
      cumulativeVolume += trade.size;
      cumulativeDollarVolume += trade.price * trade.size;

      const vwap = cumulativeDollarVolume / cumulativeVolume;
      return { ...trade, VWAP: vwap };
    });

    return updatedData;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTradeData();
  };

  useEffect(() => {
    fetchTradeData();
  }, []);

  if (tradeData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="vh-100" style={{ backgroundColor: "#333333", color: "#FFFFFF", overflowY: "auto", height: "100vh" }}>
      <div className="container-fluid vh-100">
        <div className="row justify-content-center py-3">
          <h2 className="text-center">Trade Graph</h2>
        </div>

        <form onSubmit={handleSubmit} className="text-center mb-4">
          <div className="mb-4">
            <div className="row g-2 justify-content-center">
              {[ 
                { label: "Ticker", name: "stocksTicker", type: "text" }, 
                { label: "Timestamp", name: "timestamp", type: "date" }, 
                { label: "Sort", name: "sort", type: "select", options: ["Select sort", "timestamp"] }, 
                { label: "Order", name: "order", type: "select", options: ["Select order", "asc", "desc"] }, 
                { label: "Limit", name: "limit", type: "number" }, 
              ].map((field, index) => (
                <div className="col-auto" key={index}>
                  <label className="visually-hidden">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formInputs[field.name]}
                      onChange={handleInputChange}
                      className="form-control"
                      style={{ backgroundColor: "#ffffff", color: "#000000", border: "none" }} // Set input to white background
                    >
                      {field.options.map((option, i) => (
                        <option key={i} value={option === "Select sort" || option === "Select order" ? "" : option}>
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
                      style={{ backgroundColor: "#ffffff", color: "#000000", border: "none" }} // Set input to white background
                      placeholder={field.label} 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#007bff", border: "none" }}> {/* Set button to blue */}
            Submit
          </button>
        </form>

        {/* Volume Profile Histogram */}
        <div className="row mb-4">
          <div className="col-12">
            <Plot
              data={[{
                x: tradeData.map((item) => item.price),
                y: tradeData.map((item) => item.size),
                type: "histogram",
                name: "Volume",
                marker: { color: "#1f77b4" },
              }]}
              layout={{
                title: "Volume Profile Histogram",
                xaxis: { title: "Price", color: "#FFFFFF" },
                yaxis: { title: "Volume", color: "#FFFFFF" },
                paper_bgcolor: "#333333", // Set graph background
                plot_bgcolor: "#333333",  // Set plot area background
                font: { color: "#FFFFFF" }, // Set text color to white
                template: "plotly_dark",
              }}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* Trade Prices and VWAP Over Time */}
        <div className="row">
          <div className="col-12">
            <Plot
              data={[
                {
                  x: tradeData.map((item) => item.participant_timestamp),
                  y: tradeData.map((item) => item.price),
                  mode: "markers",
                  type: "scatter",
                  name: "Trade Prices",
                  marker: { color: "blue", size: 5 },
                },
                {
                  x: tradeData.map((item) => item.participant_timestamp),
                  y: tradeData.map((item) => item.VWAP),
                  mode: "lines",
                  type: "scatter",
                  name: "VWAP",
                  line: { color: "red", width: 2 },
                },
              ]}
              layout={{
                title: "Trade Prices and VWAP Over Time",
                xaxis: { title: "Time", color: "#FFFFFF" },
                yaxis: { title: "Price", color: "#FFFFFF" },
                paper_bgcolor: "#333333", // Set graph background
                plot_bgcolor: "#333333",  // Set plot area background
                font: { color: "#FFFFFF" }, // Set text color to white
                template: "plotly_dark",
              }}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradesGraph;
