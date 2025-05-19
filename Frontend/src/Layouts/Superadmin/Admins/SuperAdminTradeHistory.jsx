import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";
import { gettradehistory } from "../../../Services/Admin/Addmin";
import { Link } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";
import {
  getAdminName,
  switchOrderType,
} from "../../../Services/Superadmin/Superadmin";

const SuperAdminTradeHistory = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [data, setData] = useState([]);
  const [userName, setUserName] = useState();
  const [Userid, setUserId] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [Search, setSearch] = useState("");
  const [userNameList, setUserNameList] = useState([]);
  const [userNamed, setUserNamed] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    GetUserName();
  }, []);

  useEffect(() => {
    getuserallhistory();
  }, [Userid, Search, userNamed, toDate, fromDate]);

  const getuserallhistory = async () => {
    try {
      if (Userid === undefined || Userid === null) {
        return;
      }

      const data = { adminid: Userid._id, toDate: toDate, fromDate: fromDate };
      const response = await gettradehistory(data);
      let UserNameListData = response.data.map((item) => {
        return item.userName;
      });

      setUserNameList([...new Set(UserNameListData)]);

      let filteredData = response.data;
      if (Search || userNamed) {
        filteredData = response.data.filter((item) => {
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
    } catch (error) {
    }
  };

  // Define columns for the table
  const columns = [
    { Header: "UserName", accessor: "userName" },

    { Header: "Symbol", accessor: "symbol" },
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
          return buy_price ? buy_price.toFixed(4) : "-";
        } else {
          return cell.row.sell_price ? cell.row.sell_price.toFixed(4) : "-";
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

  const GetUserName = async () => {
    try {
      const admin_id = user_id;
      const response = await getAdminName();
      if (response.status) {
        setUserName(response.data);
        setUserId(response.data[0]);
      }
    } catch (error) {
    }
  };

  // Calculate total profit/loss
  const calculateTotalProfitLoss = () => {
    return data
      .reduce((total, row) => {
        const sellPrice = row.sell_price;
        const buyPrice = row.buy_price;
        const buyQty = row.buy_qty;
        const signal_type = row.signal_type;
        if (sellPrice && buyPrice && buyQty) {
          return total + (sellPrice - buyPrice) * buyQty;
          // if(signal_type === "buy_sell"){

          // }else{
          //   return total + (buyPrice - sellPrice) * buyQty;
          // }
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
                <div className="card-header border-0 flex-wrap pb-0 d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">📊 Trade History</h4>
                  <Link to="/admin/users" className="btn btn-primary">
                    <i className="fa-solid fa-arrow-left me-2"></i>Back
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
                      <div className="row gx-3 gy-2 p-3">
                        <div className="col-md-4">
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

                        <div className="col-md-4">
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

                        <div className="col-md-4">
                          <label className="fw-bold mb-1">🔍 Search</label>
                          <input
                            type="text"
                            placeholder="Search..."
                            className="form-control"
                            onChange={(e) => setSearch(e.target.value)}
                            value={Search}
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
                      </div>

                      <div className="px-3 mb-3">
                        <h3>
                          💰 Total Profit/Loss:{" "}
                          <span
                            style={{
                              color: totalProfitLoss > 0 ? "green" : "red",
                            }}
                          >
                            {totalProfitLoss}
                          </span>
                        </h3>
                      </div>

                      <div className="px-3">
                        <Table
                          columns={columns}
                          data={data}
                          rowsPerPage={rowsPerPage}
                        />

                        <div className="d-flex align-items-center mt-3">
                          <span className="me-2">Rows per page:</span>
                          <select
                            className="form-select w-auto"
                            value={rowsPerPage}
                            onChange={(e) =>
                              setRowsPerPage(Number(e.target.value))
                            }
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
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
    </>
  );
};

export default SuperAdminTradeHistory;
