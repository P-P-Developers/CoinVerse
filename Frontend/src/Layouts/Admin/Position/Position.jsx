import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { getpositionhistory } from "../../../Services/Admin/Addmin";
import { fDateTime, fDateTimesec } from "../../../Utils/Date_format/datefromat";

const Position = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;
  const Role = userDetails?.Role;
  const [user, setUser] = useState([]); // Used for storing filtered data (table rows)
  const [originalData, setOriginalData] = useState([]); // Used for storing unfiltered data (to populate dropdown)
  const [selectedUserName, setSelectedUserName] = useState(null); // state for selected user
  const [data, setData] = useState([]); // Filtered data for table
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { Header: "symbol", accessor: "symbol" },
    {
      Header: "UserName",
      accessor: "username", 
      Cell: ({ cell }) => {
        const username = cell.row.username;
        return username ? username : "-"; 
      }
    },
    {
      Header: "Buy qty",
      accessor: "buy_qty",
      Cell: ({ cell }) => {
        const buy_qty = cell.row.buy_qty;
        return buy_qty ? buy_qty : "-"; 
      }
    },
    {
      Header: "Sell qty",
      accessor: "sell_qty",
      Cell: ({ cell }) => {
        const sell_qty = cell.row.sell_qty;
        return sell_qty ? sell_qty : "-"; 
      }
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

  // Getting the data and storing it in both originalData and filtered data
  const getuserallhistory = async () => {
    try {
      const data = { userid: user_id, Role: Role };
      const response = await getpositionhistory(data);

      // Filter data based on buy_qty !== sell_qty
      const filterdata = response.data && response.data.filter((item) => item.buy_qty !== item.sell_qty);

      let UniqueUsernames = filterdata.map((item) =>  item.username);
      UniqueUsernames = [...new Set(UniqueUsernames)]; // Remove duplicates

      // Store original data (unfiltered)
      setOriginalData(UniqueUsernames);

      // Apply search filter if needed
      const searchfilter = filterdata?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.symbol && item.symbol.toLowerCase().includes(search.toLowerCase())) ||
          (item.username && item.username.toLowerCase().includes(search.toLowerCase())); // Added username to search filter
        return searchInputMatch;
      });

      // Apply filter for selected user
      const finalFilter = searchfilter?.filter((item) => {
        return selectedUserName ? item.username === selectedUserName : true; // Filter by selected username
      });

      setData(finalFilter || filterdata);
    } catch (error) {
    }
  };

  useEffect(() => {
    getuserallhistory();
  }, [search, selectedUserName]);

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
                      aria-labelledby="Week-tab">
                      <div className="mb-3 ms-4">
                        {/* Horizontal Layout for Search and Select User */}
                        <div className="d-flex align-items-center mb-3">
                          {/* Search Input */}
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

                          {/* User Dropdown */}
                          <div>
                            <label className="form-label">Select User:</label>
                            <select
                              className="form-control"
                              onChange={(e) =>
                                setSelectedUserName(e.target.value)
                              }
                              value={selectedUserName}>
                              <option value="">Select a user</option>
                              {originalData.length > 0 ? (
                                originalData.map((user) => (
                                  <option key={user} value={user}>
                                    {user}
                                  </option>
                                ))
                              ) : (
                                <option>No users available</option>
                              )}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Table */}
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

export default Position;
