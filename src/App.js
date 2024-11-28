import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import API_Explorer from './components/API_Explorer';  // Import API_Explorer from the new path
import API_Selector from './components/API_Selector';  // Import API_Selector from the new path
import Aggregates from './components/Rest_API/Market_Data/Endpoints/Aggregates';  // Import Aggregates
import AggregatesGraph from './components/Rest_API/Market_Data/Graphs/Aggregates_Graph';
import TradesGraph from './components/Rest_API/Market_Data/Graphs/trade_Graph';
import QuotesGraph from './components/Rest_API/Market_Data/Graphs/QuotesGraph';
import SmaGraph  from './components/Rest_API/Market_Data/Graphs/SmaGraph';
import EmaGraph from './components/Rest_API/Market_Data/Graphs/EmaGraph';
import MACDChart from './components/Rest_API/Market_Data/Graphs/MacdGraph';
import RsiGraph from './components/Rest_API/Market_Data/Graphs/RsiGraph';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<API_Explorer />} />  {/* Default route */}
        <Route path="/api-selector" element={<API_Selector />} />  {/* API Selector route */}
        <Route path="/aggregates" element={<Aggregates />} />  {/* Aggregates route */}
        <Route path="/aggregates-graph" element={<AggregatesGraph />} />
        <Route path="/tradesgraph" element={<TradesGraph />} />
        <Route path="/quotesgraph" element={<QuotesGraph />} />
        <Route path="/smagraphpath" element={<SmaGraph />}/>
        <Route path="/emagraphpath" element={<EmaGraph />}/>
        <Route path="/macdgraphpath" element={<MACDChart />}/>
        <Route path="/rsigraph" element={<RsiGraph/>}/>



      </Routes>
    </Router>
  );
};

export default App;
