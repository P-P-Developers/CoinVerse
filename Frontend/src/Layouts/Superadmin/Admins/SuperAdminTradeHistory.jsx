import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";
import { gettradehistory } from "../../../Services/Admin/Addmin";
import { Link } from "react-router-dom";
import { ArrowLeftRight, X } from "lucide-react";
import {
  getAdminName,
  switchOrderType,
} from "../../../Services/Superadmin/Superadmin";
import socket from "../../../Utils/socketClient";
import { getAllswitchOrderTypedata } from "../../../Services/Admin/Addmin";
import Swal from "sweetalert2";

const SuperAdminTradeHistory = () => {

  const [data, setData] = useState([]);
  const [userName, setUserName] = useState();
  const [Userid, setUserId] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [Search, setSearch] = useState("");
  const [userNameList, setUserNameList] = useState([]);
  const [userNamed, setUserNamed] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [livePrices, setLivePrices] = useState({});
  const [prevPrices, setPrevPrices] = useState({});
  const [logsmodel, setLogsmodel] = useState(false);
  const [logsdata, setLogsdata] = useState([])
  const [tradeStatus, setTradeStatus] = useState(""); // New state for open/close filter


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
  }, [Userid, Search, userNamed, toDate, fromDate, tradeStatus]);



  const getuserallhistory = async () => {
    try {
      if (Userid === undefined || Userid === null) {
        return;
      }

      const data = { adminid: Userid._id, toDate: toDate, fromDate: fromDate, status: tradeStatus };
      const response = await gettradehistory(data);
      let UserNameListData = response.data.map((item) => {
        return item.userName;
      });

      setUserNameList([...new Set(UserNameListData)]);

      let filteredData = response.data;

      if (Search || userNamed) {
        filteredData = filteredData.filter((item) => {
          const userNameMatch = Search
            ? item.userName.toLowerCase().includes(Search.toLowerCase())
            : true;
          const symbolMatch = Search
            ? item.symbol.toLowerCase().includes(Search.toLowerCase())
            : true;
          const userNameListMatch = userNamed
            ? item.userName.toLowerCase() === userNamed.toLowerCase()
            : true;

          return (userNameMatch || symbolMatch) && userNameListMatch;
        });
      }
      setData(filteredData);
    } catch (error) { }
  };


  const getTradeStatus = (row) => {
    if (row.buy_price && row.sell_price) {
      return "Closed";
    } else if (row.buy_price || row.sell_price) {
      return "Open";
    }
    return "Unknown";
  };

  const columns = [
    { Header: "UserName", accessor: "userName" },
    { Header: "Symbol", accessor: "symbol" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ cell }) => {
        const status = getTradeStatus(cell.row);
        return (
          <span
            style={{
              color: status === "Open" ? "green" : status === "Closed" ? "#a72828ff" : "#6c757d",
              fontWeight: "bold",
              padding: "2px 8px",
              borderRadius: "12px",
              backgroundColor: status === "Open" ? "#fff3cd" : status === "Closed" ? "#d4edda" : "#f8f9fa",
              fontSize: "12px"
            }}
          >
            {status === "Open" ? "🟢OPEN" : status === "Closed" ? "🟡CLOSED" : "❓ UNKNOWN"}
          </span>
        );
      },
    },
    {
      Header: "Entry Price",
      accessor: "buy_price",
      Cell: ({ cell }) => {
        const buy_price = cell.row.buy_price;
        const signal_type = cell.row.signal_type;
        if (signal_type === "buy_sell") {
          return buy_price ? buy_price.toFixed(4) : "-";
        } else {
          return cell.row.sell_price ? cell.row.sell_price.toFixed(4) : "-";
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
          return buy_price ? buy_price.toFixed(4) : livePrices[
            cell.row.symbol?.toLowerCase()
          ];
        } else {
          return cell.row.sell_price ? cell.row.sell_price.toFixed(4) : livePrices[
            cell.row.symbol?.toLowerCase()
          ];
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

          const profitLoss = (sellPrice - buyPrice) * buyQty;
          const formattedProfitLoss = profitLoss.toFixed(4);

          const color = profitLoss > 0 ? "green" : "red";

          return (
            <span style={{ color }}>

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
            const profitLoss = (cell.row.sell_price - livePrice) * cell.row.sell_lot;
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


  const columns2 = [
    { Header: "Admin Name", accessor: "AdminName" },
    { Header: "UserName", accessor: "UserName" },
    { Header: "Symbol", accessor: "Symbol" },
    { Header: "Type", accessor: "type" },
    {
      Header: "Message", accessor: "message",
      Cell: ({ cell }) => {
        return cell.row.message === "Order type switched to sell_buy" ? "Order type switched SELL to BUY" : "Order type switched BUY to SELL"
      }
    },
    {
      Header: "UpdatedAt",
      accessor: "updatedAt",
      Cell: ({ cell }) => {
        return fDateTimesec(cell.value);
      },
    },
  ];

  const GetUserName = async () => {
    try {
      const response = await getAdminName();
      if (response.status) {
        setUserName(response.data);
        setUserId(response.data[0]);
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
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to change trade type?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const data = { id: row._id };
        const response = await switchOrderType(data);

        if (response.status) {
          Swal.fire("Success!", "Trade type changed successfully.", "success");
          getuserallhistory();
        } else {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  const fetchChangeTradeType = async (row) => {
    const response = await getAllswitchOrderTypedata();
    if (response.status) {
      setLogsdata(response.data)
    } else {
      alert("Error");
    }
  };

  useEffect(() => {
    if (logsmodel) {
      fetchChangeTradeType()
    }
  }, [logsmodel])

  return (
    <>
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card transaction-table">
                <div className="card-header border-0 flex-wrap pb-0 d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">📊 Trade History</h4>
                  <div className="d-flex align-items-center">
                    <Link to="/admin/users" className="btn btn-primary me-2">
                      <i className="fa-solid fa-arrow-left me-2"></i>Back
                    </Link>
                    <div
                      onClick={() => setLogsmodel(true)}
                      className="btn btn-primary"
                      style={{ cursor: "pointer" }}
                    >
                      Logs
                    </div>
                  </div>
                </div>

                <div className="card-body p-0">
                  <div className="tab-content" id="myTabContent1">
                    <div
                      className="tab-pane fade show active"
                      id="Week"
                      role="tabpanel"
                      aria-labelledby="Week-tab"
                    >
                      <div className="row gx-3 gy-2 p-3">
                        <div className="col-md-3">
                          <label className="fw-bold mb-1">🛡️ Admin</label>
                          <select
                            className="form-select"
                            onChange={(e) => {
                              const selectedUser = userName.find(
                                (u) => u._id === e.target.value
                              );
                              setUserId(selectedUser);
                            }}
                            value={Userid?._id || ""}
                          >
                            <option value="">Select a user</option>
                            {userName &&
                              userName.map((username) => (
                                <option key={username._id} value={username._id}>
                                  {username.UserName}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="fw-bold mb-1">👤 User</label>
                          <select
                            className="form-select"
                            onChange={(e) => setUserNamed(e.target.value)}
                            value={userNamed}
                          >
                            <option value="">Select a user</option>
                            {userNameList &&
                              userNameList.map((username, index) => (
                                <option key={index} value={username}>
                                  {username}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="fw-bold mb-1">📈 Trade Status</label>
                          <select
                            className="form-select"
                            onChange={(e) => setTradeStatus(e.target.value)}
                            value={tradeStatus}
                          >
                            <option value="">All Trades</option>
                            <option value="open">🟢Open Trades</option>
                            <option value="close">🟡Closed Trades</option>
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="fw-bold mb-1">🔍 Search</label>
                          <input
                            type="text"
                            placeholder="Search..."
                            className="form-control"
                            onChange={(e) => setSearch(e.target.value)}
                            value={Search}
                          />
                        </div>

                        <div className="col-md-2">
                          <label className="fw-bold mb-1">📅 From Date</label>
                          <input
                            type="date"
                            className="form-control"
                            onChange={(e) => setFromDate(e.target.value)}
                            value={fromDate}
                          />
                        </div>

                        <div className="col-md-2">
                          <label className="fw-bold mb-1">📅 To Date</label>
                          <input
                            type="date"
                            className="form-control"
                            onChange={(e) => setToDate(e.target.value)}
                            value={toDate}
                          />
                        </div>

                        <div className="col-md-3 d-flex align-items-end">
                          <button
                            className="btn btn-outline-secondary w-100"
                            onClick={getuserallhistory}
                          >
                            <i className="fa-solid fa-arrows-rotate"></i>{" "}
                            Refresh
                          </button>
                        </div>
                        <div className="col-md-5 d-flex align-items-end">
                          <h3>
                            💰 Total Profit/Loss:{" "}
                            <span
                              style={{
                                color: totalProfitLoss > 0 ? "green" : "red",
                              }}
                            >
                              {(Number(totalProfitLoss) || 0).toFixed(2)}
                            </span>
                          </h3>
                        </div>
                      </div>

                      <div className="px-3">
                        <Table
                          columns={columns}
                          data={data}
                          rowsPerPage={rowsPerPage}
                        />

                        <div
                          className="d-flex align-items-center"
                          style={{
                            marginBottom: "20px",
                            marginLeft: "20px",
                            marginTop: "-48px",
                          }}
                        >
                          Rows per page:{" "}
                          <select
                            className="form-select ml-2"
                            value={rowsPerPage}
                            onChange={(e) =>
                              setRowsPerPage(Number(e.target.value))
                            }
                            style={{ width: "auto", marginLeft: "10px" }}
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={50}>100</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {logsmodel && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content shadow-lg rounded-3">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title text-white">📋 System Logs</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setLogsmodel(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <Table columns={columns2} data={logsdata} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuperAdminTradeHistory;