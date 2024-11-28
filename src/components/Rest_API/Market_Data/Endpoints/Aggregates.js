import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Config } from '../../../constants';
import '../../../../App.css';
import '../../../TableStyles.css';

const Aggregates = (props) => {
  const { formData, handleInputChange, selectedAPI } = props;
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const closeModal = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    // Array to collect missing required fields
    const missingFields = [];
  
    // Check each required field and add its name to the missingFields array if empty
    if (!formData.stocksTicker) missingFields.push("stocksTicker");
    if (!formData.multiplier) missingFields.push("multiplier");
    if (!formData.timespan) missingFields.push("timespan");
    if (!formData.from) missingFields.push("from date");
    if (!formData.to) missingFields.push("to date");
  
    // If there are missing fields, show an error message
    if (missingFields.length > 0) {
      setShowError(true);
      setErrorMessage(`Please fill in the required fields: ${missingFields.join(", ")}.`);
      return;
    }
  
    // Validation to ensure 'from' date is earlier than 'to' date
    const currentDate = new Date();
    const fromDate = new Date(formData.from);
    const toDate = new Date(formData.to);
    console.log(currentDate,"currentDate")
    console.log(toDate,"toDate")
    console.log(toDate > currentDate,"comp")
    if (fromDate > toDate ) {
      setShowError(true);
      setErrorMessage("The 'From' date must be earlier than or equal to the 'To' date.");
      return;
    } else if ((fromDate > currentDate) && (fromDate.getTime() !== currentDate.getTime())) {
      setShowError(true);
      setErrorMessage("The 'From' date must be less than or one day before  the current date.");
      return;
    } else if ((toDate > currentDate) && (toDate.getTime() !== currentDate.getTime())) {
      setShowError(true);
      setErrorMessage("The 'To' date must be less than or one day before the current date.");
      return;
    }
    // Dynamic params filtering to remove empty or null values
    const params = Object.entries({
      adjusted: formData.adjusted,
      sort: formData.sort,
      limit: formData.limit,
      apiKey: Config.Apikey
    }).reduce((acc, [key, value]) => {
      if (value != null && value !== "") acc[key] = value;
      return acc;
    }, {});
  
    try {
      setLoading(true);
      const response = await axios.get(`${Config[selectedAPI].url}${formData.stocksTicker}/range/${formData.multiplier}/${formData.timespan}/${formData.from}/${formData.to}`, { params });
      console.log(response, "responseaggregators");
      const data = response.data;
  
      if (data.results) {
        processStockData(data.results);
      } else {
        setProcessedData([]);
        setShowError(true);
        setErrorMessage("No data available");
      }
    } catch (error) {
      setProcessedData([]);
      setShowError(true);
      setErrorMessage(`${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  const processStockData = (results) => {
    const rows = results.map(result => ({
      Volume: result.v,
      'Volume Weighted': result.vw,
      Open: result.o,
      Close: result.c,
      High: result.h,
      Low: result.l,
      Timestamp: result.t,
      'Number of Transactions': result.n,
    }));
    setProcessedData(rows);
  };

  const downloadCSV = () => {
    const csvRows = [
      ['Volume', 'Volume Weighted', 'Open', 'Close', 'High', 'Low', 'Timestamp', 'Number of Transactions'],
      ...processedData.map(row => Object.values(row)),
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
    navigate('/aggregates-graph', { state: { formData } });
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
          <label className="label">multiplier*</label>
          <input
            type="number"
            name="multiplier"
            value={formData.multiplier}
            onChange={handleInputChange}
            placeholder="Enter multiplier (integer)"
            className="input"
            min="1"
          />
        </div>

        <div className="parameterItem">
          <label className="label">timespan*</label>
          <select
            name="timespan"
            value={formData.timespan}
            onChange={handleInputChange}
            className="input"
          >
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

        <div className="parameterItem">
          <label className="label">from*</label>
          <input
            type="date"
            name="from"
            value={formData.from}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="parameterItem">
          <label className="label">to*</label>
          <input
            type="date"
            name="to"
            value={formData.to}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="parameterItem">
          <label className="label">adjusted</label>
          <select
            name="adjusted"
            value={formData.adjusted}
            onChange={handleInputChange}
            className="input"
          >
            <option value=""></option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
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

      {loading ? (
        <p>Loading data...</p>
      ) : (
        processedData.length > 0 && (
          <div style={styles.apiResponse}>
            <h3>Processed Stock Data (First 5 rows):</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Volume</th>
                    <th style={styles.tableHeader}>Volume Weighted</th>
                    <th style={styles.tableHeader}>Open</th>
                    <th style={styles.tableHeader}>Close</th>
                    <th style={styles.tableHeader}>High</th>
                    <th style={styles.tableHeader}>Low</th>
                    <th style={styles.tableHeader}>Timestamp</th>
                    <th style={styles.tableHeader}>Number of Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {processedData.slice(0, 5).map((row, index) => (
                    <tr key={index}>
                      <td style={styles.tableCell}>{row.Volume}</td>
                      <td style={styles.tableCell}>{row['Volume Weighted']}</td>
                      <td style={styles.tableCell}>{row.Open}</td>
                      <td style={styles.tableCell}>{row.Close}</td>
                      <td style={styles.tableCell}>{row.High}</td>
                      <td style={styles.tableCell}>{row.Low}</td>
                      <td style={styles.tableCell}>{row.Timestamp}</td>
                      <td style={styles.tableCell}>{row['Number of Transactions']}</td>
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

      {showError && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <p>{errorMessage}</p>
            <button onClick={closeModal} className='close-button'>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Aggregates;
