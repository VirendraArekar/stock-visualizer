export const Config = {
  aggregates: {
    url: "https://api.polygon.io/v2/aggs/ticker/",
    Params: {
      stocksTicker: "", 
      multiplier: 1,
      timespan: "",  
      from: "",
      to: "",
      adjusted: false,
      sort: "",
      limit: 100
    }
  },
  trades: {
    url: "https://api.polygon.io/v3/trades/",
    Params: {
      stocksTicker: "",
      timestamp: "",  
      order: "",
      limit: "10",
      sort: ""
    }
  },
  quotes: {
    url: "https://api.polygon.io/v3/quotes/",
    Params: {
      stocksTicker: "",
      timespan: "",  
      order: "",
      limit: "10",
      sort: ""
    }
  },
  LastQuotes: {
    url: "https://api.polygon.io/v2/last/nbbo/",
    Params: {
      stocksTicker: ""
    }
  },

    "gainers/Loosers": {
      url: "https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/",
      Params: {
        direction: "",
        include_otc: ""
      }
    },
    SMA: {
      url:"https://api.polygon.io/v1/indicators/sma/",
      Params: {
        stocksTicker: "",
        timestamp: "",
        timespan: "day",
        adjusted: true,
        window: 50,
        series_type: "close",
        expand_underlying: true,
        order: "desc",
        limit: 10
      }
    },
    EMA: {
      url: "https://api.polygon.io/v1/indicators/ema/",
      Params: {
        stocksTicker: "",
        timestamp: "day",
        timespan: "",
        adjusted: true,
        window: 50,
        series_type: "close",
        expand_underlying: true,
        order: "desc",
        limit: 10
      }
    },
    MACD: {
      url: "https://api.polygon.io/v1/indicators/macd/",
      Params: {
        stocksTicker: "",
        timestamp: "",
        timespan: "day",
        adjusted: true,
        short_window: 12,
        long_window: 26,
        signal_window: 9,
        series_type: "close",
        expand_underlying: true,
        order: "desc",
        limit: 10
      }
    },
    RSI: {
      url: "https://api.polygon.io/v1/indicators/rsi/",
      Params: {
        stocksTicker: "",
        timestamp: "",
        timespan: "day",
        adjusted: true,
        window: 14,
        series_type: "close",
        expand_underlying: true,
        order: "desc",
        limit: 10
      }
  },
  "Ticker Details V3":{
  url:"https://api.polygon.io/v3/reference/tickers/",
  Params:{
    stocksTicker: "",
    date:"",
  }
  },
  "Ticker Events":{
    url:"https://api.polygon.io/vX/reference/tickers/",
    Params:{
      stocksTicker:"",
    }
    },
    "Stock Splits V3": {
      url: "https://api.polygon.io/v3/reference/splits",
      Params: {
        ticker: "",
        limit: 10,
       
      }
    },
    "Dividends D3": {
      url: "https://api.polygon.io/v3/reference/dividends",
      Params: {
        ticker:"",
        order:"",
        limit:10,
        sort:"",
       
      }
    },
    "Ticker News": {
      url: "https://api.polygon.io/v2/reference/news",
      Params: {
        ticker:"",
        order:"",
        limit:10,
        sort:"",
       
      }
    },
"Stock Financials vX":{
  url: "https://api.polygon.io/vX/reference/financials",
  Params: {
      "ticker": "",
      "cik": "",
      "company_name": "",
      "sic": "",
      "filing_date": "",
      "period_of_report_date": "",
      "timeframe": "",
      "include_sources": "",
      "order": "",
      "limit": 10,
      "sort": "",
  }
},

  Apikey:"L_aeUHEjW5ATmIIeTQPeviyJpg4ODuYG" 
};
