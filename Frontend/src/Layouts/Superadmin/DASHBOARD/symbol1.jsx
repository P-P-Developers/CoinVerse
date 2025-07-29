import React, { useState, useEffect } from "react";
import CandleChart from "./CandleChart";
import axios from "axios";

function Symbols() {
  const [liveData, setLiveData] = useState({});
  const [prevMidPrices, setPrevMidPrices] = useState({});
  const [OpenModAL, setOpenModAL] = useState("");
  const [rowData, setRowData] = useState([]);

  const ChartOpen = async (symbol) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:8800/get/intrady/price?symbol=ethusd&day=30",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        const formattedData = response.data
          .map((item) => {
         const utcDate = new Date(item.date);

// Convert to IST by adjusting 5 hours 30 minutes (19800 seconds)
const istOffsetMs = 5.5 * 60 * 60 * 1000;
const istDate = new Date(utcDate.getTime() + istOffsetMs);

// Get Unix timestamp in seconds (for IST)
const time = Math.floor(istDate.getTime() / 1000);
;

            return {
              time,
              open: item.open,
              high: item.high,
              low: item.low,
              close: item.close,
              _internal_originalTime: time,
            };
          })
          .filter((item) => !isNaN(item.time)) // Ensure no NaN
          .sort((a, b) => a.time - b.time); // Ensure ascending order


        setRowData(formattedData);
      })
      .catch((error) => {
      });
  };

  useEffect(() => {
    ChartOpen();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card transaction-table">
            <div className="card-header border-0 flex-wrap pb-0">
              <div className="container mt-4">
                <CandleChart data={rowData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Symbols;
