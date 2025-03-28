import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { fDateTime, fDateTimesec } from "../../Utils/Date_format/datefromat";
import { useParams } from "react-router-dom";
import { Clienthistory } from "../../Services/Admin/Addmin";
import { DollarSign } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Tradehistory = () => {
  const { id } = useParams();
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;
  const Role = userDetails?.Role;

  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Define columns for the table
  const columns = [
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
        const sellPrice = cell.row.sell_price;
        const buyPrice = cell.row.buy_price;
        const buyQty = cell.row.buy_qty;

        if (sellPrice && buyPrice && buyQty) {
          const profitLoss = (sellPrice - buyPrice) * buyQty;
          const formattedProfitLoss = profitLoss.toFixed(4);

          const color = profitLoss > 0 ? "green" : "red";

          return (
            <span style={{ color }}>
              <DollarSign /> {formattedProfitLoss}
            </span>
          );
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
        return buyTime ? fDateTime(buyTime) : "-";
      },
    },
    {
      Header: "Sell time",
      accessor: "sell_time",
      Cell: ({ cell }) => {
        const sell_time = cell.row.sell_time;
        return sell_time ? fDateTime(sell_time) : "-";
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
      const data = { userid: id };
      const response = await Clienthistory(data);
      setData(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getuserallhistory();
  }, [id]);

  // Calculate total profit/loss
  const calculateTotalProfitLoss = () => {
    return data
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
                    className="float-end mb-4 btn btn-primary">
                    Back
                  </Link>
                </div>
                <div className="card-body p-0">
                  <div className="tab-content" id="myTabContent1">
                    <div
                      className="tab-pane fade show active"
                      id="Week"
                      role="tabpanel"
                      aria-labelledby="Week-tab">
                      <div className="mb-3 ms-4">
                        Search :{" "}
                        <input
                          className="ml-2 input-search form-control"
                          defaultValue=""
                          style={{ width: "20%" }}
                        />
                      </div>
                      <h5>
                        Total Profit/Loss:{" "}
                        <span
                          style={{
                            color: totalProfitLoss > 0 ? "green" : "red",
                          }}>
                          {" "}
                          <DollarSign />
                          {totalProfitLoss}
                        </span>
                      </h5>
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
                        }}>
                        Rows per page:{" "}
                        <select
                          className="form-select ml-2"
                          value={rowsPerPage}
                          onChange={(e) =>
                            setRowsPerPage(Number(e.target.value))
                          }
                          style={{ width: "auto", marginLeft: "10px" }}>
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

export default Tradehistory;
