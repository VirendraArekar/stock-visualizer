
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Config } from '../../../constants';
import "../../../TableStyles.css"

const StockSplitsV3 = (props) => {
  console.log(props, "propsofstocksplits")
  const { formData, handleInputChange, selectedAPI } = props;
  const [state, setState] = useState({
    processedData: [],
    loading: false,
    showError: false,
    errorMessage: "",
  });
  console.log(state, "statedata")
  const navigate = useNavigate();

  const closeModal = () => {
    setState(prev => ({ ...prev, showError: false, errorMessage: "" }));
  };

  const handleSubmit = async () => {
    const { ticker, limit } = formData;
    const apiKey = Config.Apikey;
    const apiUrl = `${Config[selectedAPI].url}?ticker=${ticker}&limit=${limit}&apiKey=${apiKey}`;
    console.log(apiUrl, "stocksplitv3")
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      console.log(data, "stocksplitsdata")
      if (data?.results && data.results.length > 0) {
        processStockData(data.results);
      } else {
        setState(prev => ({ ...prev, processedData: [], showError: true, errorMessage: "No data available" }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, processedData: [], showError: true, errorMessage: error.message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };
  const processStockData = (results) => {
    if (!results || results.length === 0) {
      console.error("No results found");
      return;
    }

    const rows = results.map(result => ({
      execution_date: result.execution_date,
      id: result.id,
      split_from: result.split_from,
      split_to: result.split_to,
      ticker: result.ticker,
    }));

    setState(prev => ({ ...prev, processedData: rows }));
  };


  const downloadCSV = () => {
    const csvRows = [
      [
        'execution_date',
        'id',
        'split_from',
        'split_to',
        'ticker'
      ],
      ...state.processedData.map(row => [
        row.execution_date,
        row.id,
        row.split_from,
        row.split_to,
        row.ticker,
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


  // Modern dark-themed UI
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
    },
    tableHeader: {
      color: '#f5f5f5',
      padding: '10px',
      borderBottom: '1px solid #666',
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
  const Tablestyles = {
    container: {
      display: 'flex',
      backgroundColor: '#0B0D17',
      color: '#fff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
    },
    sidebar: {
      width: '250px',
      backgroundColor: '#161B22',
      padding: '20px',
    },
    sidebarHeader: {
      fontSize: '18px',
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    sidebarItem: {
      fontSize: '16px',
      color: '#ddd',
      marginBottom: '10px',
      cursor: 'pointer',
    },
    content: {
      flex: 1,
      padding: '40px',
      color: '#F5F5F5',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#FFA500',  // Orange for highlight
      marginBottom: '20px',
    },
    submitButton: {
      backgroundColor: '#f06c00',
      color: '#fff',
      border: 'none',
      padding: '12px 20px',
      fontSize: '1.1rem',
      cursor: 'pointer',
      borderRadius: '5px',
      marginTop: '20px',
      width: '100%',
    },
    tableContainer: {
      marginTop: '40px',
      backgroundColor: '#1E1E1E',
      borderRadius: '10px',
      padding: '20px',
      color: '#f5f5f5',
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
    footerText: {
      fontSize: '16px',
      color: '#f5f5f5',
      textAlign: 'center',
      marginTop: '20px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end', // Aligns buttons to the end (right side)
      gap: '10px', // Adds space between the buttons
      marginTop: '20px',
    },
    downloadButton: {
      backgroundColor: '#f06c00',
      color: '#fff',
      padding: '10px 20px',
      fontSize: '1rem',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    analyseButton: {
      backgroundColor: '#f06c00',
      color: '#fff',
      padding: '10px 20px',
      fontSize: '1rem',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };
  return (
    <>
      <div style={styles.formContainer}>
        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="stocksTicker">Stocks Ticker</label>
          <input
            type="text"
            name="ticker"
            value={formData.ticker}
            onChange={handleInputChange}
            placeholder="Enter stocksTicker (e.g. AAPL)"
            style={styles.input}
            aria-label="Stocks Ticker"
          />
        </div>

        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="limit">Limit</label>
          <input
            type="number"
            name="limit"
            value={formData.limit}
            onChange={handleInputChange}
            placeholder="Enter limit (integer)"
            style={styles.input}
            min="1"
            aria-label="Limit"
          />
        </div>

        <div style={styles.submitButtonWrapper}>
          <button onClick={handleSubmit} style={styles.submitButton}>
            Submit
          </button>
        </div>
      </div>
      {state.loading ? (
        <p>Loading data...</p>
      ) : (
        state.processedData.length > 0 && (
          <div className="api-response">
          <div className="table-container">
            <h3>Processed Stock Data (First 5 rows):</h3>
            <table className='table'>
                <thead>
                <tr className='table-row'>
                    <th className="table-header">Execution Date</th>
                    <th className="table-header">Id</th>
                    <th className="table-header">Split From</th>
                    <th className="table-header">Split To</th>
                    <th className="table-header">Ticker</th>
                  </tr>
                </thead>
                <tbody>
                  {state.processedData.slice(0, 5).map((row, index) => (
                    <tr  className='table-row' key={index}>
                      <td className='table-cell'>{row.execution_date}</td>
                      <td className='table-cell'>{row.id}</td>
                      <td className='table-cell'>{row.split_from}</td>
                      <td className='table-cell'>{row.split_to}</td>
                      <td className='table-cell'>{row.ticker}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className='footer-text'>Your CSV file is ready, download it from here</div>
              <div className='button-container'>
                <button onClick={downloadCSV} className='download-button'>Download CSV</button>
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

export default StockSplitsV3;
