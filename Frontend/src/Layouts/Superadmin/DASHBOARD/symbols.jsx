import React, { useState, useEffect } from "react";
import socket from "../../../Utils/socketClient";

const pipes = [
  // Forex
  { symbol: "audcad", pip: 0.0001, category: "forex" },
  { symbol: "audjpy", pip: 0.01, category: "forex" },
  { symbol: "audnzd", pip: 0.0001, category: "forex" },
  { symbol: "audusd", pip: 0.0001, category: "forex" },
  { symbol: "euraud", pip: 0.0001, category: "forex" },
  { symbol: "eurchf", pip: 0.0001, category: "forex" },
  { symbol: "eurgbp", pip: 0.0001, category: "forex" },
  { symbol: "eurjpy", pip: 0.01, category: "forex" },
  { symbol: "eurnzd", pip: 0.0001, category: "forex" },
  { symbol: "eurusd", pip: 0.0001, category: "forex" },
  { symbol: "gbpaud", pip: 0.0001, category: "forex" },
  { symbol: "gbpcad", pip: 0.0001, category: "forex" },
  { symbol: "gbpchf", pip: 0.0001, category: "forex" },
  { symbol: "gbpjpy", pip: 0.01, category: "forex" },
  { symbol: "gbpusd", pip: 0.0001, category: "forex" },
  { symbol: "jpyusd", pip: 0.0001, category: "forex" },
  { symbol: "nzdjpy", pip: 0.01, category: "forex" },
  { symbol: "nzdusd", pip: 0.0001, category: "forex" },
  { symbol: "usdcad", pip: 0.0001, category: "forex" },
  { symbol: "usdchf", pip: 0.0001, category: "forex" },

  // Commodity
  { symbol: "xauusd", pip: 0.01, category: "commodity" }, // Gold
  { symbol: "xagusd", pip: 0.01, category: "commodity" }, // Silver

  // Crypto
  { symbol: "bnbbtc", pip: 0.000001, category: "crypto" },
  { symbol: "btcusd", pip: 1, category: "crypto" },
  { symbol: "dogeusd", pip: 0.0001, category: "crypto" },
  { symbol: "ethusd", pip: 0.01, category: "crypto" },
  { symbol: "solbtc", pip: 0.000001, category: "crypto" },
  { symbol: "solusd", pip: 0.01, category: "crypto" },
  { symbol: "usdtusd", pip: 0.0001, category: "crypto" },
  { symbol: "xrpusd", pip: 0.0001, category: "crypto" },
  { symbol: "adausd", pip: 0.0001, category: "crypto" },
  { symbol: "bchusd", pip: 0.01, category: "crypto" },
  { symbol: "suiusd", pip: 0.0001, category: "crypto" },
  { symbol: "linkusd", pip: 0.01, category: "crypto" },
  { symbol: "xlmusd", pip: 0.0001, category: "crypto" },
  { symbol: "shibusd", pip: 0.00000001, category: "crypto" },
  { symbol: "ltcusd", pip: 0.01, category: "crypto" },
  { symbol: "hbarusd", pip: 0.0001, category: "crypto" },
  { symbol: "dotusd", pip: 0.01, category: "crypto" },
  { symbol: "uniusd", pip: 0.01, category: "crypto" },
  { symbol: "pepeusd", pip: 0.00000001, category: "crypto" },
  { symbol: "aaveusd", pip: 0.01, category: "crypto" },
  { symbol: "taousd", pip: 0.01, category: "crypto" },
  { symbol: "aptusd", pip: 0.01, category: "crypto" },
  { symbol: "icpusd", pip: 0.01, category: "crypto" },
  { symbol: "nearusd", pip: 0.0001, category: "crypto" },
  { symbol: "etcusd", pip: 0.01, category: "crypto" },
  { symbol: "ondousd", pip: 0.0001, category: "crypto" },
  { symbol: "usd1usd", pip: 0.0001, category: "crypto" },
  { symbol: "gtusd", pip: 0.0001, category: "crypto" },
  { symbol: "mntusd", pip: 0.0001, category: "crypto" },
  { symbol: "polusd", pip: 0.01, category: "crypto" },
  { symbol: "vetusd", pip: 0.0001, category: "crypto" },
  { symbol: "kasusd", pip: 0.0001, category: "crypto" },
  { symbol: "trumpusd", pip: 0.0001, category: "crypto" },
  { symbol: "enausd", pip: 0.0001, category: "crypto" },
  { symbol: "skyusd", pip: 0.0001, category: "crypto" },
  { symbol: "renderusd", pip: 0.01, category: "crypto" },
  { symbol: "fetusd", pip: 0.0001, category: "crypto" },
  { symbol: "filusd", pip: 0.01, category: "crypto" },
  { symbol: "daiusd", pip: 0.0001, category: "crypto" },
  { symbol: "usdcusd", pip: 0.0001, category: "crypto" },
  { symbol: "avaxusd", pip: 0.01, category: "crypto" },
  
  { symbol: "bnbusd", pip: 0.01, category: "crypto" },
  { symbol: "trxusd", pip: 0.0001, category: "crypto" },
  { symbol: "hypeusd", pip: 0.0001, category: "crypto" },
  { symbol: "leousd", pip: 0.0001, category: "crypto" },
  { symbol: "xmrusd", pip: 0.0001, category: "crypto" },
  { symbol: "usdeusd", pip: 0.0001, category: "crypto" },
  { symbol: "bgbusd", pip: 0.0001, category: "crypto" },
  { symbol: "piusd", pip: 0.0001, category: "crypto" },
  { symbol: "okbusd", pip: 0.01, category: "crypto" },
  { symbol: "croususd", pip: 0.01, category: "crypto" },

];




function Symbols() {
  const [liveData, setLiveData] = useState({});
  const [prevMidPrices, setPrevMidPrices] = useState({});

  useEffect(() => {
    socket.emit("join_plan", "Standard"); // or "Basic", "Premium","Standard"
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
  }, []);

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
                <table className="table table-bordered table-striped table-hover">
                  <thead className="bg-dark text-white">
                    <tr>
                      <th className="text-uppercase fs-5">No</th>

                      <th className="text-uppercase fs-5">Symbol</th>
                      <th className="text-uppercase fs-5">Pip</th>
                      <th className="text-uppercase fs-5">Type</th>
                      <th className="text-uppercase fs-5">Bid</th>
                      <th className="text-uppercase fs-5">Mid</th>
                      <th className="text-uppercase fs-5">Ask</th>
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
                          <td>{index + 1}</td>

                          <td>{item.symbol.toUpperCase()}</td>
                          <td>{item.pip}</td>
                          <td>{item?.category || "-"}</td>
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
