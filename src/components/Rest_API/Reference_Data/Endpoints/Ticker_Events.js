import React, { useState } from 'react';
import { Config } from '../../../constants';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

const TickerEvents = (props) => {
  console.log("TickerEvents",props)
  const { formData, handleInputChange, selectedAPI } = props;
  const [state, setState] = useState({
    processedData: [],
    loading: false,
    showError: false,
    errorMessage: "",
    showSuccess: false, // State for success message
  });

  const closeModal = () => {
    setState((prev) => ({ ...prev, showError: false, errorMessage: "" }));
  };

  const closeSuccessModal = () => {
    setState((prev) => ({ ...prev, showSuccess: false })); // Close success popup
  };

  const handleSubmit = async () => {
    const missingFields = [];
    if (!formData.stocksTicker) missingFields.push("Id");
    if (missingFields.length > 0) {
      setState(prev => ({ ...prev, showError: true, errorMessage: `Please fill in the required fields: ${missingFields.join(", ")}.`}));
      return;
    }
    const { stocksTicker, timestamp } = formData;
    const apiKey = Config.Apikey;
    const apiUrl = `${Config[selectedAPI].url}${stocksTicker}/events?types=ticker_change&apiKey=${apiKey}`;
    
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      console.log(data, "tickereventsresult");
      createWordDoc(data);
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, showError: true, errorMessage: error.message }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const createWordDoc = (data) => {
    const details = data.results;
  
    if (!details) {
      console.error("No results found in data.");
      return;
    }
  
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Ticker Details",
                  bold: true,
                  size: 32,
                  color: "#5DADE2",
                }),
              ],
              spacing: { after: 400 },
            }),
  
            // Display name, composite_figi, and cik
            new Paragraph({
              children: [
                new TextRun({ text: "Name: ", bold: true, color: "#5DADE2" }),
                new TextRun(details.name || "N/A"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Composite FIGI: ", bold: true, color: "#5DADE2" }),
                new TextRun(details.composite_figi || "N/A"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "CIK: ", bold: true, color: "#5DADE2" }),
                new TextRun(details.cik || "N/A"),
              ],
            }),
  
            // Display ticker change events
            new Paragraph({
              children: [
                new TextRun({ text: "Ticker Events:", bold: true, color: "#5DADE2" }),
              ],
            }),
            ...details.events.map((event, index) => new Paragraph({
              children: [
                new TextRun({ text: `Event ${index + 1}:`, bold: true, color: "#5DADE2" }),
                new TextRun(` Ticker: ${event.ticker_change.ticker || "N/A"}, Date: ${event.date || "N/A"}`),
              ],
              spacing: { after: 200 },
            })),
          ],
        },
      ],
    });
  
    // Generate and download the Word document
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Ticker_Events_${details.name || "Ticker"}.docx`);
      setState((prev) => ({ ...prev, showSuccess: true }));
    });
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
  };

  return (
    <>
      <div style={styles.formContainer}>
        <div style={styles.parameterItem}>
          <label style={styles.label} htmlFor="stocksTicker">id*</label>
          <input
            type="text"
            name="stocksTicker"
            value={formData.stocksTicker}
            onChange={handleInputChange}
            placeholder="Enter ID (e.g. META)"
            style={styles.input}
            aria-label="Stocks Ticker"
          />
        </div>

        {/* <div style={styles.parameterItem}>
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
        </div> */}

        <div style={styles.submitButtonWrapper}>
          <button onClick={handleSubmit} style={styles.submitButton}>
            Submit
          </button>
        </div>
      </div>

      {state.loading && <p>Loading data...</p>}

      {state.showError && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', maxWidth: '400px', width: '100%', color: '#fff', textAlign: 'center' }}>
            <p>{state.errorMessage}</p>
            <button onClick={closeModal} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#f06c00', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {state.showSuccess && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', maxWidth: '400px', width: '100%', color: '#fff', textAlign: 'center' }}>
            <p>Data downloaded successfully</p>
            <button onClick={closeSuccessModal} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#f06c00', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TickerEvents;
