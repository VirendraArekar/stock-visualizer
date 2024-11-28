import React, { useState } from 'react';
import { Config } from '../../../constants';
import * as XLSX from 'xlsx';

const TickerNews = (props) => {
  console.log(props, "propsTickerNews");
  const { formData, handleInputChange, selectedAPI } = props;
  const [state, setState] = useState({
    processedData: [],
    loading: false,
    showError: false,
    errorMessage: "",
  });
  const [saveResponseData, setSaveResponseData] = useState(null);

  console.log(state, "tickernewsstate");

  const closeModal = () => {
    setState((prev) => ({ ...prev, showError: false, errorMessage: "" }));
  };

  const handleSubmit = async () => {
    const { ticker, sort, order, limit } = formData;
    const apiKey = Config.Apikey;
    const apiUrl = `${Config[selectedAPI].url}?${ticker}&order=${order}&limit=${limit}&sort=${sort}&apiKey=${apiKey}`;

    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      console.log(data, "datainTickerNews");
      if (data?.results && data.results.length > 0) {
        setSaveResponseData(data.results);
      } else {
        setState((prev) => ({ ...prev, processedData: [], showError: true, errorMessage: "No data available" }));
      }
    } catch (error) {
      setState((prev) => ({ ...prev, processedData: [], showError: true, errorMessage: error.message }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const downloadExcel = () => {
    const rows = saveResponseData.map(result => ({
      ID: result.id,
      Publisher: result.publisher?.name || '',  // Use optional chaining and default empty string
      Title: result.title || '',
      Author: result.author || '',
      PublishedDate: result.published_utc || '',
      URL: result.article_url || '',
      Tickers: result.tickers ? result.tickers.join(', ') : '',  // Check for existence before joining
      Description: result.description || '',
      Keywords: result.keywords ? result.keywords.join(', ') : ''  // Check for existence before joining
    }));
  
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ticker News");
    XLSX.writeFile(wb, "ticker_news.xlsx");
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
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      borderRadius: '5px',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    footerText: {
      fontSize: '16px',
      color: '#f5f5f5',
      textAlign: 'center',
      marginTop: '20px',
    },
    messageText: {
      fontSize: '18px',
      color: '#f5f5f5',
      textAlign: 'center',
      marginBottom: '10px',
      fontWeight: 'bold',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
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
  };

  return (
    <>
      <div style={styles.formContainer}>
        {/* Form fields */}
        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="stocksTicker">Stocks Ticker</label>
          <input
            type="text"
            name="stocksTicker"
            value={formData.stocksTicker}
            onChange={handleInputChange}
            placeholder="Enter stocksTicker (e.g. AAPL)"
            style={styles.input}
            aria-label="Stocks Ticker"
          />
        </div>

        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="sort">Sort</label>
          <select
            name="sort"
            value={formData.sort}
            onChange={handleInputChange}
            style={styles.input}
            aria-label="Sort"
          >
            <option>Select sort</option>
            <option value="published_utc">Published Utc</option>
          </select>
        </div>

        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="order">Order</label>
          <select
            name="order"
            value={formData.order}
            onChange={handleInputChange}
            style={styles.input}
            aria-label="Order"
          >
            <option value="">Select order</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
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

      {/* Show loading text or download button based on state */}
      {state.loading ? (
        <p>Loading data...</p>
      ) : (
        saveResponseData && saveResponseData.length > 0 && (
          <div style={Tablestyles.buttonContainer}>
            <div style={Tablestyles.messageText}>YOUR File Is Ready For Download</div>
            <button onClick={downloadExcel} style={Tablestyles.downloadButton}>
              Download Excel
            </button>
          </div>
        )
      )}

      {/* Error modal */}
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

export default TickerNews;
