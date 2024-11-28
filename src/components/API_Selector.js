import React, { useState } from 'react';
import Aggregates from './Rest_API/Market_Data/Endpoints/Aggregates';
import Trades from './Rest_API/Market_Data/Endpoints/Trades';
import Quotes from './Rest_API/Market_Data/Endpoints/Quotes';
import { Config } from './constants';
import  GainersLosers  from './Rest_API/Market_Data/Endpoints/Gainers_Losers';
import  SMA  from './Rest_API/Market_Data/Endpoints/TechnicalIndicators/SMA';
import EMA from './Rest_API/Market_Data/Endpoints/TechnicalIndicators/EMA';
import MACD from './Rest_API/Market_Data/Endpoints/TechnicalIndicators/MACD';
import  RSI  from './Rest_API/Market_Data/Endpoints/TechnicalIndicators/RSI';
import TickerDetails from './Rest_API/Reference_Data/Endpoints/Ticker_Details';
import TickerEvents from './Rest_API/Reference_Data/Endpoints/Ticker_Events';
import StockSplitsV3 from './Rest_API/Reference_Data/Endpoints/Stock_Splits';
import QuotesLiveGraph from './Rest_API/Market_Data_Channels/Endpoints/Quotes';
import LiveTradeGraph from './Rest_API/Market_Data_Channels/Endpoints/Trades';
import AggregatePerSecond from './Rest_API/Market_Data_Channels/Endpoints/Aggregates_Per_Second';
import AggregatePerMinute from './Rest_API/Market_Data_Channels/Endpoints/Aggregates_Per_Minute';
import Divedent from './Rest_API/Reference_Data/Endpoints/Dividends';
import TickerNews  from './Rest_API/Reference_Data/Endpoints/Ticker_News';
import StockFinantialVx from './Rest_API/Reference_Data/Endpoints/StockFinantialVx';

const API_Selector = () => {
  const [openSection, setOpenSection] = useState(null);
  const [selectedAPI, setSelectedAPI] = useState("");
  const [formData, setFormData] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null); // State for hover effect
 console.log(selectedAPI,"selectedAPIFORMACD")
  const handleToggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleAPIClick = (api) => {
    setSelectedAPI(api);
    const config = Config[api];
    setFormData(config ? config.Params : {});
  };

  const renderParameters = () => {
    if (selectedAPI === 'aggregates') {
      return (
        <Aggregates
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    } else if (selectedAPI === 'trades') {
      return (
        <Trades
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    } else if (selectedAPI === 'quotes') {
      return (
        <Quotes
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }
    else if (selectedAPI === 'gainers/Loosers') {
      return (
        <GainersLosers
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }
    else if (selectedAPI === 'SMA') {
      return (
        <SMA
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }
    else if (selectedAPI === 'EMA') {
      return (
        <EMA
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }
    else if (selectedAPI === 'MACD') {
      return (
        <MACD
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }
    else if (selectedAPI === 'RSI') {
      return (
        <RSI
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }
    else if (selectedAPI === 'Ticker Details V3') {
      return (
        <TickerDetails
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }
    else if (selectedAPI === 'Ticker Events') {
      return (
        <TickerEvents
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }
    else if (selectedAPI === 'Stock Splits V3') {
      return (
        <StockSplitsV3
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }
    else if (selectedAPI === 'Stock Financials vX') {
      return (
        <StockFinantialVx
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }
    else if (selectedAPI === 'QuotesLiveGraph') {
      return (
        <QuotesLiveGraph
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }
    else if (selectedAPI === 'LiveTradeGraph') {
      return (
        <LiveTradeGraph
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }
    else if (selectedAPI === 'Aggregates (Per Second)') {
      return (
        <AggregatePerSecond
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }
    else if (selectedAPI === 'Aggregates (Per Minute)') {
      return (
        <AggregatePerMinute
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }
    else if (selectedAPI === 'Dividends D3') {
      return (
        <Divedent
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }
    else if (selectedAPI === 'Ticker News') {
      return (
        <TickerNews
          formData={formData}
          handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={() => console.log('Submitted Data:', formData)}
          selectedAPI={selectedAPI}
        />
      );
    }

    return <p>Select an API to see its available parameters here.</p>;
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.title}>Rest API</h2>
        <p style={styles.subtitle}>Getting Started</p>

        {/* Market Data Endpoints Section */}
        <div style={styles.section}>
          <button
            style={styles.sectionButton}
            onClick={() => handleToggle('marketData')}
          >
            Market Data Endpoints
            <span style={styles.arrow}>{openSection === 'marketData' ? '▲' : '▼'}</span>
          </button>
          {openSection === 'marketData' && (
            <ul style={styles.submenu}>
              {['aggregates', 'trades', 'quotes'].map((api, index) => (
                <li
                  key={api}
                  onClick={() => handleAPIClick(api)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    ...styles.apiLink,
                    backgroundColor: hoveredIndex === index ? '#f06c00' : 'transparent',
                    color: hoveredIndex === index ? '#fff' : '#fff'
                  }}
                >
                  {api === 'aggregates' ? 'Aggregates (Bars)' : api === 'trades' ? 'Trades' : 'Quotes (NBBO)'}
                </li>
              ))}
              <li style={styles.subheader}>Snapshots:</li>
              <ul style={styles.submenuInner}>
                <li 
                  onClick={() => handleAPIClick("gainers/Loosers")}
                  onMouseEnter={() => setHoveredIndex(3)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    ...styles.apiLink,
                    backgroundColor: hoveredIndex === 3 ? '#f06c00' : 'transparent'
                  }}
                >
                  Gainers/Losers
                </li>
              </ul>
              <li style={styles.subheader}>Technical Indicators:</li>
              <ul style={styles.submenuInner}>
                {['SMA', 'EMA', 'MACD', 'RSI'].map((indicator, index) => (
                  <li
                    key={indicator}
                    onClick={() => handleAPIClick(indicator)}
                    onMouseEnter={() => setHoveredIndex(4 + index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      ...styles.apiLink,
                      backgroundColor: hoveredIndex === 4 + index ? '#f06c00' : 'transparent'
                    }}
                  >
                    {indicator === 'SMA' ? 'Simple Moving Average (SMA)' : 
                     indicator === 'EMA' ? 'Exponential Moving Average (EMA)' : 
                     indicator === 'MACD' ? 'Moving Average Convergence/Divergence (MACD)' : 
                     'Relative Strength Index (RSI)'}
                  </li>
                ))}
              </ul>
            </ul>
          )}
        </div>

        {/* Reference Data Endpoints Section */}
        <div style={styles.section}>
          <button
            style={styles.sectionButton}
            onClick={() => handleToggle('referenceData')}
          >
            Reference Data Endpoints
            <span style={styles.arrow}>{openSection === 'referenceData' ? '▲' : '▼'}</span>
          </button>
          {openSection === 'referenceData' && (
            <ul style={styles.submenu}>
              {[`Ticker Details V3`, 'Ticker Events', 'Ticker News', 'Stock Splits V3', 'Dividends D3',"Stock Financials vX"].map((endpoint, index) => (
                <li
                  key={endpoint}
                  onClick={() => handleAPIClick(endpoint)}
                  onMouseEnter={() => setHoveredIndex(8 + index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    ...styles.apiLink,
                    backgroundColor: hoveredIndex === 8 + index ? '#f06c00' : 'transparent'
                  }}
                >
                  {endpoint}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Market Data Channels Section */}
        <div style={styles.section}>
          <button
            style={styles.sectionButton}
            onClick={() => handleToggle('marketChannels')}
          >
            Market Data Channels
            <span style={styles.arrow}>{openSection === 'marketChannels' ? '▲' : '▼'}</span>
          </button>
          {openSection === 'marketChannels' && (
            <ul style={styles.submenu}>
              {['Aggregates (Per Minute)', 'Aggregates (Per Second)', 'LiveTradeGraph', 'QuotesLiveGraph'].map((channel, index) => (
                <li
                  key={channel}
                  onClick={() => handleAPIClick(channel)}
                  onMouseEnter={() => setHoveredIndex(13 + index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    ...styles.apiLink,
                    backgroundColor: hoveredIndex === 13 + index ? '#f06c00' : 'transparent'
                  }}
                >
                  {channel}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={styles.parameters}>
        <h2 style={styles.parametersTitle}>{selectedAPI}</h2>
        {renderParameters()}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '300px',
    padding: '20px',
    backgroundColor: '#282c34',
    borderRight: '1px solid #333',
    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    overflowY: 'auto',
    // Add these rules for transparent scrollbar
    scrollbarWidth: 'thin',  // For Firefox
    scrollbarColor: 'transparent transparent',  // For Firefox
  },
  // Add a specific rule for Webkit-based browsers (Chrome, Safari)
  sidebarWebkit: {
    '&::-webkit-scrollbar': {
      width: '8px',
      backgroundColor: 'transparent',  // Transparent background for the scrollbar
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'transparent',  // Transparent thumb
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',  // Transparent track
    },
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#f06c00',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#b0b0b0',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '10px',
  },
  sectionButton: {
    backgroundColor: 'transparent',
    color: '#fff',
    padding: '12px 0',
    border: 'none',
    textAlign: 'left',
    width: '100%',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    borderBottom: '1px solid #444',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrow: {
    fontSize: '0.9rem',
    color: '#888',
  },
  submenu: {
    listStyleType: 'none',
    paddingLeft: '20px',
    marginTop: '10px',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  submenuInner: {
    listStyleType: 'none',
    paddingLeft: '15px',
  },
  subheader: {
    fontSize: '0.9rem',
    color: '#b0b0b0',
    marginTop: '10px',
  },
  apiLink: {
    cursor: 'pointer',
    color: '#fff',
    padding: '8px 0',
    fontSize: '0.95rem',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  parameters: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#333',
    color: '#fff',
    overflowY: 'auto',
    borderRadius: '5px',
    boxShadow: '0 0 15px rgba(0,0,0,0.5)',
  },
  parametersTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
};

export default API_Selector;
