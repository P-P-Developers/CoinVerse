import { Accordion, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import socket from "../../../Utils/socketClient";
import Swal from "sweetalert2";
import { getUserFromToken } from "../../../Utils/TokenVerify";
import { AddCondition } from "../../../Services/Superadmin/Superadmin";
import { commandAlert } from "../../../Utils/Commanalert";

const AggregatedPosition = ({ groupedData, search = "" }) => {



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
          [symbol]: livePrices[symbol],
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





  // Filter logic for search
  const filteredGroups = React.useMemo(() => {
    if (!search?.trim()) return groupedData;
    const lower = search.trim().toLowerCase();
    return groupedData.filter((group) => {
      const symbol = group._id?.symbol?.toLowerCase() || "";
      if (symbol.includes(lower)) return true;
      if (
        group.records?.some((r) =>
          (r.userName || "").toLowerCase().includes(lower)
        )
      )
        return true;
      return false;
    });
  }, [groupedData, search]);




  const totalCardPages = Math.ceil(filteredGroups.length / cardPageSize);
  const displayedGroups = filteredGroups.slice(
    cardPage * cardPageSize,
    (cardPage + 1) * cardPageSize
  );




  // SweetAlert for trading
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
      customClass: { popup: "swal2-trading-popup" },
      background: "#f8fafc",
      color: "#1e293b",
    });

    if (!inputDrop) {
      commandAlert({
        type: "info",
        title: "Cancelled",
        text: "You cancelled the condition setup",
        icon: "warn",
      });
      return;
    }

    const dropValue = parseFloat(inputDrop);
    if (isNaN(dropValue)) {
      commandAlert({
        type: "error",
        title: "Error",
        text: "Invalid drop amount",
        icon: "error",
      });
      return;
    }




    const dropThreshold = type === "up" ? dropValue : -Math.abs(dropValue);

    commandAlert({
      type: "info",
      title: "Setting Condition",
      text: `Setting ${type} condition for ${symbol} at price ${livePrice} with threshold ${dropThreshold}`,
      icon: "trade",
      showLoading: true,
    });




    const data = {
      userId: user_id,
      symbol: symbol,
      initialPrice: livePrice,
      dropThreshold: type == "up" ? dropThreshold : -Math.abs(dropThreshold),
      timeWindow: 60,
    };

    try {
      const response = await AddCondition(data);

      if (response.status) {
        commandAlert({
          type: "success",
          title: "Success",
          text: "Condition set successfully!",
          icon: "success",
        });
      } else {
        commandAlert({
          type: "error",
          title: "Error",
          text: response.error || "Failed to set condition",
          icon: "error",
        });
      }
    } catch (error) {
      commandAlert({
        type: "error",
        title: "Error",
        text: error.message || "Network error",
        icon: "error",
      });
    }
  };





  function formatDecimal(value) {
    if (value == null) return "0";
    const strVal = value.toString();
    if (strVal.includes(".")) {
      const [intPart, decimalPart] = strVal.split(".");
      if (decimalPart.length > 4) {
        return parseFloat(value).toFixed(4);
      } else {
        return strVal;
      }
    }
    return strVal;
  }





  return (
    <div className="container-fluid px-3">
      {displayedGroups?.map((group, index) => {
        const actualIndex = cardPage * cardPageSize + index;
        const {
          _id: { symbol, signal_type },
          count,
          avg_buy_price,
          avg_sell_price,
          avg_buy_lot,
          avg_sell_lot,

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
        let priceColor = "#0d6efd";
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
            <Card.Header
              className="custom-header py-3 px-4 agp-header"

            >

              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 agp-header-row">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center flex-wrap mb-2 agp-header-symbol-row">
                    <h4 className="mb-0 fw-bold me-3 header-symbol agp-symbol-title">
                      <span className="">{symbol}</span>
                      <span
                        style={{
                          color: signalColor,
                          fontWeight: "bold",
                          marginLeft: "0.5rem",
                        }}
                      >{"("}
                        {signal_type.toUpperCase() === "BUY_SELL"
                          ? "BUY"
                          : "SELL"} {")"}
                      </span>
                    </h4>
                    <span className="">
                      Count: {count}
                    </span>
                  </div>
                  {/* Averages */}
                  <div className="averages-text mt-2">
                    <span className=" text-secondary me-2 agp-avg-label">
                      🎯 Averages:
                    </span>
                    <div className="d-flex flex-wrap gap-3 averages-row mt-1">
                      <span className="agp-avg agp-avg-buy">
                        Buy Price:{" "}
                        <strong>{avg_buy_price?.toFixed(3) ?? "-"}</strong>
                      </span>
                      <span className="agp-avg agp-avg-sell">
                        Sell:{" "}
                        <strong>{avg_sell_price?.toFixed(3) ?? "-"}</strong>
                      </span>
                      <span className="agp-avg agp-avg-lot">
                        Buy Lot: <strong>{formatDecimal(avg_buy_lot)}</strong>
                      </span>
                      <span className="agp-avg agp-avg-lot">
                        Sell Lot: <strong>{formatDecimal(avg_sell_lot)}</strong>
                      </span>

                    </div>
                  </div>
                  {/* Live Price */}
                  <div className="d-flex align-items-center gap-2 mt-3">
                    <span className="text-muted fs-6 fw-semibold agp-live-label">
                      <strong>Live Price:</strong>
                    </span>
                    <span
                      className={`agp-live-price ${priceColor === "green"
                        ? "agp-live-green"
                        : priceColor === "red"
                          ? "agp-live-red"
                          : ""
                        }`}
                    >
                      {livePrice ?? "-"}
                    </span>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="d-flex flex-row gap-2 agp-btn-row">
                  <button
                    className="btn btn-sm btn-outline-success animate-btn  agp-btn agp-btn-up"
                    onClick={() =>
                      SetConditions(
                        "up",
                        symbol,
                        livePrice,
                        avg_buy_price ? avg_buy_price : avg_sell_price
                      )
                    }
                  >
                    🔼 Up Side
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger animate-btn  agp-btn agp-btn-down"
                    onClick={() =>
                      SetConditions(
                        "down",
                        symbol,
                        livePrice,
                        avg_buy_price ? avg_buy_price : avg_sell_price
                      )
                    }
                  >
                    🔽 Down Side
                  </button>
                </div>
              </div>
            </Card.Header>
            <Accordion defaultActiveKey={null}>
              <Accordion.Item eventKey="0">
                <Accordion.Header>📂 View All Records</Accordion.Header>
                <Accordion.Body>
                  <div
                    className="table-responsive animated-table"
                    style={{
                      animation: "fadeInUp 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                  >
                    <table
                      className="table table-striped table-bordered table-sm align-middle text-center mb-0"
                      style={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                        background: "#fff",
                      }}
                    >
                      <thead
                        className=""
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 2,
                          background: "#f1f3f6",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                        }}
                      >
                        <tr>
                          <th>#</th>
                          <th>User Name</th>
                          <th>symbol</th>
                          <th>Buy Price</th>
                          <th>Sell Price</th>


                          <th>P/L</th>

                          <th>Buy Lot</th>
                          <th>Sell Lot</th>

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
                            <tr
                              key={idx}
                              className="table-row-animate"
                              style={{
                                transition: "background 0.2s, box-shadow 0.2s",
                                cursor: "pointer",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#f8fafd")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "")
                              }
                            >
                              <td>{currentPage * tablePageSize + idx + 1}</td>
                              <td>{item.userName}</td>
                              <td>{item.symbol}</td>
                              <td>
                                {item.buy_price ?? (
                                  <span
                                    className={` ${priceColor === "green"
                                      ? "agp-live-green"
                                      : priceColor === "red"
                                        ? "agp-live-red"
                                        : ""
                                      }`}
                                  >
                                    {livePrices[item.symbol?.toLowerCase()]}
                                  </span>
                                )}
                              </td>
                              <td>
                                {item.sell_price ?? (
                                  <span
                                    className={` ${priceColor === "green"
                                      ? "agp-live-green"
                                      : priceColor === "red"
                                        ? "agp-live-red"
                                        : ""
                                      }`}
                                  >
                                    {livePrices[item.symbol?.toLowerCase()]}
                                  </span>
                                )}
                              </td>
                              <td>
                                {signal_type === "buy_sell"
                                  ? (
                                    (livePrices[item.symbol?.toLowerCase()] -
                                      item.buy_price) *
                                    item.buy_lot
                                  ).toFixed(3)
                                  : (
                                    (item.sell_price -
                                      livePrices[
                                      item.symbol?.toLowerCase()
                                      ]) *
                                    item.sell_lot
                                  ).toFixed(3)}
                              </td>

                              <td>{item.buy_lot ?? "-"}</td>
                              <td>{item.sell_lot ?? "-"}</td>

                              <td>{item.Target_price ?? "-"}</td>
                              <td>{item.stoploss_price ?? "-"}</td>
                              <td>{item.Sl_price_percentage != null
                                ? (item.Sl_price_percentage < 50
                                  ? parseFloat(item.Sl_price_percentage).toFixed(4)
                                  : parseFloat(item.Sl_price_percentage).toFixed(2))
                                : "-"}</td>
                              <td>
                                {new Date(item.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Table Pagination */}
                  <div
                    className="d-flex justify-content-end align-items-center mt-3"
                    style={{
                      animation: "fadeIn 0.3s",
                      gap: "0.5rem",
                    }}
                  >
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      disabled={currentPage === 0}
                      style={{
                        transition: "all 0.2s",
                        opacity: currentPage === 0 ? 0.5 : 1,
                      }}
                      onClick={() =>
                        setPageStates((prev) => ({
                          ...prev,
                          [actualIndex]: currentPage - 1,
                        }))
                      }
                    >
                      ◀ Prev
                    </button>
                    <span style={{ fontWeight: 500 }}>
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-primary ms-2"
                      disabled={currentPage + 1 >= totalPages}
                      style={{
                        transition: "all 0.2s",
                        opacity: currentPage + 1 >= totalPages ? 0.5 : 1,
                      }}
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
                  {/* Animation keyframes */}
                  <style>
                    {`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeIn {
          0% { opacity: 0;}
          100% { opacity: 1;}
        }
        .table-row-animate {
          animation: fadeIn 0.3s;
        }
        `}
                  </style>
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
