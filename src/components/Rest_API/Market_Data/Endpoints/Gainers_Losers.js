import React, { useState } from 'react';
import { Config } from '../../../constants';

const GainersLosers = (props) => {
  const { formData, handleInputChange, selectedAPI } = props;
  const [state, setState] = useState({
    processedData: [],
    loading: false,
    showError: false,
    errorMessage: "",
  });


  const closeModal = () => {
    setState(prev => ({ ...prev, showError: false, errorMessage: "" }));
  };
  const handleSubmit = async () => {
    const { direction, include_otc } = formData;
    const apiKey = Config.Apikey;
    const apiUrl = `${Config[selectedAPI].url}${direction}?include_otc=${include_otc}&apiKey=${apiKey}`;
    console.log(apiUrl, "apiurl");
    

    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch(apiUrl);
      console.log(response, "responseofSnapshots");
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      console.log(data, "snapshotData");
      if (data?.tickers && data.tickers.length>0) {
        processSnapshotData(data.tickers);
      } else {
        console.error("No data available");
        setState(prev => ({ ...prev, processedData: [], showError: true, errorMessage: "No data available" }));
      }
    } catch (error) {
      console.error('Error fetching API data:', error);
      setState(prev => ({ ...prev, processedData: [], showError: true, errorMessage:  error.message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const processSnapshotData = (tickers) => {
    if (!tickers || tickers.length === 0) {
      console.error("No tickers found");
      return;
    }

    const rows = tickers.map(ticker => ({
      ticker: ticker.ticker,
      todaysChangePerc: ticker.todaysChangePerc,
      todaysChange: ticker.todaysChange,
      updated: ticker.updated,
      openPrice: ticker.day.o,
      highPrice: ticker.day.h,
      lowPrice: ticker.day.l,
      closePrice: ticker.day.c,
      volume: ticker.day.v,
      vwap: ticker.day.vw,
    }));

    setState(prev => ({ ...prev, processedData: rows }));
  };

 

  const downloadCSV = () => {
    const csvRows = [
      ['Ticker', 'Today\'s Change %', 'Today\'s Change', 'Updated', 'Open Price', 'High Price', 'Low Price', 'Close Price', 'Volume', 'VWAP'],
      ...state.processedData.map(row => [
        row.ticker,
        row.todaysChangePerc,
        row.todaysChange,
        row.updated,
        row.openPrice,
        row.highPrice,
        row.lowPrice,
        row.closePrice,
        row.volume,
        row.vwap,
      ])
    ];

    const csvString = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'snapshot_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      padding: '12px 20px',
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
    tableRow: {
      backgroundColor: '#2A2A2A',
    },
    tableCell: {
      padding: '12px',
      color: '#f5f5f5',
      textAlign: 'center',
      borderBottom: '1px solid #555',
    },
    tableRowHover: {
      backgroundColor: '#444',
    },
    footerText: {
      fontSize: '16px',
      color: '#f5f5f5',
      textAlign: 'center',
      marginTop: '20px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '20px',
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
        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="direction">Direction*</label>
          <select
            name="direction"
            value={formData.direction}
            onChange={handleInputChange}
            style={styles.input}
            aria-label="Direction"
          >
            <option value="gainers">Gainers</option>
            <option value="losers">Loosers</option>
          </select>
        </div>

        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="include_otc">Include OTC</label>
          <select
            name="include_otc"
            value={formData.include_otc}
            onChange={handleInputChange}
            style={styles.input}
            aria-label="Include OTC"
          >
            <option value=""></option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
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
          <div style={styles.apiResponse}>
            <div style={styles.tableContainer}>
              <h3>Processed Snapshot Data (First 5 rows)</h3>
              
              {/* Add a wrapper div with horizontal scroll */}
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Ticker</th>
                      <th style={styles.tableHeader}>Today's Change %</th>
                      <th style={styles.tableHeader}>Today's Change</th>
                      <th style={styles.tableHeader}>Updated</th>
                      <th style={styles.tableHeader}>Open Price</th>
                      <th style={styles.tableHeader}>High Price</th>
                      <th style={styles.tableHeader}>Low Price</th>
                      <th style={styles.tableHeader}>Close Price</th>
                      <th style={styles.tableHeader}>Volume</th>
                      <th style={styles.tableHeader}>VWAP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.processedData.slice(0, 5).map((row, index) => (
                      <tr key={index} style={styles.tableRow}>
                        <td style={styles.tableCell}>{row.ticker}</td>
                        <td style={styles.tableCell}>{row.todaysChangePerc}</td>
                        <td style={styles.tableCell}>{row.todaysChange}</td>
                        <td style={styles.tableCell}>{row.updated}</td>
                        <td style={styles.tableCell}>{row.openPrice}</td>
                        <td style={styles.tableCell}>{row.highPrice}</td>
                        <td style={styles.tableCell}>{row.lowPrice}</td>
                        <td style={styles.tableCell}>{row.closePrice}</td>
                        <td style={styles.tableCell}>{row.volume}</td>
                        <td style={styles.tableCell}>{row.vwap}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={styles.footerText}>Your CSV file is ready, download it from here</div>
              <div style={styles.buttonContainer}>
                <button onClick={downloadCSV} style={styles.downloadButton}>Download CSV</button>
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

export default GainersLosers;
