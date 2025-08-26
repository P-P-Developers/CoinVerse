import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";
import { Clienthistory } from "../../../Services/Admin/Addmin";
import { Link } from "react-router-dom";
import { GetUsersName, switchOrderType } from "../../../Services/Admin/Addmin";
import { ArrowLeftRight } from "lucide-react";
import { getUserFromToken } from "../../../Utils/TokenVerify";
import { getAllClient } from "../../../Services/Superadmin/Superadmin";

const Tradehistory = () => {
  const TokenData = getUserFromToken();
  const user_id = TokenData?.user_id;

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userName, setUserName] = useState();
  const [Userid, setUserId] = useState();
  const [search, setSearch] = useState("");
  const [client, setClient] = useState({});
  const [tradeFilter, setTradeFilter] = useState("all"); // New filter state

  useEffect(() => {
    GetUserName();
    getallclient();
  }, []);

  useEffect(() => {
    getuserallhistory();
  }, [Userid, search, client]);

  // Filter data when tradeFilter or data changes
  useEffect(() => {
    filterData();
  }, [data, tradeFilter]);

  const getallclient = async () => {
    try {
      const data = { userid: user_id };
      const response = await getAllClient(data);
      if (response.status) {
        setClient(response.data);
      }
    } catch (error) { }
  };

  const columns1 = [
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
          return buy_price ? buy_price.toFixed(3) : "-";
        } else {
          return cell.row.sell_price ? cell.row.sell_price.toFixed(3) : "-";
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
    // {
    //   Header: "Status",
    //   accessor: "status",
    //   Cell: ({ cell }) => {
    //     const isOpen = isTradeOpen(cell.row);
    //     return (
    //       <span
    //         style={{
    //           color: isOpen ? "orange" : "green",
    //           fontWeight: "bold",
    //           padding: "4px 8px",
    //           borderRadius: "4px",
    //           backgroundColor: isOpen ? "#fff3cd" : "#d4edda",
    //           border: `1px solid ${isOpen ? "#ffeaa7" : "#c3e6cb"}`,
    //         }}
    //       >
    //         {isOpen ? "OPEN" : "CLOSED"}
    //       </span>
    //     );
    //   },
    // },
  ];

  // Function to check if a trade is open
  const isTradeOpen = (row) => {
    const hasBuyLot = row.buy_lot && row.buy_lot > 0;
    const hasSellLot = row.sell_lot && row.sell_lot > 0;

    // Trade is open if it has either buy_lot or sell_lot but not both completed
    // Or if it doesn't have both buy_price and sell_price
    return (hasBuyLot && !hasSellLot) || (!hasBuyLot && hasSellLot) || !row.sell_price || !row.buy_price;
  };

  // Function to filter data based on open/close status
  const filterData = () => {
    let filtered = data;

    // Apply search filter first
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((item) => {
        return (
          (item.symbol && item.symbol.toLowerCase().includes(searchLower)) ||
          (item.buy_price && item.buy_price.toString().toLowerCase().includes(searchLower)) ||
          (item.sell_price && item.sell_price.toString().toLowerCase().includes(searchLower))
        );
      });
    }

    // Apply open/close filter
    if (tradeFilter === "open") {
      filtered = filtered.filter((item) => isTradeOpen(item));
    } else if (tradeFilter === "closed") {
      filtered = filtered.filter((item) => !isTradeOpen(item));
    }

    setFilteredData(filtered);
  };

  // Function to get user history
  const getuserallhistory = async () => {
    try {
      const data = { userid: Userid, adminid: client?.parent_id };
      const response = await Clienthistory(data);
      setData(response.data || []);
    } catch (error) {
      setData([]);
    }
  };

  const GetUserName = async () => {
    try {
      const admin_id = client?.parent_id;
      const response = await GetUsersName({ admin_id });
      if (response.status) {
        setUserName(response.data);
      }
    } catch (error) { }
  };

  const calculateTotalProfitLoss = () => {
    return filteredData
      .reduce((total, row) => {
        const sellPrice = row.sell_price;
        const buyPrice = row.buy_price;
        const buyQty = row.buy_qty;
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
                  <Link
                    to="/admin/users"
                    className="float-end mb-4 btn btn-primary"
                  >
                    <i className="fa-solid fa-arrow-left"></i> Back
                  </Link>
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
                          flexWrap: "wrap",
                        }}
                      >
                        {/* Search Input */}
                        <div style={{ flex: 1, minWidth: "200px" }}>
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
                        <div style={{ flex: 1, minWidth: "200px" }}>
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

                        {/* Open/Close Filter */}
                        <div style={{ flex: 1, minWidth: "200px" }}>
                          <label
                            style={{
                              fontWeight: "bold",
                              fontSize: "16px",
                              marginRight: "0.5rem",
                            }}
                          >
                            📊 Status:
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
                            value={tradeFilter}
                            onChange={(e) => setTradeFilter(e.target.value)}
                          >
                            <option value="all">All Trades</option>
                            <option value="open">Open Trades</option>
                            <option value="closed">Closed Trades</option>
                          </select>
                        </div>
                      </div>

                      {/* Trade Statistics */}
                      {/* <div style={{ padding: "0 1rem", marginBottom: "1rem" }}>
                        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
                          <h5>
                            Total Trades: <span style={{ color: "#007bff" }}>{filteredData.length}</span>
                          </h5>
                          <h5>
                            Open Trades: <span style={{ color: "orange" }}>
                              {filteredData.filter(row => isTradeOpen(row)).length}
                            </span>
                          </h5>
                          <h5>
                            Closed Trades: <span style={{ color: "green" }}>
                              {filteredData.filter(row => !isTradeOpen(row)).length}
                            </span>
                          </h5>
                        </div>
                      </div> */}

                      <h3 className="ms-3">
                        Total Profit/Loss:{" "}
                        <span
                          style={{
                            color: totalProfitLoss > 0 ? "green" : "red",
                            fontSize: "1.2rem",
                          }}
                        >
                          {(Number(totalProfitLoss) || 0).toFixed(2)}
                        </span>
                      </h3>
                      <Table columns={columns1} data={filteredData} />
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