import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { getpositionhistory } from "../../../Services/Admin/Addmin";
import { fDateTime, fDateTimesec } from "../../../Utils/Date_format/datefromat";
import { getUserFromToken } from "../../../Utils/TokenVerify";

const Position = () => {


  const TokenData = getUserFromToken();

  const user_id = TokenData?.user_id;
  const Role = TokenData?.Role;

  const [originalData, setOriginalData] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { Header: "userName", accessor: "username" },

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
          return cell.row.sell_time ? fDateTimesec(cell.row.buy_time) : "-";
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

  ];

  const getuserallhistory = async () => {
    try {
      const data = { userid: user_id, Role: Role };
      const response = await getpositionhistory(data);
      setData(response.data || []);
    } catch (error) { }
  };

  useEffect(() => {
    getuserallhistory();
  }, []);


  
  const filteredData = data.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.username?.toLowerCase().includes(searchLower) ||
      item.symbol?.toLowerCase().includes(searchLower) ||
      item.signal_type?.toLowerCase().includes(searchLower)
    );
  });



  return (
    <>
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card transaction-table">
                <div className="card-header border-0 flex-wrap pb-0">
                  <div className="mb-4">
                    <h4 className="card-title">Position</h4>
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
                      <div className="mb-3 ms-4">

                        <div className="d-flex align-items-center mb-3">

                          <div className="me-3">
                            <label className="form-label">🔍 Search:</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Search..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                            />
                          </div>

                        </div>
                      </div>

                      <Table
                        columns={columns}
                        data={filteredData}
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

export default Position;
