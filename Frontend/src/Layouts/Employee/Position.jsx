import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { fDateTimesec } from "../../Utils/Date_format/datefromat";
import { Clienthistory } from "../../Services/Admin/Addmin";
import { Link } from "react-router-dom";
import { GetUsersName, switchOrderType } from "../../Services/Admin/Addmin";
import { ArrowLeftRight } from "lucide-react";
import { getUserFromToken } from "../../Utils/TokenVerify";
import socket from "../../Utils/socketClient";

const Tradehistory = () => {
  const TokenData = getUserFromToken();

  const user_id = TokenData?.user_id;

  console.log("TokenData", TokenData)

  const [data, setData] = useState([]);
  const [userName, setUserName] = useState();
  const [Userid, setUserId] = useState();
  const [search, setSearch] = useState("");
  const [livePrices, setLivePrices] = useState({});
  const [prevPrices, setPrevPrices] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");




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

  useEffect(() => {
    GetUserName();
  }, []);

  useEffect(() => {
    getuserallhistory();
  }, [Userid, search, statusFilter]);

  const columns1 = [
    { Header: "userName", accessor: "userName" },

    { Header: "Symbol", accessor: "symbol" },
    {
      Header: "Entry Price",
      accessor: "buy_price",
      Cell: ({ cell }) => {
        const buy_price = cell.row.buy_price;
        const signal_type = cell.row.signal_type;
        if (signal_type === "buy_sell") {
          return buy_price ? buy_price.toFixed(3) : "-";
        } else {
          return cell.row.sell_price ? cell.row.sell_price.toFixed(3) : "-";
        }
      },
    },
    {
      Header: "Exit Price",
      accessor: "sell_price",
      Cell: ({ cell }) => {
        const buy_price = cell.row.buy_price;
        const signal_type = cell.row.signal_type;
        if (signal_type === "sell_buy") {
          return buy_price
            ? buy_price.toFixed(3)
            : livePrices[cell.row.symbol.toLowerCase()] || "-";
        } else {
          return cell.row.sell_price
            ? cell.row.sell_price.toFixed(3)
            : livePrices[cell.row.symbol.toLowerCase()] || "-";
        }
      },
    },
    {
      Header: "P/L",
      accessor: "P/L",
      Cell: ({ cell }) => {
        const signal_type = cell.row.signal_type;
        const sellPrice = cell.row.sell_price;
        const buyPrice = cell.row.buy_price;
        const buyQty = cell.row.buy_qty;

        if (sellPrice && buyPrice && buyQty) {
          // if(signal_type === "buy_sell"){
          const profitLoss = (sellPrice - buyPrice) * buyQty;
          const formattedProfitLoss = profitLoss.toFixed(4);

          const color = profitLoss > 0 ? "green" : "red";

          return (
            <span style={{ color }}>
              {/* <DollarSign /> */}
              {formattedProfitLoss}
            </span>
          );
        } else if (signal_type === "buy_sell") {
          const livePrice = livePrices[cell.row.symbol?.toLowerCase()];
          if (livePrice) {
            const profitLoss = (livePrice - buyPrice) * cell.row.buy_qty;
            const formattedProfitLoss = profitLoss.toFixed(4);
            const color = profitLoss > 0 ? "green" : "red";
            return <span style={{ color }}>{formattedProfitLoss}</span>;
          }
        } else if (signal_type === "sell_buy") {
          const livePrice = livePrices[cell.row.symbol?.toLowerCase()];
          if (livePrice) {
            const profitLoss =
              (cell.row.sell_price - livePrice) * cell.row.sell_lot;
            const formattedProfitLoss = profitLoss.toFixed(4);
            const color = profitLoss > 0 ? "green" : "red";
            return <span style={{ color }}>{formattedProfitLoss}</span>;
          }
        }

        return "-";
      },
    },
    {
      Header: "Entry lot",
      accessor: "buy_lot",
      Cell: ({ cell }) => {
        const signal_type = cell.row.signal_type;
        if (signal_type === "buy_sell") {
          return cell.row.buy_lot ? cell.row.buy_lot : "-";
        } else {
          return cell.row.sell_lot ? cell.row.sell_lot : "-";
        }
      },
    },
    {
      Header: "Exit lot",
      accessor: "sell_lot",
      Cell: ({ cell }) => {
        const signal_type = cell.row.signal_type;
        if (signal_type === "sell_buy") {
          return cell.row.buy_lot ? cell.row.buy_lot : "-";
        } else {
          return cell.row.sell_lot ? cell.row.sell_lot : "-";
        }
      },
    },

    {
      Header: "Signal Type",
      accessor: "signal_type",
      Cell: ({ cell }) => {
        const signal_type = cell.row.signal_type;

        // return signal_type ? signal_type == "buy_sell" ? "BUY" :"SELL" : "-";
        return (
          <>
            {signal_type === "buy_sell" ? (
              <span style={{ color: "green" }}> BUY</span>
            ) : signal_type === "sell_buy" ? (
              <span style={{ color: "red" }}> SELL</span>
            ) : (
              <span style={{ color: "blue" }}> {signal_type}</span>
            )}
          </>
        );
      },
    },

    {
      Header: "Entry Time",
      accessor: "buy_time",
      Cell: ({ cell }) => {
        const signal_type = cell.row.signal_type;

        if (signal_type === "buy_sell") {
          return cell.row.buy_time ? fDateTimesec(cell.row.buy_time) : "-";
        } else {
          return cell.row.sell_time ? fDateTimesec(cell.row.sell_time) : "-";
        }
      },
    },
    {
      Header: "Exit time",
      accessor: "sell_time",
      Cell: ({ cell }) => {
        const signal_type = cell.row.signal_type;

        if (signal_type === "sell_buy") {
          return cell.row.buy_time ? fDateTimesec(cell.row.buy_time) : "-";
        } else {
          return cell.row.sell_time ? fDateTimesec(cell.row.sell_time) : "-";
        }
      },
    },

    {
      Header: "switch",
      accessor: "switch",
      Cell: ({ cell }) => {
        return (
          <span onClick={(e) => ChangeTradeType(cell.row)}>
            <ArrowLeftRight />
          </span>
        );
      },
    },
  ];

  // Function to get user history
  const getuserallhistory = async () => {
    try {
      const data = { userid: Userid, adminid: TokenData?.parent_id };
      const response = await Clienthistory(data);
      let filteredData = response.data;

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter((item) => {
          return (
            (item?.userName && item.userName.toLowerCase().includes(searchLower)) ||
            (item?.symbol && item.symbol.toLowerCase().includes(searchLower)) ||
            (item?.buy_price &&
              item.buy_price.toString().toLowerCase().includes(searchLower)) ||
            (item?.sell_price &&
              item.sell_price.toString().toLowerCase().includes(searchLower))
          );
        });
      }

      if (statusFilter === "open") {
        filteredData = filteredData.filter((item) => item.sell_price === null || item.sell_price === undefined);
      } else if (statusFilter === "close") {
        filteredData = filteredData.filter((item) => item.sell_price !== null && item.sell_price !== undefined);
      }


      setData(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  const GetUserName = async () => {
    try {
      const admin_id = TokenData?.parent_id;
      const response = await GetUsersName({ admin_id });
      if (response.status) {
        setUserName(response.data);
      }
    } catch (error) { }
  };

  const calculateTotalProfitLoss = () => {
    return data
      .reduce((total, row) => {
        const sellPrice = row.sell_price;
        const buyPrice = row.buy_price;
        const buyQty = row.buy_qty;
        const signal_type = row.signal_type;
        if (sellPrice && buyPrice && buyQty) {
          return total + (sellPrice - buyPrice) * buyQty;
        }
        return total;
      }, 0)
      .toFixed(4);
  };

  const totalProfitLoss = calculateTotalProfitLoss();

  const ChangeTradeType = async (row) => {
    const data = { id: row._id };
    const response = await switchOrderType(data);

    if (response.status) {
      getuserallhistory();
    } else {
      alert("Error");
    }
  };

  return (
    <>
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card transaction-table">
                <div className="card-header border-0 flex-wrap pb-0">
                  <div className="mb-4">
                    <h4 className="card-title">Trade History</h4>
                  </div>
                  {/* <Link
                    to="/admin/users"
                    className="float-end mb-4 btn btn-primary"
                  >
                    <i className="fa-solid fa-arrow-left"></i> Back
                  </Link> */}
                </div>
                <div className="card-body p-0">
                  <div className="tab-content" id="myTabContent1">
                    <div
                      className="tab-pane fade show active"
                      id="Week"
                      role="tabpanel"
                      aria-labelledby="Week-tab"
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "20px",
                          alignItems: "center",
                          padding: "1rem",
                        }}
                      >
                        {/* Search Input */}
                        <div style={{ flex: 1 }}>
                          <label
                            style={{
                              fontWeight: "bold",
                              fontSize: "16px",
                              marginRight: "0.5rem",
                            }}
                          >
                            🔍 Search:
                          </label>
                          <input
                            type="text"
                            placeholder="Search..."
                            className="form-control"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                              backgroundColor: "#f8f9fa",
                            }}
                            value={search}
                            autoFocus
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>

                        {/* User Dropdown */}
                        <div style={{ flex: 1 }}>
                          <label
                            style={{
                              fontWeight: "bold",
                              fontSize: "16px",
                              marginRight: "0.5rem",
                            }}
                          >
                            👤 Users:
                          </label>
                          <select
                            className="form-select"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                              backgroundColor: "#f8f9fa",
                              color: "#333",
                            }}
                            onChange={(e) => setUserId(e.target.value)}
                            defaultValue=""
                          >
                            <option value="all">Select a user</option>
                            {userName &&
                              userName.map((username) => (
                                <option key={username._id} value={username._id}>
                                  {username.UserName}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div style={{ flex: 1 }}>
                          <label
                            style={{
                              fontWeight: "bold",
                              fontSize: "16px",
                              marginRight: "0.5rem",
                            }}
                          >
                            👤 Status:
                          </label>
                          <select
                            className="form-select"
                            style={{
                              width: "200px",
                              padding: "8px",
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                              backgroundColor: "#f8f9fa",
                            }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <option value="all">All</option>
                            <option value="open">Open Positions</option>
                            <option value="close">Closed Positions</option>
                          </select>
                        </div>


                      </div>

                      <h3 className="ms-3">
                        Total Profit/Loss:{" "}
                        <span
                          style={{
                            color: totalProfitLoss > 0 ? "green" : "red",
                            fontSize: "1.2rem",
                          }}
                        >
                          {" "}
                          {/* <DollarSign /> */}
                          {totalProfitLoss}
                        </span>
                      </h3>
                      <Table columns={columns1} data={data && data} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tradehistory;
