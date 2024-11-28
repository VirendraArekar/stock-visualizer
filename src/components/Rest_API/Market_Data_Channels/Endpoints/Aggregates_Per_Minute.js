import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_KEY = "L_aeUHEjW5ATmIIeTQPeviyJpg4ODuYG";

function AggregatePerMinute() {
    const [data, setData] = useState({
        timestamp: [],
        open: [],
        high: [],
        low: [],
        close: [],
        volatility: []
    });
    
    const [timeFrame, setTimeFrame] = useState('all');
    const [ticker, setTicker] = useState('');
    const [symbol, setSymbol] = useState('');

    useEffect(() => {
        if (!symbol) return;

        async function fetchHistoricalData() {
            const currentTime = new Date();
            const startOfDay = new Date(currentTime.setHours(0, 0, 0, 0));
            const start_date = startOfDay.toISOString().split('T')[0];
            const end_date = new Date().toISOString().split('T')[0];

            const endpoint = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/minute/${start_date}/${end_date}?adjusted=true&sort=asc&limit=50000&apiKey=${API_KEY}`;
            const response = await axios.get(endpoint);
            if (response.status === 200) {
                const results = response.data.results;
                const newData = { timestamp: [], open: [], high: [], low: [], close: [], volatility: [] };
                results.forEach(event => {
                    newData.timestamp.push(new Date(event.t).toISOString());
                    newData.open.push(event.o);
                    newData.high.push(event.h);
                    newData.low.push(event.l);
                    newData.close.push(event.c);
                    newData.volatility.push(((event.h - event.l) / event.o) * 100);
                });
                setData(newData);
            }
        }

        fetchHistoricalData();
    }, [symbol]);

    useEffect(() => {
        if (!symbol) return;

        const ws = new WebSocket("wss://socket.polygon.io/stocks");

        ws.onopen = () => {
            ws.send(JSON.stringify({ action: "auth", params: API_KEY }));
            ws.send(JSON.stringify({ action: "subscribe", params: `AM.${symbol}` }));
        };

        ws.onmessage = (event) => {
            const response = JSON.parse(event.data);
            response.forEach(data => {
                if (data.ev === "AM") {
                    setData(prevData => ({
                        timestamp: [...prevData.timestamp, new Date(data.s).toISOString()],
                        open: [...prevData.open, data.o],
                        high: [...prevData.high, data.h],
                        low: [...prevData.low, data.l],
                        close: [...prevData.close, data.c],
                        volatility: [...prevData.volatility, ((data.h - data.l) / data.o) * 100]
                    }));
                }
            });
        };

        return () => ws.close();
    }, [symbol]);

    const filteredData = (() => {
        const cutoff = new Date();
        switch (timeFrame) {
            case '1h': cutoff.setHours(cutoff.getHours() - 1); break;
            case '3h': cutoff.setHours(cutoff.getHours() - 3); break;
            case '6h': cutoff.setHours(cutoff.getHours() - 6); break;
            case '12h': cutoff.setHours(cutoff.getHours() - 12); break;
            default: return data;
        }
        const startIndex = data.timestamp.findIndex(timestamp => new Date(timestamp) >= cutoff);
        return {
            timestamp: data.timestamp.slice(startIndex),
            open: data.open.slice(startIndex),
            high: data.high.slice(startIndex),
            low: data.low.slice(startIndex),
            close: data.close.slice(startIndex),
            volatility: data.volatility.slice(startIndex)
        };
    })();

    const handleSubmit = (e) => {
        e.preventDefault();
        setSymbol(ticker.toUpperCase());
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#333333", padding: "20px", height: "100vh", width: "100%" }}>
            <form onSubmit={handleSubmit} className="d-flex mb-3">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Enter Stock Ticker"
                    style={{ color: "white", backgroundColor: "#555", border: "1px solid white" }}
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                />
                <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: "rgb(240, 108, 0)", color: "white" }}
                >
                    Submit
                </button>
            </form>


            {symbol && (
                <>
                    <div className="btn-group mb-3">
                        {['all', '12h', '6h', '3h', '1h'].map(time => (
                            <button
                                key={time}
                                className={`btn ${timeFrame === time ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                onClick={() => setTimeFrame(time)}
                            >
                                {time === 'all' ? 'All' : time}
                            </button>
                        ))}
                    </div>

                    <Plot
                        data={[
                            {
                                x: filteredData.timestamp,
                                open: filteredData.open,
                                high: filteredData.high,
                                low: filteredData.low,
                                close: filteredData.close,
                                type: 'candlestick',
                                name: 'OHLC',
                                xaxis: 'x',
                                yaxis: 'y'
                            },
                            {
                                x: filteredData.timestamp,
                                y: filteredData.volatility,
                                type: 'scatter',
                                mode: 'lines',
                                name: 'Volatility (%)',
                                fill: 'tozeroy',
                                xaxis: 'x2',
                                yaxis: 'y2'
                            }
                        ]}
                        layout={{
                            title: {
                                text: `Live Candlestick and Volatility Chart for ${symbol}`,
                                font: { color: 'white' }
                            },
                            grid: { rows: 2, columns: 1, pattern: 'independent' },
                            xaxis: { title: 'Time', domain: [0, 1], rangeslider: { visible: false }, color: 'white' },
                            yaxis: { title: 'Price', color: 'white' },
                            xaxis2: { title: 'Time', rangeslider: { visible: false }, color: 'white' },
                            yaxis2: { title: 'Volatility (%)', color: 'white' },
                            height: 800,
                            showlegend: false,
                            paper_bgcolor: '#333333',
                            plot_bgcolor: '#333333',
                        }}
                        style={{ width: "100%", height: "100%" }}
                    />
                </>
            )}
        </div>
    );
}

export default AggregatePerMinute;
