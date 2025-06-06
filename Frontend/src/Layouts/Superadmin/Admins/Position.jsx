import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import {
  getAdminName,
  getavailableposition,
} from "../../../Services/Superadmin/Superadmin";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";
import socket from "../../../Utils/socketClient";
import $ from "jquery";

const Position = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [adminNames, setAdminNames] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");

  useEffect(() => {
    socket.on("receive_data_forex", (data) => {
      if (data.data[1] && data.data[5]) {
        const formattedPrice = Number(data.data[5]).toFixed(3);
        $(`.exit-price-${data.data[1]}`).text(formattedPrice);
      }
    });
    return () => {
      socket.off("receive_data_forex");
    };
  }, []);

  useEffect(() => {
    getuserallhistory();
  }, [search, selectedAdmin, selectedUserName]);

  useEffect(() => {
    GetAdminUserName();
  }, []);

  const columns = [
    { Header: "User", accessor: "userName" },
    { Header: "Symbol", accessor: "symbol" },
    {
      Header: "Entry Price",
      accessor: "buy_price",
      Cell: ({ cell }) => {
        const original = cell?.row;
        if (!original) return <span>-</span>;
        const { buy_price, sell_price, signal_type } = original;
        return signal_type === "buy_sell"
          ? buy_price?.toFixed(3) ?? "-"
          : sell_price?.toFixed(3) ?? "-";
      },
    },
    {
      Header: "Exit Price",
      accessor: "sell_price",
      Cell: ({ cell }) => {
        const original = cell?.row;
        if (!original) return <span>-</span>;
        const { buy_price, sell_price, signal_type, token } = original;
        const rowId = token || "unknown";
        const price = signal_type === "sell_buy"
          ? buy_price?.toFixed(3) ?? "-"
          : sell_price?.toFixed(3) ?? "-";
        return <span className={`exit-price-${rowId}`}>{price}</span>;
      },
    },
    {
      Header: "P/L",
      accessor: "pl",
      Cell: ({ cell }) => {
        const original = cell?.row;

        if (!original) return <span>-</span>;
        const { buy_price,sell_price, buy_qty, token ,signal_type} = original;

      const price = signal_type === "buy_sell"
          ? buy_price?.toFixed(3) ?? "-"
          : sell_price?.toFixed(3) ?? "-";

        const getLivePrice = $(`.exit-price-${token}`).text();

        if (!getLivePrice) return <span>-</span>;

        const profitLoss = (parseFloat(getLivePrice) - price) * buy_qty;
        const formatted = profitLoss.toFixed(4);
        const color = profitLoss > 0 ? "green" : "red";
        return <span style={{ color }}>{formatted}</span>;
      },
    },
    {
      Header: "Entry Lot",
      accessor: "buy_lot",
      Cell: ({ cell }) => {
        const original = cell?.row;
        if (!original) return <span>-</span>;
        const { buy_lot, sell_lot, signal_type } = original;
        return signal_type === "buy_sell" ? buy_lot || "-" : sell_lot || "-";
      },
    },
    {
      Header: "Exit Lot",
      accessor: "sell_lot",
      Cell: ({ cell }) => {
        const original = cell?.row;
        if (!original) return <span>-</span>;
        const { buy_lot, sell_lot, signal_type } = original;
        return signal_type === "sell_buy" ? buy_lot || "-" : sell_lot || "-";
      },
    },
    {
      Header: "Signal Type",
      accessor: "signal_type",
      Cell: ({ cell }) => {
        const signal = cell?.row?.signal_type;
        if (!signal) return <span>-</span>;
        return (
          <span style={{ color: signal === "buy_sell" ? "green" : signal === "sell_buy" ? "red" : "blue" }}>
            {signal === "buy_sell" ? "BUY" : signal === "sell_buy" ? "SELL" : signal}
          </span>
        );
      },
    },
    {
      Header: "Entry Time",
      accessor: "buy_time",
      Cell: ({ cell }) => {
        const { buy_time, sell_time, signal_type } = cell?.row || {};
        return signal_type === "buy_sell"
          ? buy_time ? fDateTimesec(buy_time):"-" || "-"
          : sell_time ? fDateTimesec(sell_time):"-" || "-";
      },
    },
    {
      Header: "Exit Time",
      accessor: "sell_time",
      Cell: ({ cell }) => {
        const { buy_time, sell_time, signal_type } = cell?.row || {};
        return signal_type === "sell_buy"
          ? buy_time ? fDateTimesec(buy_time): "-" || "-"
          : sell_time ? fDateTimesec(sell_time) :"-" || "-";
      },
    },
  ];

  const getuserallhistory = async () => {
    try {
      const response = await getavailableposition({ adminid: selectedAdmin });
      const userNames = response.data.map((item) => item.userName);
      setSelectedUser([...new Set(userNames)]);

      const searchfilter = response.data?.filter((item) => {
        const matchesSearch = search === "" || (item.symbol?.toLowerCase().includes(search.toLowerCase()));
        const matchesUser = selectedUserName === "" || (item.userName?.toLowerCase().includes(selectedUserName.toLowerCase()));
        return matchesSearch && matchesUser;
      });

      setData(search || selectedAdmin ? searchfilter : response.data);
    } catch (error) {}
  };

  const GetAdminUserName = async () => {
    try {
      const res = await getAdminName();
      setAdminNames(res.data);
    } catch (error) {}
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card transaction-table">
            <div className="card-header border-0 flex-wrap pb-0">
              <h4 className="card-title">📈 Open Positions</h4>
            </div>
            <div className="card-body p-0">
              <div className="tab-content">
                <div className="tab-pane fade show active">
                  <div className="d-flex flex-wrap gap-3 p-3 rounded shadow-sm">
                    <div>
                      <label className="form-label mb-1">🔍 Search</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type to search..."
                        style={{ width: "220px" }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label mb-1">🛡️ Admins</label>
                      <select
                        className="form-select"
                        style={{ width: "220px" }}
                        value={selectedAdmin}
                        onChange={(e) => setSelectedAdmin(e.target.value)}
                      >
                        <option value="">Select Admin</option>
                        {adminNames.map((item, index) => (
                          <option key={index} value={item._id}>
                            {item.UserName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label mb-1">👤 Users</label>
                      <select
                        className="form-select"
                        style={{ width: "220px" }}
                        value={selectedUserName}
                        onChange={(e) => setSelectedUserName(e.target.value)}
                      >
                        <option value="">Select User</option>
                        {selectedUser.map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Table columns={columns} data={data} rowsPerPage={rowsPerPage} />

                  <div className="d-flex align-items-center" style={{ margin: "20px" }}>
                    Rows per page:
                    <select
                      className="form-select ml-2"
                      value={rowsPerPage}
                      onChange={(e) => setRowsPerPage(Number(e.target.value))}
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
  );
};

export default Position;
