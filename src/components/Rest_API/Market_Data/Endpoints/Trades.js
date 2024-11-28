import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Config } from '../../../constants';
import '../../../TableStyles.css';

const Trades = (props) => {
  const { formData, handleInputChange, selectedAPI } = props;
  const [state, setState] = useState({
    processedData: [],
    loading: false,
    showError: false,
    errorMessage: "",
  });

  const navigate = useNavigate();
  
  const closeModal = () => {
    setState(prev => ({ ...prev, showError: false, errorMessage: "" }));
  };

  const handleSubmit = async () => {
    setState(prev => ({
      ...prev,
      loading: true,
      processedData: [],
      showError: false,
      errorMessage: ""
    }));
    // Collect missing required fields
    const missingFields = [];
    if (!formData.stocksTicker) missingFields.push("stocksTicker");
  
    if (missingFields.length > 0) {
      setState(prev => ({ ...prev, showError: true, errorMessage: `Please fill in the required fields: ${missingFields.join(", ")}.` }));
      return;
    }
  
    const currentDate = new Date();
    const TimeStamp = new Date(formData.timestamp);
    
    if (TimeStamp > currentDate) {
      setState(prev => ({ ...prev, showError: true, errorMessage: `Timestamp cannot be greater than the current date.` }));
      return;
    }
  
    const params = Object.entries({
      timestamp: formData.timestamp,
      order: formData.order,
      limit: formData.limit,
      sort: formData.sort,
      apiKey: Config.Apikey,
    }).reduce((acc, [key, value]) => {
      if (value != null && value !== "") acc[key] = value;
      return acc;
    }, {});
  
    const apiUrl = `${Config[selectedAPI].url}${formData.stocksTicker}`;
    console.log("Request URL:", apiUrl);
    console.log("Request Params:", params);
  
    try {
      setState(prev => ({ ...prev, loading: true, showError: false, errorMessage: "" }));
      
      const response = await axios.get(apiUrl, {
        params,
        timeout: 5000,  // Set a timeout of 5 seconds
      });
      console.log("API Response:Trades", response);
  
      const data = response.data;
  
      if (data?.results && data.results.length > 0) {
        processStockData(data.results);
      } else {
        console.warn("No data available");
        setState(prev => ({ ...prev, processedData: [], showError: true, errorMessage: "No data available" }));
      }
    } catch (error) {
      console.error("Error fetching API data:", error);
  
      let errorMessage = "An error occurred. Please try again.";
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        errorMessage = `Error: ${error.response.status} - ${error.response.data.message || error.message}`;
      } else if (error.request) {
        // Request was made, but no response received
        errorMessage = "No response received from the server. Please check your network connection.";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network Error: Please check your connection or API configuration.";
      }
  
      setState(prev => ({ ...prev, processedData: [], showError: true, errorMessage }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
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

  const processStockData = (results) => {
    if (!results || results.length === 0) {
      setState(prev => ({ ...prev, processedData: [], showError: true, errorMessage:  "No result" }));
      return;
    }

    const rows = results.map(result => ({
      id: result.id,
      Conditions: result.conditions,
      participant_timestamp: result.participant_timestamp,
      price: result.price,
      sequence_number: result.sequence_number,
      sip_timestamp: result.sip_timestamp,
      size: result.size,
      tape: result.tape,
    }));

    setState(prev => ({ ...prev, processedData: rows }));
  };

  const downloadCSV = () => {
    const csvRows = [
      ['id', 'Conditions', 'participant_timestamp', 'price', 'sequence_number', 'sip_timestamp', 'size', 'tape'],
      ...state.processedData.map(row => [
        row.id,
        Array.isArray(row.Conditions) ? row.Conditions.join('|') : '',
        row.participant_timestamp,
        row.price,
        row.sequence_number,
        row.sip_timestamp,
        row.size,
        row.tape,
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
    navigate('/tradesgraph', { state: { formData } });
  };

  return (
    <>
      <div className="formContainer">
        <div className="parameterItem">
          <label className="label">stocksTicker*</label>
          <input
            type="text"
            name="stocksTicker"
            value={formData.stocksTicker}
            onChange={handleInputChange}
            placeholder="Enter stocksTicker (e.g. AAPL)"
            className="input"
          />
        </div>

        <div className="parameterItem">
          <label className="label">timestamp</label>
          <input
            type="date"
            name="timestamp"
            value={formData.timestamp}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="parameterItem">
          <label className="label">sort</label>
          <select
            name="sort"
            value={formData.sort}
            onChange={handleInputChange}
            className="input"
          >
            <option value=""></option>
            <option value="timestamp">Timestamp</option>
          </select>
        </div>

        <div className="parameterItem">
          <label className="label">order</label>
          <select
            name="order"
            value={formData.order}
            onChange={handleInputChange}
            className="input"
          >
            <option value=""></option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="parameterItem">
          <label className="label">limit</label>
          <input
            type="number"
            name="limit"
            value={formData.limit}
            onChange={handleInputChange}
            placeholder="Enter limit (integer)"
            className="input"
            min="1"
          />
        </div>

        <div className="submitButtonWrapper">
          <button onClick={handleSubmit} className="submitButton">
            Submit
          </button>
        </div>
      </div>

      {state.loading ? (
        <p>Loading data...</p>
      ) : (
        state.processedData.length > 0 && (
          <div style={styles.apiResponse}>
            <h3>Processed Stock Data (First 5 rows)</h3>
            <div style={styles.tableContainer}>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Conditions</th>
                      <th style={styles.tableHeader}>Participant Timestamp</th>
                      <th style={styles.tableHeader}>Price</th>
                      <th style={styles.tableHeader}>Sequence Number</th>
                      <th style={styles.tableHeader}>SIP Timestamp</th>
                      <th style={styles.tableHeader}>ID</th>
                      <th style={styles.tableHeader}>Size</th>
                      <th style={styles.tableHeader}>Tape</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.processedData.slice(0, 5).map((row, index) => (
                      <tr key={index}>
                        <td style={styles.tableCell}>{row.Conditions?.join(', ')}</td>
                        <td style={styles.tableCell}>{row.participant_timestamp}</td>
                        <td style={styles.tableCell}>{row.price}</td>
                        <td style={styles.tableCell}>{row.sequence_number}</td>
                        <td style={styles.tableCell}>{row.sip_timestamp}</td>
                        <td style={styles.tableCell}>{row.id}</td>
                        <td style={styles.tableCell}>{row.size}</td>
                        <td style={styles.tableCell}>{row.tape}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '20px' }}>
                <button onClick={downloadCSV} style={styles.downloadButton}>Download CSV</button>
                <button onClick={goToAnalysis} style={styles.analyseButton}>Analysis</button>
              </div>
            </div>
          </div>
        )
      )}

      {state.showError && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <p>{state.errorMessage}</p>
            <button onClick={closeModal} className='close-button'>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Trades;
