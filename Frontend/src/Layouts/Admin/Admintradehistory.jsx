import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { fDateTime, fDateTimesec } from "../../Utils/Date_format/datefromat";
import { useParams } from "react-router-dom";
import { Clienthistory } from "../../Services/Admin/Addmin";
import { DollarSign } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { GetUsersName, switchOrderType } from "../../Services/Admin/Addmin";
import { ArrowLeftRight } from "lucide-react";

const Tradehistory = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;
  const Role = userDetails?.Role;
  const [data, setData] = useState([]);
  const [userName, setUserName] = useState();
  const [Userid, setUserId] = useState();

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
    { Header: "Symbol", accessor: "symbol" },
    {
      Header: "Buy Price",
      accessor: "buy_price",
      Cell: ({ cell }) => {
        const buy_price = cell.row.buy_price;
        return buy_price ? buy_price : "-";
      },
    },
    {
      Header: "Sell Price",
      accessor: "sell_price",
      Cell: ({ cell }) => {
        const sell_price = cell.row.sell_price;
        return sell_price ? sell_price : "-";
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
        // }else{
        //   const profitLoss = (buyPrice - sellPrice) * buyQty;
        //   const formattedProfitLoss = profitLoss.toFixed(4);

        //   const color = profitLoss > 0 ? "green" : "red";

        //   return (
        //     <span style={{ color }}>
        //       <DollarSign /> {formattedProfitLoss}
        //     </span>
        //   );
        // }
        }

        return "N/A";
      },
    },
    {
      Header: "Buy lot",
      accessor: "buy_lot",
      Cell: ({ cell }) => {
        const buy_lot = cell.row.buy_lot;
        return buy_lot ? buy_lot : "-";
      },
    },
    {
      Header: "Sell lot",
      accessor: "sell_lot",
      Cell: ({ cell }) => {
        const sell_lot = cell.row.sell_lot;
        return sell_lot ? sell_lot : "-";
      },
    },
    {
      Header: "Buy qty",
      accessor: "buy_qty",
      Cell: ({ cell }) => {
        const buy_qty = cell.row.buy_qty;
        return buy_qty ? buy_qty : "-";
      },
    },
    {
      Header: "Sell qty",
      accessor: "sell_qty",
      Cell: ({ cell }) => {
        const sell_qty = cell.row.sell_qty;
        return sell_qty ? sell_qty : "-";
      },
    },
    {
      Header: "Buy Time",
      accessor: "buy_time",
      Cell: ({ cell }) => {
        const buyTime = cell.row.buy_time;
        return buyTime ? fDateTimesec(buyTime) : "-";
      },
    },
    {
      Header: "Sell time",
      accessor: "sell_time",
      Cell: ({ cell }) => {
        const sell_time = cell.row.sell_time;
        return sell_time ? fDateTimesec(sell_time) : "-";
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
  const getuserallhistory = async () => {
    try {
      const data = { userid: Userid };
      const response = await Clienthistory(data);
      setData(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const GetUserName = async () => {
    try {
      const response = await GetUsersName();
      if (response.status) {
        setUserName(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    GetUserName();
  }, []);

  useEffect(() => {
    getuserallhistory();
  }, [Userid]);

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
                    <h4 className="card-title">Trade History 1</h4>
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
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                              backgroundColor: "#f8f9fa",
                            }}
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
                            Users:
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
                      </div>

                      <h5>
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
                      </h5>
                      <Table columns={columns} data={data && data} />
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
