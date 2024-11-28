import React, { useState } from 'react';
import { Config } from '../../../constants';
import * as XLSX from 'xlsx';
import axios from 'axios';

const StockFinantialVx = (props) => {
  const { formData, handleInputChange, selectedAPI } = props;
  const [state, setState] = useState({
    processedData: [],
    loading: false,
    showError: false,
    errorMessage: "",
  });
  const [saveResponseData, setSaveResponseData] = useState(null);

  const closeModal = () => {
    setState((prev) => ({ ...prev, showError: false, errorMessage: "" }));
  };

  const handleSubmit = async () => {
    setState(prev => ({
      ...prev,
      loading: true,
      processedData: [],
      showError: false,
      errorMessage: ""
    }));
    setSaveResponseData(null);
    const params = Object.entries({
      ticker: formData.ticker,
      cik: formData.cik,
      company_name: formData.company_name,
      sic: formData.sic,
      filing_date: formData.filing_date,
      period_of_report_date: formData.period_of_report_date,
      timeframe: formData.timeframe,
      include_sources: formData.include_sources,
      order: formData.order,
      limit: formData.limit,
      sort: formData.sort,
      apiKey: Config.Apikey, // Assume apiKey is mandatory
    }).reduce((acc, [key, value]) => {
      if (value != null && value !== "") acc[key] = value;
      return acc;
    }, {});

    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await axios.get(Config[selectedAPI].url, { params });
      console.log(response,"apiresponseSFVX")
      const data = response.data;
      if (data?.results && data.results.length > 0) {
        setSaveResponseData(data.results);
      } else {
        setState((prev) => ({
          ...prev,
          processedData: [],
          showError: true,
          errorMessage: "No data available",
        }));
        return;
      }
    } catch (error) {
      console.log(error,"errorinstockFinancial")
      setState((prev) => ({
        ...prev,
        processedData: [],
        showError: true,
        errorMessage: error.message,
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };
  const downloadExcel = () => {
    if (!saveResponseData || saveResponseData.length === 0) {
      alert("No data available to download.");
      return;
    }
  
    const wb = XLSX.utils.book_new();
  
    saveResponseData.forEach((item, index) => {
      const financials = item.financials;
  
      Object.keys(financials).forEach(sheetName => {
        const sheetData = financials[sheetName];
        const rows = [];
  
        Object.keys(sheetData).forEach(rowName => {
          const row = { Index: rowName, ...sheetData[rowName] };
          rows.push(row);
        });
  
        // Use a unique sheet name for each entry to avoid duplication
        const uniqueSheetName = `${sheetName}_Entry${index + 1}`;
        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, uniqueSheetName);
      });
    });
  
    XLSX.writeFile(wb, "financials_data.xlsx");
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
  }

  return (
    <>
      <div style={styles.formContainer}>
        {/* Form fields */}
        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="stocksTicker">Stocks Ticker</label>
          <input
            type="text"
            name="ticker"
            value={formData.ticker}
            onChange={handleInputChange}
            placeholder="Enter Ticker (e.g. AAPL)"
            style={styles.input}
            aria-label="Stocks Ticker"
          />
        </div>
        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="stocksTicker">cik</label>
          <input
            type="text"
            name="cik"
            value={formData.cik}
            onChange={handleInputChange}
            placeholder="Enter central index key "
            style={styles.input}
            aria-label="cik"
          />
        </div>
         <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="stocksTicker">company name</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            placeholder="Enter company name "
            style={styles.input}
            aria-label="company_name"
          />
        </div>
        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="stocksTicker">sic</label>
          <input
            type="text"
            name="sic"
            value={formData.sic}
            onChange={handleInputChange}
            placeholder="Enter standard industrial classification "
            style={styles.input}
            aria-label="sic"
          />
        </div>
        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="timestamp">filing date</label>
          <input
            type="date"
            name="filing_date"
            value={formData.filing_date}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD"
            style={styles.input}
            aria-label="filing_date"
          />
        </div>
        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="timestamp">period_of_report_date</label>
          <input
            type="date"
            name="period_of_report_date"
            value={formData.period_of_report_date}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD"
            style={styles.input}
            aria-label="period_of_report_date"
          />
        </div>
        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="order">Time Frame</label>
          <select
            name="timeframe"
            value={formData.timeframe}
            onChange={handleInputChange}
            style={styles.input}
            aria-label="timeframe"
          >
            <option value=""></option>
            <option value="annual">annual</option>
            <option value="quarterly">quarterly</option>
            <option value="ttm">ttm</option>
          </select>
        </div>

        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="order">include_sources</label>
          <select
            name="include_sources"
            value={formData.include_sources}
            onChange={handleInputChange}
            style={styles.input}
            aria-label="Order"
          >
            <option value=""></option>
            <option value="true">True</option>
            <option value="false">False</option>
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
            <option value=""></option>
            <option value="filing_date">filing date</option>
            <option value="period_of_report_date">period_of_report_date</option>
          </select>
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
            <>
              <div className='footer-text'>Your CSV file is ready, download it from here</div>
              <div className='button-container-stock'>
                <button onClick={downloadExcel} className='download-button-stock'>Download CSV</button>
              </div>
            </>
        )
      )}

      {/* Error modal */}
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

export default StockFinantialVx;
