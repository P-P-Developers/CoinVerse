import { Accordion, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import socket from "../../../Utils/socketClient";
import "./AggregatedPosition.css";
import Swal from "sweetalert2";
import { getUserFromToken } from "../../../Utils/TokenVerify";

import { AddCondition } from "../../../Services/Superadmin/Superadmin";

const AggregatedPosition = ({ groupedData }) => {
  const [cardPage, setCardPage] = useState(0);
  const [pageStates, setPageStates] = useState({});
  const [livePrices, setLivePrices] = useState({});
  const [prevPrices, setPrevPrices] = useState({});
  const TokenData = getUserFromToken();
  const user_id = TokenData?.user_id;

  const cardPageSize = 5;
  const tablePageSize = 10;

  useEffect(() => {
    socket.on("receive_data_forex", (data) => {
      const symbol = data.data[1]?.toLowerCase();
      const price = Number(data.data[5]);

      if (symbol && !isNaN(price)) {
        setPrevPrices((prev) => ({
          ...prev,
          [symbol]: livePrices[symbol], // store the previous price
        }));
        setLivePrices((prev) => ({
          ...prev,
          [symbol]: price.toFixed(3),
        }));
      }
    });

    return () => {
      socket.off("receive_data_forex");
    };
  }, [livePrices]);

  const totalCardPages = Math.ceil(groupedData.length / cardPageSize);
  const displayedGroups = groupedData.slice(
    cardPage * cardPageSize,
    (cardPage + 1) * cardPageSize
  );

  const SetConditions = async (type, symbol, livePrice, avgPrice) => {
    const { value: inputDrop } = await Swal.fire({
      title: "Enter Drop Threshold",
      input: "number",
      inputLabel: "Enter the drop amount (e.g., 1000 for $1000)",
      inputPlaceholder: "e.g. 1000",
      inputAttributes: {
        min: 1,
        step: 1,
      },
      showCancelButton: true,
    });

    if (!inputDrop) {
      Swal.fire("Cancelled", "You cancelled the condition setup", "info");
      return;
    }

    const dropValue = parseFloat(inputDrop);
    if (isNaN(dropValue)) {
      Swal.fire("Error", "Invalid drop amount", "error");
      return;
    }

    const dropThreshold = type === "up" ? dropValue : -Math.abs(dropValue);

    Swal.fire({
      title: "Setting Condition",
      text: `Setting ${type} condition for ${symbol} at price ${livePrice} with threshold ${dropThreshold}`,
      showConfirmButton: false,
      timer: 2000,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const data = {
      userId: user_id,
      symbol: symbol,
      initialPrice: livePrice,
      dropThreshold: type == "up" ? dropThreshold : -Math.abs(dropThreshold), // Ensure negative for down condition
      timeWindow: 60, // in seconds
    };

    try {
      const response = await AddCondition(data);

      if (response.status) {
        Swal.fire("Success", "Condition set successfully!", "success");
      } else {
        Swal.fire(
          "Error",
          response.error || "Failed to set condition",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Network error", "error");
    }
  };

  return (
    <div className="container-fluid px-3">
      {displayedGroups.map((group, index) => {
        const actualIndex = cardPage * cardPageSize + index;
        const {
          _id: { symbol, signal_type },
          count,
          avg_buy_price,
          avg_sell_price,
          avg_buy_lot,
          avg_sell_lot,
          avg_buy_qty,
          avg_sell_qty,
          records,
        } = group;

        const signalColor =
          signal_type === "buy_sell"
            ? "#198754"
            : signal_type === "sell_buy"
            ? "#dc3545"
            : "#0d6efd";

        const currentPage = pageStates[actualIndex] || 0;
        const totalPages = Math.ceil(records.length / tablePageSize);
        const symbolKey = symbol?.toLowerCase();
        const livePrice = livePrices[symbolKey];
        const prevPrice = prevPrices[symbolKey];
        let priceColor = "#0d6efd"; // default blue

        if (prevPrice && livePrice) {
          const current = parseFloat(livePrice);
          const previous = parseFloat(prevPrice);

          if (current >= previous) priceColor = "green";
          else if (current < previous) priceColor = "red";
        }

        return (
          <Card
            className="mb-4 shadow animated-card border-0"
            key={actualIndex}
          >
            <Card.Header className="custom-header py-3 px-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center flex-wrap mb-2">
                    <h4 className="mb-0 fw-bold text-dark me-2 header-symbol">
                      {symbol}
                      <span
                        style={{ color: signalColor }}
                        className="ms-2 fw-semibold"
                      >
                        (
                        {signal_type.toUpperCase() === "BUY_SELL"
                          ? "BUY"
                          : "SELL"}
                        )
                      </span>
                    </h4>
                    <span className="badge bg-dark ms-3 fs-6">
                      Count: {count}
                    </span>
                  </div>

                  <div className="averages-text mt-2">
                    <span className="fw-semibold text-secondary me-2">
                      🎯 Averages:
                    </span>
                    <div className="d-flex flex-wrap gap-4 text-muted averages-row mt-1">
                      <span className="text-primary fs-6">
                        Buy: <strong>{avg_buy_price?.toFixed(3) ?? "-"}</strong>
                      </span>
                      <span className="text-danger fs-6">
                        Sell:{" "}
                        <strong>{avg_sell_price?.toFixed(3) ?? "-"}</strong>
                      </span>
                      <span className="fs-6">
                        Buy Lot:{" "}
                        <strong className="text-dark">
                          {avg_buy_lot ?? "0"}
                        </strong>
                      </span>
                      <span className="fs-6">
                        Sell Lot:{" "}
                        <strong className="text-dark">
                          {avg_sell_lot ?? "0"}
                        </strong>
                      </span>
                      <span className="fs-6">
                        Buy Qty:{" "}
                        <strong className="text-dark">
                          {avg_buy_qty ?? "0"}
                        </strong>
                      </span>
                      <span className="fs-6">
                        Sell Qty:{" "}
                        <strong className="text-dark">
                          {avg_sell_qty ?? "0"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 mt-3">
                    <span className="text-muted fs-6 fw-semibold">
                      <strong>Live Price:</strong>
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "1.1em",
                        color: priceColor,
                        minWidth: 60,
                        display: "inline-block",
                        background: "#f1f8ff",
                        borderRadius: "6px",
                        padding: "2px 10px",
                      }}
                    >
                      {livePrice ?? "-"}
                    </span>
                  </div>
                </div>

                <div
                  className="d-flex flex-row gap-2"
                  style={{ minWidth: "250px" }}
                >
                  <button
                    className="btn btn-sm btn-outline-success animate-btn w-100"
                    onClick={() =>
                      SetConditions(
                        "up",
                        symbol,
                        livePrice,
                        avg_buy_price ? avg_buy_price : avg_sell_price
                      )
                    }
                  >
                    🔼 Up Error
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger animate-btn w-100"
                    onClick={() =>
                      SetConditions(
                        "down",
                        symbol,
                        livePrice,
                        avg_buy_price ? avg_buy_price : avg_sell_price
                      )
                    }
                  >
                    🔽 Down Error
                  </button>
                </div>
              </div>
            </Card.Header>

            <Accordion defaultActiveKey={null}>
              <Accordion.Item eventKey="0">
                <Accordion.Header>📂 View All Records</Accordion.Header>
                <Accordion.Body>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered table-sm align-middle text-center mb-0">
                      <thead className="">
                        <tr>
                          <th>#</th>
                          <th>User Name</th>
                          <th>symbol</th>

                          <th>Buy Price</th>
                          <th>Sell Price</th>
                          <th>Buy Lot</th>
                          <th>Sell Lot</th>
                          <th>Buy Qty</th>
                          <th>Sell Qty</th>
                          <th>Target</th>
                          <th>Stop Loss</th>

                          <th>Max Loss</th>

                          <th>Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records
                          ?.slice(
                            currentPage * tablePageSize,
                            (currentPage + 1) * tablePageSize
                          )
                          .map((item, idx) => (
                            <tr key={idx}>
                              <td>{currentPage * tablePageSize + idx + 1}</td>
                              <td>{item.userName}</td>
                              <td>{item.symbol}</td>

                              <td>{item.buy_price ?? livePrices[item.symbol?.toLowerCase()]}</td>
                              <td>{item.sell_price ?? livePrices[item.symbol?.toLowerCase()]}</td>
                              <td>{item.buy_lot ?? "-"}</td>
                              <td>{item.sell_lot ?? "-"}</td>
                              <td>{item.buy_qty ?? "-"}</td>
                              <td>{item.sell_qty ?? "-"}</td>
                              <td>{item.Target_price ?? "-"}</td>
                              <td>{item.stoploss_price ?? "-"}</td>
                              <td>{item.Sl_price_percentage ?? "-"}</td>

                              <td>
                                {new Date(item.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Pagination */}
                  <div className="d-flex justify-content-end align-items-center mt-3">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      disabled={currentPage === 0}
                      onClick={() =>
                        setPageStates((prev) => ({
                          ...prev,
                          [actualIndex]: currentPage - 1,
                        }))
                      }
                    >
                      ◀ Prev
                    </button>
                    <span>
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-primary ms-2"
                      disabled={currentPage + 1 >= totalPages}
                      onClick={() =>
                        setPageStates((prev) => ({
                          ...prev,
                          [actualIndex]: currentPage + 1,
                        }))
                      }
                    >
                      Next ▶
                    </button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Card>
        );
      })}

      {/* Card Pagination */}
      <div className="d-flex justify-content-center align-items-center my-4">
        <button
          className="btn btn-outline-secondary me-2"
          disabled={cardPage === 0}
          onClick={() => setCardPage((prev) => prev - 1)}
        >
          ◀ Prev
        </button>
        <span className="mx-2">
          Card Page {cardPage + 1} of {totalCardPages}
        </span>
        <button
          className="btn btn-outline-secondary ms-2"
          disabled={cardPage + 1 >= totalCardPages}
          onClick={() => setCardPage((prev) => prev + 1)}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default AggregatedPosition;
