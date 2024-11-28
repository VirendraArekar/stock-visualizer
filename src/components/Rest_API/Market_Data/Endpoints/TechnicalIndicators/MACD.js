import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Config } from '../../../../constants';
import axios from 'axios';

const MACD = (props) => {
  console.log(props,"MACDprops")
  const { formData, handleInputChange, selectedAPI } = props;
  const [state, setState] = useState({
    processedData: [],
    loading: false,
  });

  const navigate = useNavigate();
  const closeModal = () => {
    setState(prev => ({ ...prev, showError: false, errorMessage: "" }));
  };
  useEffect(() => {
    if (state.showError) {
      console.log("Error Modal is active");
    }
  }, [state.showError]);
  const handleSubmit = async () => {
    const missingFields = [];
    if (!formData.stocksTicker) missingFields.push("stocksTicker");
    if (missingFields.length > 0) {
      setState(prev => ({ ...prev, showError: true, errorMessage: `Please fill in the required fields: ${missingFields.join(", ")}.`}));
      return;
    }
    const currentDate = new Date();
    const TimeStamp = new Date(formData.timestamp);
    
    if (TimeStamp > currentDate) {
      setState(prev => ({ ...prev, showError: true, errorMessage: `Timestamp cannot be greater than or equal to the current date.` }));
      return;
    }
    const apiUrl = `${Config[selectedAPI].url}${formData.stocksTicker}`;
  
    const params = Object.entries({
      timespan:formData.timespan,
      short_window:formData.short_window,
      signal_window:formData.signal_window,
      long_window:formData.long_window,
      adjusted:formData.adjusted,
      order:formData.order,
      limit:formData.limit,
      series_type:formData.series_type,
      expand_underlying:formData.expand_underlying,
      apiKey: Config.Apikey
    }).reduce((acc, [key, value]) => {
      if (value != null && value !== "") acc[key] = value;
      return acc;
    }, {});

    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await axios.get(apiUrl, {params});
      const data = response.data;
  
      if (
        data?.results?.underlying?.aggregates &&
        data?.results?.underlying?.aggregates?.length > 0
      ) {
        processStockData(data.results.underlying.aggregates);
      } else if (data?.results?.underlying?.aggregates?.length === 0) {
        setState((prev) => ({
          ...prev,
          processedData: [],
          showError: true,
          errorMessage: "No data available",
        }));
      }else{
        setState((prev) => ({
          ...prev,
          processedData: [],
          showError: true,
          errorMessage: "No data available",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        processedData: [],
        showError: true,
        errorMessage: error.message || "An error occurred.",
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const processStockData = (results) => {
    console.log(results,"smaresults")
    const rows = results.map(result => ({
      closePrice: result.c,
      highestPrice: result.h,
      aggregatewindow:result.n,
      openPrice: result.o,
      OtcTicker: result.otc,
      timestamp: result.t,
      volume: result.v,
      VolumeWeight: result.vw,
    }));

    setState(prev => ({ ...prev, processedData: rows }));
  };


  const downloadCSV = () => {
    const csvRows = [
      ['closePrice', 'highestPrice', 'aggregatewindow', 'openPrice', 'Timestamp', 'Volume','VolumeWeight'],
      ...state.processedData.map(row => [
        row.closePrice,
        row.highestPrice,
        row.aggregatewindow,
        row.openPrice,
        row.timestamp,
        row.volume,
        row.VolumeWeight
      ])
    ];

    const csvString = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'stock_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goToAnalysis = () => {
    navigate('/macdgraphpath', { state: { formData } });
  };

  const styles = {
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#121212',
      padding: '30px',
      borderRadius: '10px',
      color: '#fff',
      width: '80%',
      maxWidth: '500px',
      margin: 'auto',
    },
    parameterItem: {
      marginBottom: '20px',
      width: '100%',
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      color: '#f5f5f5',
      fontSize: '1.1rem',
    },
    input: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#333',
      border: '1px solid #555',
      borderRadius: '4px',
      color: '#fff',
    },
    submitButtonWrapper: {
      textAlign: 'center',
    },
    submitButton: {
      backgroundColor: '#f06c00',
      color: '#fff',
      border: 'none',
      padding: '12 20px',
      fontSize: '1.1rem',
      cursor: 'pointer',
      borderRadius: '5px',
      marginTop: '20px',
      width: '100%',
    },
    downloadButton: {
      backgroundColor: '#1e88e5',
      color: '#fff',
      padding: '10px 15px',
      border: 'none',
      fontSize: '1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '20px',
      width: '100%',
    },
    analyseButton: {
      backgroundColor: '#4caf50',
      color: '#fff',
      padding: '10px 15px',
      border: 'none',
      fontSize: '1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '20px',
      width: '100%',
    },
    apiResponse: {
      marginTop: '40px',
      textAlign: 'center',
      color: '#f5f5f5',
    },
    tableContainer: {
      marginTop: '20px',
      backgroundColor: '#1E1E1E',
      borderRadius: '10px',
      padding: '20px',
      color: '#f5f5f5',
      maxWidth: '800px',
      margin: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      borderRadius: '5px',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    tableHeader: {
      padding: '15px',
      backgroundColor: '#333',
      color: '#f5f5f5',
      fontWeight: 'bold',
    },
    tableCell: {
      padding: '12px',
      color: '#f5f5f5',
      textAlign: 'center',
      borderBottom: '1px solid #555',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      backgroundColor: '#333',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '400px',
      width: '100%',
      color: '#fff',
      textAlign: 'center',
    },
    closeButton: {
      marginTop: '20px',
      padding: '10px 20px',
      backgroundColor: '#f06c00',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '5px',
    },
  };

  return (
    <>
      <div style={styles.formContainer}>
      <div style={styles.formContainer}>
        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="stocksTicker">Stocks Ticker</label>
          <input type="text" name="stocksTicker" value={formData.stocksTicker} onChange={handleInputChange} placeholder="Enter stocksTicker (e.g. AAPL)" style={styles.input} />
        </div>
        <div style={styles.parameterItem}>
        <label style={styles.label} htmlFor="timestamp">Timestamp</label>
        <input
          type="date"
          name="timestamp"
          value={formData.timestamp}
          onChange={handleInputChange}
          placeholder="YYYY-MM-DD"
          style={styles.input}
          aria-label="Timestamp"
        />
      </div>

        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="timespan">Timespan</label>
          <select name="timespan" value={formData.timespan} onChange={handleInputChange} style={styles.input}>
            <option value="">Select timespan</option>
            <option value="second">Second</option>
            <option value="minute">Minute</option>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
            <option value="year">Year</option>
          </select>
        </div>


        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="adjusted">Adjusted</label>
          <select name="adjusted" value={formData.adjusted} onChange={handleInputChange} style={styles.input}>
          <option value="">Select adjusted</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div className="parameterItem">
          <label className="label">Short window</label>
          <input
            type="number"
            name="short_window"
            value={formData.short_window}
            onChange={handleInputChange}
            placeholder="Enter short window size (integer)"
            className="input"
            min="1"
          />
        </div>
        <div className="parameterItem">
          <label className="label">Long window</label>
          <input
            type="number"
            name="long_window"
            value={formData.long_window}
            onChange={handleInputChange}
            placeholder="Enter long window size (integer)"
            className="input"
            min="1"
          />
        </div>
        <div className="parameterItem">
          <label className="label">Signal Window</label>
          <input
            type="number"
            name="signal_window"
            value={formData.signal_window}
            onChange={handleInputChange}
            placeholder="Enter signal window size (integer)"
            className="input"
            min="1"
          />
        </div>
        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="sort">Series Type</label>
          <select name="series_type" value={formData.series_type} onChange={handleInputChange} style={styles.input}>
            <option value="open">Open</option>
            <option value="high">High</option>
            <option value="low">Low</option>
            <option value="close">Close</option>
          </select>
        </div>
        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="sort">Expand Underlying</label>
          <select name="expand_underlying" value={formData.expand_underlying} onChange={handleInputChange} style={styles.input}>
          <option value=""></option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>

        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="sort">Order</label>
          <select name="order" value={formData.order} onChange={handleInputChange} style={styles.input}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="limit">Limit</label>
          <input type="number" name="limit" value={formData.limit} onChange={handleInputChange} placeholder="Enter limit (integer)" style={styles.input} min="1" />
        </div>

        <div style={styles.submitButtonWrapper}>
          <button onClick={handleSubmit} style={styles.submitButton}>Submit</button>
        </div>
      </div>

      </div>

      {state.loading ? (
        <p>Loading data...</p>
      ) : (
        state.processedData.length > 0 && (
          <div style={styles.apiResponse}>
            <h3>Processed Stock Data</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>closePrice</th>
                    <th style={styles.tableHeader}>Highest Price</th>
                    <th style={styles.tableHeader}>Aggregate window</th>
                    <th style={styles.tableHeader}>Open Price</th>
                    <th style={styles.tableHeader}>Timestamp</th>
                    <th style={styles.tableHeader}>Volume</th>
                    <th style={styles.tableHeader}>VolumeWeight</th>
              
                  </tr>
                </thead>
                <tbody>
                  {state.processedData.slice(0, 10).map((row, index) => (
                    <tr key={index}>
                      <td style={styles.tableCell}>{row.closePrice}</td>
                      <td style={styles.tableCell}>{row.highestPrice}</td>
                      <td style={styles.tableCell}>{row.aggregatewindow}</td>
                      <td style={styles.tableCell}>{row.openPrice}</td>
                      <td style={styles.tableCell}>{row.timestamp}</td>
                      <td style={styles.tableCell}>{row.volume}</td>
                      <td style={styles.tableCell}>{row.VolumeWeight}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: '20px' }}>
                <button onClick={downloadCSV} style={styles.downloadButton}>Download CSV</button>
                <button onClick={goToAnalysis} style={styles.analyseButton}>Analysis</button>
              </div>
            </div>
          </div>
        )
      )}

      {state.showError && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <p>{state.errorMessage}</p>
            <button onClick={closeModal} style={styles.closeButton}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default MACD