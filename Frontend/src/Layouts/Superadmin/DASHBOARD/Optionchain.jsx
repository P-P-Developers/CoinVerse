import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react';
// import socket from '../../../Utils/socketClient'; // Uncomment and configure for socket integration

const DeribitOptionsChain = () => {
  const [instruments, setInstruments] = useState([]);
  const [tickerData, setTickerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedExpiry, setSelectedExpiry] = useState('');
  const [btcPrice, setBtcPrice] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Fetch instruments from Deribit API
  const fetchInstruments = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://www.deribit.com/api/v2/public/get_instruments?currency=BTC&kind=option&expired=false');
      const data = await response.json();
      
      if (data.result) {
        setInstruments(data.result);
        
        // Get unique expiry dates and set first one as selected
        const expiries = [...new Set(data.result.map(inst => inst.expiration_timestamp))].sort();
        if (expiries.length > 0 && !selectedExpiry) {
          setSelectedExpiry(expiries[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching instruments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ticker data for all instruments
  const fetchTickerData = async () => {
    try {
      const response = await fetch('https://www.deribit.com/api/v2/public/get_book_summary_by_currency?currency=BTC&kind=option');
      const data = await response.json();
      
      if (data.result) {
        const tickerMap = {};
        data.result.forEach(ticker => {
          tickerMap[ticker.instrument_name] = ticker;
        });
        setTickerData(tickerMap);
      }

      // Get BTC index price
      const btcResponse = await fetch('https://www.deribit.com/api/v2/public/get_index?currency=BTC');
      const btcData = await btcResponse.json();
      if (btcData.result) {
        setBtcPrice(btcData.result.BTC);
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching ticker data:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchInstruments();
  }, []);

  // Fetch ticker data periodically
  useEffect(() => {
    if (instruments.length > 0) {
      fetchTickerData();
      const interval = setInterval(fetchTickerData, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [instruments]);

  // Parse instrument name
  const parseInstrument = (instrumentName) => {
    const parts = instrumentName.split('-');
    if (parts.length !== 4) return null;
    return {
      underlying: parts[0],
      expiry: parts[1],
      strike: parseFloat(parts[2]),
      type: parts[3]
    };
  };

  // Format expiry timestamp to readable date
  const formatExpiry = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: '2-digit' 
    }).replace(/ /g, ' ').toUpperCase();
  };

  // Get available expiry dates
  const expiryDates = useMemo(() => {
    const expiries = [...new Set(instruments.map(inst => inst.expiration_timestamp))]
      .sort()
      .map(timestamp => ({
        timestamp,
        label: formatExpiry(timestamp)
      }));
    return expiries;
  }, [instruments]);

  // Build options chain for selected expiry
  const optionsChain = useMemo(() => {
    if (!selectedExpiry) return {};

    const chain = {};
    const filteredInstruments = instruments.filter(inst => 
      inst.expiration_timestamp === selectedExpiry
    );

    filteredInstruments.forEach(instrument => {
      const parsed = parseInstrument(instrument.instrument_name);
      if (!parsed) return;

      const strike = parsed.strike;
      if (!chain[strike]) {
        chain[strike] = { call: null, put: null };
      }

      const ticker = tickerData[instrument.instrument_name] || {};
      const optionData = {
        ...instrument,
        ...ticker,
        parsed
      };

      chain[strike][parsed.type.toLowerCase() === 'c' ? 'call' : 'put'] = optionData;
    });

    // Sort by strike price
    return Object.keys(chain)
      .sort((a, b) => parseFloat(a) - parseFloat(b))
      .reduce((acc, strike) => {
        acc[strike] = chain[strike];
        return acc;
      }, {});
  }, [instruments, tickerData, selectedExpiry]);

  // Find ATM strike (closest to BTC price)
  const atmStrike = useMemo(() => {
    const strikes = Object.keys(optionsChain).map(Number);
    if (!strikes.length) return null;
    return strikes.reduce((prev, curr) =>
      Math.abs(curr - btcPrice) < Math.abs(prev - btcPrice) ? curr : prev
    );
  }, [optionsChain, btcPrice]);

  // Split strikes for OTM calls (above ATM), ATM, OTM puts (below ATM)
  const sortedStrikes = useMemo(() => {
    const strikes = Object.keys(optionsChain).map(Number).sort((a, b) => a - b);
    if (atmStrike === null) return [];
    const atmIndex = strikes.findIndex(s => s === atmStrike);
    return {
      callsOTM: strikes.slice(0, atmIndex).reverse(), // higher strikes above ATM for calls
      atm: atmStrike,
      putsOTM: strikes.slice(atmIndex + 1), // lower strikes below ATM for puts
    };
  }, [optionsChain, atmStrike]);

  // Calculate time to expiry
  const timeToExpiry = useMemo(() => {
    if (!selectedExpiry) return '';
    const now = new Date();
    const expiry = new Date(selectedExpiry);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${diffDays}d ${diffHours}h`;
  }, [selectedExpiry]);

  // Format number with proper decimals
  const formatNumber = (value, decimals = 4) => {
    if (value === null || value === undefined || value === 0) return '-';
    return Number(value).toFixed(decimals);
  };

  // Format percentage
  const formatPercentage = (value, decimals = 1) => {
    if (value === null || value === undefined) return '-';
    return `${(Number(value) * 100).toFixed(decimals)}%`;
  };

  // Get moneyness styling
  const getMoneyness = (strike, spotPrice) => {
    const diff = Math.abs(strike - spotPrice);
    if (diff < 1000) return 'atm';
    return strike < spotPrice ? 'itm' : 'otm';
  };

  // Calculate Greeks display
  const getGreeksDisplay = (option) => {
    if (!option.greeks) return { delta: '-', gamma: '-', theta: '-', vega: '-' };
    
    return {
      delta: formatNumber(option.greeks.delta, 3),
      gamma: formatNumber(option.greeks.gamma, 5),
      theta: formatNumber(option.greeks.theta, 2),
      vega: formatNumber(option.greeks.vega, 2)
    };
  };

  // Socket integration for live data (example, not active)
  // useEffect(() => {
  //   socket.on("optionchain_update", (data) => {
  //     // Update instruments/tickerData with socket data
  //   });
  //   return () => socket.off("optionchain_update");
  // }, []);

  // Buy/Sell button handler
  const handleTradeClick = (type, option) => {
    setModalData({ type, option });
    setShowModal(true);
  };

  // Modal component for Buy/Sell
  const TradeModal = ({ show, data, onClose }) => {
    if (!show || !data) return null;
    const { type, option } = data;
    return (
      <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{type === "buy" ? "Buy" : "Sell"} Option</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <p><strong>Instrument:</strong> {option?.instrument_name}</p>
              <p><strong>Strike:</strong> {option?.parsed?.strike}</p>
              <p><strong>Type:</strong> {option?.parsed?.type}</p>
              <p><strong>Mark Price:</strong> {option?.mark_price}</p>
              {/* Add more details as needed */}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={onClose}>Confirm</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper to get USD price for an option
  const getUSDPrice = (option) => {
    if (!option) return '-';
    const mark = option.mark_price;
    const index = option.index_price || option.underlying_price;
    if (!mark || !index) return '-';
    return (mark * index).toFixed(2);
  };

  const OptionRow = ({ strike, call, put, isATM }) => {
    // ATM row gets a distinct background color
    return (
      <tr style={isATM ? { backgroundColor: "#ffeeba" } : {}}>
        {/* Buy/Sell buttons for CALL (leftmost) */}
        <td>
          <button
            className="btn btn-sm btn-success me-1"
            title="Buy Call"
            onClick={() => handleTradeClick("buy", call)}
            disabled={!call}
          >Buy</button>
          <button
            className="btn btn-sm btn-danger"
            title="Sell Call"
            onClick={() => handleTradeClick("sell", call)}
            disabled={!call}
          >Sell</button>
        </td>
        {/* CALL Side */}
        <td className="text-success fw-bold">{formatNumber(call?.open_interest, 1)}</td>
        <td className="text-success">{formatPercentage(call?.mark_iv)}</td>
        <td className="text-success">{getUSDPrice(call)}</td>
        <td className="text-success">{formatNumber(call?.mark_price)}</td>
        {/* Strike Price */}
        <td className="fw-bold text-center">{strike}</td>
        {/* PUT Side */}
        <td className="text-danger">{formatNumber(put?.mark_price)}</td>
        <td className="text-danger">{getUSDPrice(put)}</td>
        <td className="text-danger">{formatPercentage(put?.mark_iv)}</td>
        <td className="text-danger fw-bold">{formatNumber(put?.open_interest, 1)}</td>
        {/* Buy/Sell buttons for PUT (rightmost) */}
        <td>
          <button
            className="btn btn-sm btn-success me-1"
            title="Buy Put"
            onClick={() => handleTradeClick("buy", put)}
            disabled={!put}
          >Buy</button>
          <button
            className="btn btn-sm btn-danger"
            title="Sell Put"
            onClick={() => handleTradeClick("sell", put)}
            disabled={!put}
          >Sell</button>
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
        <div className="text-center">
          <RefreshCw className="mb-3" />
          <div>Loading Options Data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <TradeModal show={showModal} data={modalData} onClose={() => setShowModal(false)} />
      <div className="row">
        <div className="col-lg-12">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0 text-warning">Bitcoin Options</h4>
                <small className="text-muted">Deribit • Live Data</small>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div>
                  <span className="fw-bold text-success">${btcPrice.toLocaleString()}</span>
                  <small className="d-block text-muted">BTC Index</small>
                </div>
                <select
                  value={selectedExpiry}
                  onChange={e => setSelectedExpiry(parseInt(e.target.value))}
                  className="form-select form-select-sm"
                >
                  {expiryDates.map(expiry => (
                    <option key={expiry.timestamp} value={expiry.timestamp}>
                      {expiry.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={fetchTickerData}
                  className="btn btn-primary btn-sm"
                >
                  <RefreshCw size={16} /> Refresh
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-2 d-flex justify-content-between">
                <span><Clock size={16} /> Expires: {timeToExpiry}</span>
                <span className="text-muted">Last Update: {lastUpdate.toLocaleTimeString()}</span>
              </div>
              <div className="table-responsive" style={{ maxHeight: "700px", overflowY: "auto" }}>
                <table className="table table-bordered table-hover table-sm align-middle">
                  <thead className="table-dark">
                    <tr>
                      {/* Buy/Sell CALL */}
                      <th>CALL</th>
                      {/* CALL Side */}
                      <th>Open Interest</th>
                      <th>IV</th>
                      <th>USD Price</th>
                      <th>Mark</th>
                      {/* Strike */}
                      <th className="bg-secondary text-white">Strike</th>
                      {/* PUT Side */}
                      <th>Mark</th>
                      <th>USD Price</th>
                      <th>IV</th>
                      <th>Open Interest</th>
                      {/* Buy/Sell PUT */}
                      <th>PUT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* OTM Calls above ATM */}
                    {sortedStrikes.callsOTM.map(strike =>
                      <OptionRow key={strike} strike={strike} {...optionsChain[strike]} isATM={false} />
                    )}
                    {/* ATM Strike */}
                    {atmStrike !== null && (
                      <OptionRow key={atmStrike} strike={atmStrike} {...optionsChain[atmStrike]} isATM={true} />
                    )}
                    {/* OTM Puts below ATM */}
                    {sortedStrikes.putsOTM.map(strike =>
                      <OptionRow key={strike} strike={strike} {...optionsChain[strike]} isATM={false} />
                    )}
                  </tbody>
                </table>
              </div>
              {/* Remove summary stats */}
              {/* Remove API Info */}
              <div className="mt-3">
                <div className="alert alert-dark small">
                  <strong>Data Source:</strong> Deribit API v2 •
                  <strong> Updates:</strong> Every 5 seconds •
                  <strong> Instruments API:</strong> /public/get_instruments •
                  <strong> Ticker API:</strong> /public/get_book_summary_by_currency
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeribitOptionsChain;