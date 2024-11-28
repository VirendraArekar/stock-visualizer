import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Plot from 'react-plotly.js';
import "bootstrap/dist/css/bootstrap.min.css";

const MACDChart = () => {
  const location = useLocation();
  const { formData } = location.state || {};

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formParams, setFormParams] = useState({
    symbol: formData?.stocksTicker,
    timestamp: formData?.timestamp,
    short_window: formData?.short_window,
    long_window: formData?.long_window,
    signal_window: formData?.signal_window,
    timespan: formData?.timespan,
    adjusted: formData?.adjusted,
    series_type: formData?.series_type,
    expand_underlying: formData?.expand_underlying,
    order: formData?.order,
    limit: formData?.limit
  });

  const fetchData = async () => {
    setLoading(true);
    const url = `https://api.polygon.io/v1/indicators/macd/${formParams.symbol}`;
    const params = {
      timestamp: formParams.timestamp,
      timespan: formParams.timespan,
      adjusted: formParams.adjusted,
      short_window: formParams.short_window,
      long_window: formParams.long_window,
      signal_window: formParams.signal_window,
      series_type: formParams.series_type,
      expand_underlying: formParams.expand_underlying,
      order: formParams.order,
      limit: formParams.limit,
      apiKey: 'L_aeUHEjW5ATmIIeTQPeviyJpg4ODuYG'
    };

    try {
      const response = await axios.get(url, { params });
      setData(processData(response.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processData = (data) => {
    const aggregates = data.results.underlying.aggregates;
    const timestamps = aggregates.map((agg) => new Date(agg.t));
    const open = aggregates.map((agg) => agg.o);
    const close = aggregates.map((agg) => agg.c);
    const high = aggregates.map((agg) => agg.h);
    const low = aggregates.map((agg) => agg.l);

    const ema12 = calculateEMA(close, formParams.short_window);
    const ema26 = calculateEMA(close, formParams.long_window);
    const macd = ema12.map((val, i) => val - ema26[i]);
    const signalLine = calculateEMA(macd, formParams.signal_window);
    const macdHistogram = macd.map((val, i) => val - signalLine[i]);

    const divergences = detectDivergences(close, macd, timestamps);

    return { timestamps, open, close, high, low, macdHistogram, divergences };
  };

  const calculateEMA = (prices, window) => {
    const k = 2 / (window + 1);
    let emaArray = [prices[0]];
    for (let i = 1; i < prices.length; i++) {
      emaArray.push(prices[i] * k + emaArray[i - 1] * (1 - k));
    }
    return emaArray;
  };

  const detectDivergences = (close, macd, timestamps) => {
    const divergences = [];
    for (let i = 1; i < close.length; i++) {
      if (close[i] < close[i - 1] && macd[i] > macd[i - 1]) {
        divergences.push({ time: timestamps.slice(i - 1, i + 1), type: 'Bullish', color: 'blue' });
      } else if (close[i] > close[i - 1] && macd[i] < macd[i - 1]) {
        divergences.push({ time: timestamps.slice(i - 1, i + 1), type: 'Bearish', color: 'purple' });
      }
    }
    return divergences;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormParams((prevParams) => ({
      ...prevParams,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  const renderPlot = () => {
    const { timestamps, open, close, high, low, macdHistogram, divergences } = data;

    return (
      <div className="svg-container d-flex justify-content-center align-items-center w-100" style={{ userSelect: 'none' }}>
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
              y: macdHistogram,
              type: 'bar',
              name: 'MACD Histogram',
              marker: {
                color: macdHistogram.map(val => (val >= 0 ? 'green' : 'red')),
                opacity: 0.5
              },
              xaxis: 'x',
              yaxis: 'y2'
            },
            ...divergences.map((div) => ({
              x: div.time,
              y: div.time.map(t => macdHistogram[timestamps.indexOf(t)]),
              mode: 'lines',
              line: { color: div.color, width: 2 },
              showlegend: false,
              xaxis: 'x',
              yaxis: 'y2'
            })),
            {
              x: [null],
              y: [null],
              mode: 'lines',
              line: { color: 'blue', width: 2 },
              name: 'Bullish Divergence',
              showlegend: true,
              xaxis: 'x',
              yaxis: 'y2'
            },
            {
              x: [null],
              y: [null],
              mode: 'lines',
              line: { color: 'purple', width: 2 },
              name: 'Bearish Divergence',
              showlegend: true,
              xaxis: 'x',
              yaxis: 'y2'
            }
          ]}
          layout={{
            title: {
              text: 'Candlestick Chart with MACD Histogram and Divergences',
              font: { color: '#FFFFFF' }
            },
            grid: { rows: 2, columns: 1, pattern: 'independent' },
            yaxis1: {
              title: { text: 'Stock Price', font: { color: '#FFFFFF' } },
              tickfont: { color: '#FFFFFF' },
              domain: [0.4, 1],
              bgcolor: '#333333',
              color: '#FFFFFF'
            },
            showlegend: true,
            yaxis2: {
              title: { text: 'MACD', font: { color: '#FFFFFF' } },
              tickfont: { color: '#FFFFFF' },
              domain: [0, 0.3],
              bgcolor: '#333333',
              color: '#FFFFFF'
            },
            xaxis: {
              title: { text: 'Timestamp', font: { color: '#FFFFFF' } },
              tickfont: { color: '#FFFFFF' },
              rangeslider: { visible: false }
            },
            height: 700,
            paper_bgcolor: "#333333",
            plot_bgcolor: "#333333",
            font: { color: "#FFFFFF" },
          }}
          config={{ responsive: true }}
          useResizeHandler
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  };

  useEffect(() => {
    // Call fetchData when the component mounts
    fetchData();
  }, []); // Empty dependency array to only run once on mount

  return (
    <div className="vh-100" style={{ backgroundColor: "#333333" }}>
      <div style={{ color: "#FFFFFF", height: '100vh' }}>
        <div className="text-center py-3">
          <h1>MACD Chart</h1>
        </div>

        <form onSubmit={handleSubmit} className="text-center mb-4">
        <div className="mb-4">
          <div className="row g-2 justify-content-center">
            {[
              { label: "Ticker", name: "symbol", type: "text" },
              { label: "Timestamp", name: "timestamp", type: "date" },
              { label: "Short Window", name: "short_window", type: "number" },
              { label: "Long Window", name: "long_window", type: "number" },
              { label: "Signal Window", name: "signal_window", type: "number" },
              { label: "Timespan", name: "timespan", type: "text" },
              { label: "Adjusted", name: "adjusted", type: "text" },
              { label: "Series Type", name: "series_type", type: "text" },
              { label: "Expand Underlying", name: "expand_underlying", type: "text" },
              { label: "Order", name: "order", type: "text" },
              { label: "Limit", name: "limit", type: "number" },
            ].map(({ label, name, type }) => (
              <div className="col-auto" key={name}>
                <label className="visually-hidden">{label}</label>
                <input
                  type={type}
                  className="form-control"
                  name={name}
                  value={formParams[name]}
                  onChange={handleInputChange}
                  placeholder={label} // Change here to set the label as the placeholder
                />
              </div>
            ))}
          </div>
        </div>

          <button type="submit" className="btn btn-primary">Fetch Data</button>
        </form>

        {loading && <div className="text-center">Loading...</div>}
        {data && renderPlot()}
      </div>
    </div>
  );
};

export default MACDChart;
