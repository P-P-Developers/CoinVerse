import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import {
  getAdminName,
  getavailableposition,
  getAdminUserName,
} from "../../../Services/Superadmin/Superadmin";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";

const Position = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [adminNames, setAdminNames] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");

useEffect(() => {
    getuserallhistory();
  }, [search, selectedAdmin, selectedUserName]);

  useEffect(() => {
    GetAdminUserName();
  }, []);


  const columns = [
    { Header: "UserName", accessor: "userName" },

    { Header: "symbol", accessor: "symbol" },
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
      Header: "Position Avg",
      accessor: "Position Avg",
      Cell: ({ cell }) => {
        const { sell_qty, buy_qty } = cell.row;
        const availablePosition = buy_qty - sell_qty;
        return <span>{availablePosition}</span>;
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

  // getting data
  const getuserallhistory = async () => {
    try {
      const response = await getavailableposition({ adminid: selectedAdmin });

      const userNames = response.data.map((item) => item.userName);

      setSelectedUser([...new Set(userNames)]);

      const searchfilter = response.data?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.symbol &&
            item.symbol.toLowerCase().includes(search.toLowerCase()));

        const selectedUserNameMatch =
          selectedUserName === "" ||
          (item.userName &&
            item.userName
              .toLowerCase()
              .includes(selectedUserName.toLowerCase()));

        return selectedUserNameMatch && searchInputMatch;
      });

      setData(search || selectedAdmin ? searchfilter : response.data);
    } catch (error) {}
  };

  const GetAdminUserName = async () => {
    try {
      const res = await getAdminName();
      setAdminNames(res.data);
    } catch (error) {
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
                    <h4 className="card-title">📈 Open Positions </h4>
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
                      <div className="d-flex flex-wrap gap-3 p-3 rounded shadow-sm ">
                        {/* Search Input */}
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

                        {/* Admin Dropdown */}
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

                        {/* User Dropdown */}
                        <div>
                          <label className="form-label mb-1">👤 Users</label>
                          <select
                            className="form-select"
                            style={{ width: "220px" }}
                            value={selectedUserName}
                            onChange={(e) =>
                              setSelectedUserName(e.target.value)
                            }
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
