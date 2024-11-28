// API_Explorer.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const API_Explorer = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // Navigate to the API Selector page
    navigate('/api-selector');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Stocks API documentation</h1>
      <p style={styles.description}>This will allow you to download your CSV file after entering your API key and selecting the necessary parameters.</p>
      <button onClick={handleButtonClick} style={styles.button}>Select API</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#1a1a1a', // Dark background color
    color: '#fff', // White text color
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  heading: {
    fontSize: '3rem', // Large font size for the heading
    fontWeight: 'bold',
    color: '#f06c00', // Orange highlight color for the heading
    marginBottom: '20px',
  },
  description: {
    fontSize: '1.2rem', // Slightly smaller font for the description
    color: '#b0b0b0', // Light gray text for the description
    marginBottom: '40px',
  },
  button: {
    backgroundColor: '#f06c00', // Orange background color for the button
    color: '#fff', // White text color
    border: 'none',
    padding: '15px 30px',
    fontSize: '1.2rem', // Large font size for the button
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#d95a00', // Darker shade of orange for hover state
  }
};

export default API_Explorer;
