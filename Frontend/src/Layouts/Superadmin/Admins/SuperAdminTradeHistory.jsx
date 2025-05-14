import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";
import { Clienthistory } from "../../../Services/Admin/Addmin";
import { DollarSign } from "lucide-react";
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

  useEffect(() => {
    GetUserName();
  }, []);

  useEffect(() => {
    getuserallhistory();
  }, [Userid, Search, userNamed]);

  const getuserallhistory = async () => {
    try {
      const data = { adminid: Userid };
      const response = await Clienthistory(data);
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
      console.log("error", error);
    }
  };

  // Define columns for the table
  const columns = [
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

    { Header: "UserName", accessor: "userName" },

    { Header: "Symbol", accessor: "symbol" },
    {
      Header: "Entry Price",
      accessor: "buy_price",
      Cell: ({ cell }) => {
        const buy_price = cell.row.buy_price;
        const signal_type = cell.row.signal_type;
        if (signal_type === "buy_sell") {
          return buy_price ? buy_price : "-";
        } else {
          return cell.row.sell_price ? cell.row.sell_price : "-";
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
          return buy_price ? buy_price : "-";
        } else {
          return cell.row.sell_price ? cell.row.sell_price : "-";
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
              <DollarSign /> {formattedProfitLoss}
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
      Header: "Entry qty",
      accessor: "buy_qty",
      Cell: ({ cell }) => {
        const signal_type = cell.row.signal_type;
        if (signal_type === "buy_sell") {
          return cell.row.buy_qty ? cell.row.buy_qty : "-";
        } else {
          return cell.row.sell_qty ? cell.row.sell_qty : "-";
        }
      },
    },
    {
      Header: "Exit qty",
      accessor: "sell_qty",
      Cell: ({ cell }) => {
        const signal_type = cell.row.signal_type;
        if (signal_type === "sell_buy") {
          return cell.row.buy_qty ? cell.row.buy_qty : "-";
        } else {
          return cell.row.sell_qty ? cell.row.sell_qty : "-";
        }
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
      Header: "Create Date",
      accessor: "createdAt",
      Cell: ({ cell }) => {
        return fDateTimesec(cell.value);
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
      }
    } catch (error) {
      console.log("error", error);
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
                <div className="card-header border-0 flex-wrap pb-0">
                  <div className="mb-4">
                    <h4 className="card-title">Trade History </h4>
                  </div>
                  <Link
                    to="/admin/users"
                    className="float-end mb-4 btn btn-primary"
                  >
                    Back
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
                            Search:
                          </label>
                          <input
                            type="text"
                            placeholder="Search..."
                            className="form-control"
                            onChange={(e) => setSearch(e.target.value)}
                            value={Search}
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                              backgroundColor: "#f8f9fa",
                            }}
                          />
                        </div>

                        {/* Admin Dropdown */}
                        <div style={{ flex: 1 }}>
                          <label
                            style={{
                              fontWeight: "bold",
                              fontSize: "16px",
                              marginRight: "0.5rem",
                            }}
                          >
                            Admin:
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
                            <option value="">Select a user</option>
                            {userName &&
                              userName.map((username) => (
                                <option key={username._id} value={username._id}>
                                  {username.UserName}
                                </option>
                              ))}
                          </select>
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
                            User:
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
                            onChange={(e) => setUserNamed(e.target.value)}
                            value={userNamed}
                          >
                            <option value="">Select a user</option>
                            {userNameList &&
                              userNameList?.map((username, index) => (
                                <option key={index} value={username}>
                                  {username}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      <h3 className="ms-3">
                        Total Profit/Loss:{" "}
                        <span
                          style={{
                            color: totalProfitLoss > 0 ? "green" : "red",
                          }}
                        >
                          {" "}
                          <DollarSign />
                          {totalProfitLoss}
                        </span>
                      </h3>
                      {/* {Userid ? ( */}
                        <div>
                          {" "}
                          <Table
                            columns={columns}
                            data={data && data}
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
                              <option value={100}>100</option>
                            </select>
                          </div>
                        </div>
                      {/* ) : (
                        <div
                          className="alert alert-warning text-center text-black"
                          role="alert"
                        >
                          Please select an admin first.
                        </div>
                      )} */}
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
