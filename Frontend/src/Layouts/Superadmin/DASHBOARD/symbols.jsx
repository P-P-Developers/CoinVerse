import React, { useState, useEffect } from "react";
import socket from "../../../Utils/socketClient";

const pipes = [
  // Forex
  { symbol: "audcad", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "audjpy", pip: 0.01, category: "forex", digit: 2 },
  { symbol: "audnzd", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "audusd", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "euraud", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "eurchf", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "eurgbp", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "eurjpy", pip: 0.01, category: "forex", digit: 2 },
  { symbol: "eurnzd", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "eurusd", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "gbpaud", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "gbpcad", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "gbpchf", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "gbpjpy", pip: 0.01, category: "forex", digit: 2 },
  { symbol: "gbpusd", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "jpyusd", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "nzdjpy", pip: 0.01, category: "forex", digit: 2 },
  { symbol: "nzdusd", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "usdcad", pip: 0.0001, category: "forex", digit: 4 },
  { symbol: "usdchf", pip: 0.0001, category: "forex", digit: 4 },

  // Commodity
  { symbol: "xauusd", pip: 0.01, category: "commodity", digit: 2 }, // Gold
  { symbol: "xagusd", pip: 0.01, category: "commodity", digit: 2 }, // Silver

  // Crypto
  { symbol: "bnbbtc", pip: 0.000001, category: "crypto", digit: 6 },
  { symbol: "btcusd", pip: 1, category: "crypto", digit: 3 },
  { symbol: "dogeusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "ethusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "solbtc", pip: 0.000001, category: "crypto", digit: 6 },
  { symbol: "solusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "usdtusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "xrpusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "adausd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "bchusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "suiusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "linkusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "xlmusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "shibusd", pip: 0.00000001, category: "crypto", digit: 8 },
  { symbol: "ltcusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "hbarusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "dotusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "uniusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "pepeusd", pip: 0.00000001, category: "crypto", digit: 8 },
  { symbol: "aaveusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "taousd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "aptusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "icpusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "nearusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "etcusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "ondousd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "usd1usd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "gtusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "mntusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "polusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "vetusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "kasusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "trumpusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "enausd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "skyusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "renderusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "fetusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "filusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "daiusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "usdcusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "avaxusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "bnbusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "trxusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "hypeusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "leousd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "xmrusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "usdeusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "bgbusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "piusd", pip: 0.0001, category: "crypto", digit: 4 },
  { symbol: "okbusd", pip: 0.01, category: "crypto", digit: 2 },
  { symbol: "croususd", pip: 0.01, category: "crypto", digit: 2 },
];

function Symbols() {
  const [liveData, setLiveData] = useState({});
  const [prevMidPrices, setPrevMidPrices] = useState({});

  useEffect(() => {
    // socket.emit("join_plan", "Standard"); // or "Basic", "Premium","Standard"
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
            bid: bid,
            ask: ask,
            mid: mid,
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
