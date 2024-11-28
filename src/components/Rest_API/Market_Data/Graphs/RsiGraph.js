import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import * as d3 from 'd3';

const processStockData = (results) => {
  return results.map((result) => ({
    Volume: result.v,
    VWAP: result.vw,
    Open: result.o,
    Close: result.c,
    High: result.h,
    Low: result.l,
    Timestamp: new Date(result.t).toLocaleString(),
    NumberOfTransactions: result.n
  }));
};

const calculateRSI = (data, window = 14) => {
  const gains = [];
  const losses = [];
  const rsiData = [];

  for (let i = 1; i < data.length; i++) {
    const delta = data[i].Close - data[i - 1].Close;
    gains.push(delta > 0 ? delta : 0);
    losses.push(delta < 0 ? -delta : 0);
  }

  for (let i = 0; i < gains.length; i++) {
    const avgGain = gains.slice(Math.max(0, i - window + 1), i + 1).reduce((a, b) => a + b, 0) / window;
    const avgLoss = losses.slice(Math.max(0, i - window + 1), i + 1).reduce((a, b) => a + b, 0) / window;
    const rs = avgLoss === 0 ? 0 : avgGain / avgLoss;
    rsiData.push(100 - (100 / (1 + rs)));
  }

  return rsiData;
};

const RsiGraph = () => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const { formData } = location.state || {};

  const [formInputs, setFormInputs] = useState({
    stocksTicker: formData?.stocksTicker || 'AAPL',
    timestamp: formData?.timestamp || '2024-10-16',
    timespan: formData?.timespan || 'day',
    adjusted: formData?.adjusted || 'true',
    window: formData?.window || 14,
    series_type: formData?.series_type || 'open',
    expand_underlying: formData?.expand_underlying || 'true',
    order: formData?.order || 'asc',
    limit: formData?.limit || 100,
  });

  const apiKey = 'L_aeUHEjW5ATmIIeTQPeviyJpg4ODuYG';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchData = async () => {
    try {
      const url = `https://api.polygon.io/v1/indicators/rsi/${formInputs.stocksTicker}`;
      const response = await axios.get(url, {
        params: {
          ...formInputs,
          apiKey,
        },
      });
      const results = response.data?.results?.underlying?.aggregates;
      if (results && results.length > 0) {
        const processedData = processStockData(results);
        const rsiData = calculateRSI(processedData);

        const combinedData = processedData.map((item, index) => ({
          ...item,
          RSI: rsiData[index] || null,
        }));

        setData(combinedData);
      } else {
        setData([]);
        console.error('No data available.');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  const timestamps = data.map(item => item.Timestamp);
  const open = data.map(item => item.Open);
  const high = data.map(item => item.High);
  const low = data.map(item => item.Low);
  const close = data.map(item => item.Close);
  const rsi = data.map(item => item.RSI);

  // Adjust timestamp format based on timespan
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (formInputs.timespan === 'minute' || formInputs.timespan === 'hour') {
      return d3.timeFormat('%H:%M')(date); // Hour:Minute for minute and hour granularity
    } else if (formInputs.timespan === 'day') {
      return d3.timeFormat('%b %d')(date); // Month Day for daily data
    } else {
      return d3.timeFormat('%b %Y')(date); // Month Year for larger timespans like week, month, etc.
    }
  };

  const formattedTimestamps = timestamps.map(formatTimestamp);

  // Calculate tick values and tick text
  const tickValues = formattedTimestamps.filter((_, index) => index % Math.ceil(formattedTimestamps.length / 10) === 0);
  const tickText = tickValues;

  return (
    <div className="container-fluid vh-100 p-0" style={{ backgroundColor: "#333333", color: "#FFFFFF" }}>
      <div className="row justify-content-center py-3"></div>

      <form onSubmit={handleSubmit} className="row justify-content-center mb-4">
        <div className="col-md-8 col-lg-6">
          <div className="row g-3">
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
              <div className="col-6" key={index}>
                <label className="form-label">{field.label}</label>
                {field.type === "select" ? (
                  <select
                    className="form-select"
                    name={field.name}
                    value={formInputs[field.name]}
                    onChange={handleInputChange}
                  >
                    {field.options.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    className="form-control"
                    name={field.name}
                    value={formInputs[field.name]}
                    placeholder={field.placeholder}
                    onChange={handleInputChange}
                  />
                )}
              </div>
            ))}
            <div className="col-12">
              <button type="submit" className="btn btn-primary">Fetch Data</button>
            </div>
          </div>
        </div>
      </form>

      {data.length > 0 && (
        <div className="w-100" style={{ width: '100%' }}>
          <Plot
            data={[
              {
                x: timestamps,
                open: open,
                high: high,
                low: low,
                close: close,
                type: 'candlestick',
                name: 'Candlestick',
                xaxis: 'x',
                yaxis: 'y1'
              },
              {
                x: timestamps,
                y: rsi,
                type: 'scatter',
                mode: 'lines',
                name: 'RSI',
                line: { color: 'blue' },
                xaxis: 'x',
                yaxis: 'y2'
              },
              {
                x: timestamps,
                y: new Array(timestamps.length).fill(70),
                type: 'scatter',
                mode: 'lines',
                name: 'Overbought',
                line: { color: 'red', dash: 'dash' },
                xaxis: 'x',
                yaxis: 'y2'
              },
              {
                x: timestamps,
                y: new Array(timestamps.length).fill(30),
                type: 'scatter',
                mode: 'lines',
                name: 'Oversold',
                line: { color: 'green', dash: 'dash' },
                xaxis: 'x',
                yaxis: 'y2'
              },
            ]}
            layout={{
              title: 'RSI and Candlestick Chart',
              grid: { rows: 2, columns: 1, pattern: 'independent' },
              xaxis: {
                title: { text: 'Timestamp', font: { color: '#FFFFFF' } },
                tickfont: { color: '#FFFFFF' },
                rangeslider: { visible: false },
                showticklabels: false
              },
              yaxis: {
                title: 'Price',
                domain: [0.55, 1],
              },
              yaxis2: {
                title: 'RSI',
                domain: [0, 0.45],
                range: [0, 100],
              },
              height: 700,
              autosize: true, // Ensures it fits width dynamically
              plot_bgcolor: '#333333',
              paper_bgcolor: '#333333',
              font: {
                color: '#FFFFFF',
              },
            }}
            config={{ responsive: true }}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default RsiGraph;
