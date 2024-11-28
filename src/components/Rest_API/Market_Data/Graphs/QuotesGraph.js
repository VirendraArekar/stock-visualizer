import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useLocation } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const QuotesGraph = () => {
  const location = useLocation();
  const { formData } = location.state || {};

  const [quoteData, setQuoteData] = useState([]);
  const [formInputs, setFormInputs] = useState({
    stocksTicker: formData?.stocksTicker || "AAPL",
    timestamp: formData?.timestamp || "2024-10-14",
    sort: formData?.sort || "timestamp",
    order: formData?.order || "asc",
    limit: formData?.limit || 1000,
  });

  const fetchQuoteData = async () => {
    try {
      const response = await axios.get(`https://api.polygon.io/v3/quotes/${formInputs.stocksTicker}`, {
        params: {
          timestamp: formInputs.timestamp,
          order: formInputs.order,
          limit: formInputs.limit,
          sort: formInputs.sort,
          apiKey: "L_aeUHEjW5ATmIIeTQPeviyJpg4ODuYG", // Replace with your API key
        },
      });
      const data = response.data.results || [];
      processQuoteData(data);
    } catch (error) {
      console.error("Error fetching quote data:", error);
    }
  };

  const processQuoteData = (quotes) => {
    const processedData = quotes.map((quote) => ({
      ...quote,
      participant_timestamp: new Date(quote.participant_timestamp / 1e6).toISOString().slice(0, 19).replace("T", " "),
      sip_timestamp: new Date(quote.sip_timestamp / 1e6).toISOString().slice(0, 19).replace("T", " "),
      obi_size: (quote.bid_size - quote.ask_size) / (quote.bid_size + quote.ask_size) || 0,
    }));
    setQuoteData(processedData);
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
    fetchQuoteData();
  };

  useEffect(() => {
    fetchQuoteData();
  }, []);

  if (quoteData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="vh-100" style={{ backgroundColor: "#333333", color: "#FFFFFF", overflowY: "auto" }}>
      <div className="container-fluid" style={{ minHeight: "100vh" }}>
        <div className="text-center py-3">
          <h1>Quotes Graph</h1>
        </div>

        <form onSubmit={handleSubmit} className="text-center mb-4">
          <div className="mb-4">
            <div className="row g-2 justify-content-center">
              {[{ label: "Ticker", name: "stocksTicker", type: "text" },
                { label: "Timestamp", name: "timestamp", type: "date" },
                { label: "Sort", name: "sort", type: "select", options: ["Select sort", "timestamp"] },
                { label: "Order", name: "order", type: "select", options: ["Select order", "asc", "desc"] },
                { label: "Limit", name: "limit", type: "number" }]
                .map((field) => (
                  <div className="col-auto" key={field.name}>
                    <label className="visually-hidden">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={formInputs[field.name]}
                        onChange={handleInputChange}
                        className="form-control"
                        style={{ backgroundColor: "#ffffff", color: "#000000", border: "1px solid #ccc" }}
                      >
                        {field.options.map((option, index) => (
                          <option key={index} value={option === "Select sort" || option === "Select order" ? "" : option}>
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
                        style={{ backgroundColor: "#ffffff", color: "#000000", border: "1px solid #ccc" }}
                        placeholder={field.label}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#007bff", border: "none" }}>
            Submit
          </button>
        </form>

        {/* Bid-Ask Spread and Order Book Imbalance Heatmap */}
        <div className="row">
          <div className="col-12">
            <Plot
              data={[
                ...Array.from({ length: 20 }, (_, i) => ({
                  x: quoteData.map((item) => item.participant_timestamp),
                  y: quoteData.map((item) => item.obi_size + i * 0.03 * item.bid_size),
                  fill: 'tonexty',
                  type: 'scatter',
                  mode: 'none',
                  name: `OBI to Bid Layer ${i + 1}`,
                  fillcolor: `rgba(0, 255, 0, ${0.1 + i * 0.05})`,
                  showlegend: false,
                })),
                ...Array.from({ length: 20 }, (_, i) => ({
                  x: quoteData.map((item) => item.participant_timestamp),
                  y: quoteData.map((item) => item.obi_size - i * 0.03 * item.ask_size),
                  fill: 'tonexty',
                  type: 'scatter',
                  mode: 'none',
                  name: `OBI to Ask Layer ${i + 1}`,
                  fillcolor: `rgba(255, 0, 0, ${0.1 + i * 0.05})`,
                  showlegend: false,
                })),
                {
                  x: quoteData.map((item) => item.participant_timestamp),
                  y: quoteData.map((item) => item.obi_size),
                  mode: 'lines',
                  type: 'scatter',
                  name: 'Order Book Imbalance (OBI)',
                  line: { color: "yellow", width: 2 },
                },
              ]}
              layout={{
                title: "Bid-Ask Spread and Order Book Imbalance Over Time",
                height: 700,
                xaxis: { title: "Timestamp", color: "#FFFFFF" },
                yaxis: { title: "Values", color: "#FFFFFF" },
                paper_bgcolor: "#333333",
                plot_bgcolor: "#333333",
                font: { color: "#FFFFFF" },
                template: "plotly_dark",
                annotations: [
                  {
                    xref: 'paper',
                    yref: 'y',
                    x: 0.05,
                    y: quoteData.reduce((max, item) => Math.max(max, item.obi_size + 20 * 0.03 * item.bid_size), 0),
                    xanchor: 'left',
                    yanchor: 'middle',
                    text: 'Bid Spread Area',
                    showarrow: false,
                    font: { color: '#00FF00', size: 12 },
                  },
                  {
                    xref: 'paper',
                    yref: 'y',
                    x: 0.05,
                    y: quoteData.reduce((min, item) => Math.min(min, item.obi_size - 20 * 0.03 * item.ask_size), 0),
                    xanchor: 'left',
                    yanchor: 'middle',
                    text: 'Ask Spread Area',
                    showarrow: false,
                    font: { color: '#FF0000', size: 12 },
                  },
                ],
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

export default QuotesGraph;
