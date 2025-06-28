import React, { useState, useEffect } from "react";
import socket from "../../../Utils/socketClient";

const pipes = [
  { symbol: "usdtusd", pip: 0.0001 },
  { symbol: "btcxrp", pip: 0.00001 },
  { symbol: "btcusd", pip: 0.01 },
  { symbol: "ethxrp", pip: 0.00001 },
  { symbol: "ethusd", pip: 0.01 },
  { symbol: "usdcusd", pip: 0.0001 },
  { symbol: "solusd", pip: 0.001 },
  { symbol: "solbtc", pip: 0.000001 },
  { symbol: "bnbbtc", pip: 0.000001 },
  { symbol: "xrpusd", pip: 0.0001 },
  { symbol: "daiusd", pip: 0.0001 },
  { symbol: "dogeusd", pip: 0.00001 },
  { symbol: "xauusd", pip: 0.01 },
  { symbol: "audcad", pip: 0.0001 },
  { symbol: "audjpy", pip: 0.01 },
  { symbol: "audnzd", pip: 0.0001 },
  { symbol: "audusd", pip: 0.0001 },
  { symbol: "euraud", pip: 0.0001 },
  { symbol: "eurchf", pip: 0.0001 },
  { symbol: "eurgbp", pip: 0.0001 },
  { symbol: "eurjpy", pip: 0.01 },
  { symbol: "eurnzd", pip: 0.0001 },
  { symbol: "eurusd", pip: 0.0001 },
  { symbol: "gbpaud", pip: 0.0001 },
  { symbol: "gbpcad", pip: 0.0001 },
  { symbol: "gbpchf", pip: 0.0001 },
  { symbol: "gbpjpy", pip: 0.01 },
  { symbol: "gbpusd", pip: 0.0001 },
  { symbol: "jpyusd", pip: 0.0001 },
  { symbol: "nzdjpy", pip: 0.01 },
  { symbol: "nzdusd", pip: 0.0001 },
  { symbol: "usdcad", pip: 0.0001 },
  { symbol: "usdchf", pip: 0.01 },
  { symbol: "xauusd", pip: 0.01 },
  { symbol: "wtiousd", pip: 0.01 },
  { symbol: "brentusd", pip: 0.001 },
  { symbol: "natgasusd", pip: 0.0001 },
  { symbol: "rbobusd", pip: 0.0001 },
  { symbol: "heatoilusd", pip: 0.0001 },
  { symbol: "propaneusd", pip: 0.01 },
  { symbol: "coalusd", pip: 0.01 },
  { symbol: "uraniumusd", pip: 0.0001 },
  { symbol: "ethanolusd", pip: 0.01 },
  { symbol: "electricityusd", pip: 0.01 },
  { symbol: "xagusd", pip: 0.01 },
  { symbol: "krwusd", pip: 0.01 },
];

function Symbols() {
  const [liveData, setLiveData] = useState({});
  const [prevMidPrices, setPrevMidPrices] = useState({});

  useEffect(() => {
    socket.on("receive_data_forex", (data) => {
      const ticker = data?.data?.ticker?.toLowerCase();
      const bid = data?.data?.Bid_Price;
      const ask = data?.data?.Ask_Price;
      const mid = data?.data?.Mid_Price;
      const type = data?.type;

      if (ticker && bid && ask && mid) {
        setPrevMidPrices((prev) => ({
          ...prev,
          [ticker]: liveData[ticker]?.mid || 0,
        }));

        setLiveData((prev) => ({
          ...prev,
          [ticker]: {
            bid: bid.toFixed(5),
            ask: ask.toFixed(5),
            mid: mid.toFixed(5),
            type,
          },
        }));
      }
    });

    return () => {
      socket.off("receive_data_forex");
    };
  }, [liveData]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card transaction-table">
            <div className="card-header border-0 flex-wrap pb-0">
              <div className="mb-4">
                <h4 className="card-title">Admin User</h4>
              </div>

              <div className="container mt-4">
                <h2 className="mb-3">Symbol Live Prices</h2>
                <table className="table table-bordered table-striped">
                  <thead className="thead-dark">
                    <tr>
                      <th>Symbol</th>
                      <th>Pip</th>
                      <th>Type</th>
                      <th>Bid</th>
                      <th>Mid</th>
                      <th>Ask</th>
                    </tr>
                  </thead>
                 <tbody>
  {pipes.map((item, index) => {
    const live = liveData[item.symbol];
    const prevMid = prevMidPrices[item.symbol];
    const direction =
      live?.mid > prevMid
        ? "↑"
        : live?.mid < prevMid
        ? "↓"
        : "";

    // Determine text color class
    const getColorClass = (field, prev) => {
      if (!live?.[field]) return "text-muted";
      if (live?.mid > prev) return "text-success"; // Up
      if (live?.mid < prev) return "text-danger"; // Down
      return "";
    };

    return (
      <tr key={index}>
        <td>{item.symbol.toUpperCase()}</td>
        <td>{item.pip}</td>
        <td>{live?.type || "-"}</td>
        <td className={getColorClass("bid", prevMid)}>
          {live?.bid || "-"}
        </td>
        <td className={getColorClass("mid", prevMid)}>
          {live?.mid || "-"} {direction}
        </td>
        <td className={getColorClass("ask", prevMid)}>
          {live?.ask || "-"}
        </td>
      </tr>
    );
  })}
</tbody>

                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Symbols;
