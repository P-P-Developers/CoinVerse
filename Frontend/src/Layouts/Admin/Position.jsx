import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { getpositionhistory } from "../../Services/Admin/Addmin";
import { fDateTime, fDateTimesec } from "../../Utils/Date_format/datefromat";

const Position = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;
  const Role = userDetails?.Role;
  const [user, setUser] = useState([]); // Used for storing filtered data (table rows)
  const [originalData, setOriginalData] = useState([]); // Used for storing unfiltered data (to populate dropdown)
  const [selectedUserName, setSelectedUserName] = useState(null); // state for selected user
  const [data, setData] = useState([]); // Filtered data for table
  const [search, setSearch] = useState("");

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
  ];

  // Getting the data and storing it in both originalData and filtered data
  const getuserallhistory = async () => {
    try {
      const data = { userid: user_id, Role: Role };
      const response = await getpositionhistory(data);

      // Filter data based on buy_qty !== sell_qty
      const filterdata = response.data && response.data.filter((item) => item.buy_qty !== item.sell_qty);

      // Store original data (unfiltered)
      setOriginalData(filterdata);

      // Apply search filter if needed
      const searchfilter = filterdata?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.symbol && item.symbol.toLowerCase().includes(search.toLowerCase()));
        return searchInputMatch;
      });

      // Apply filter for selected user
      const finalFilter = searchfilter?.filter((item) => {
        return selectedUserName ? item.username === selectedUserName : true; // Filter by selected username
      });

      setData(finalFilter || filterdata);
    } catch (error) {
      console.log("error", error);
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
                      aria-labelledby="Week-tab"
                    >
                      <div className="mb-3 ms-4">
                        Search :{" "}
                        <input
                          className="ml-2 input-search form-control"
                          style={{ width: "20%" }}
                          type="text"
                          placeholder="Search..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        {/* Dropdown for selecting user */}
                        Select User:{" "}
                        <select
                          className="form-control"
                          style={{ width: "200px", display: "inline-block" }}
                          onChange={(e) => setSelectedUserName(e.target.value)}
                          value={selectedUserName}
                        >
                          <option value="">Select a user</option>
                          {originalData.length > 0 ? (
                            originalData.map((user) => (
                              <option key={user._id} value={user.username}>
                                {user.username}
                              </option>
                            ))
                          ) : (
                            <option>No users available</option>
                          )}
                        </select>
                      </div>
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

export default Position;
