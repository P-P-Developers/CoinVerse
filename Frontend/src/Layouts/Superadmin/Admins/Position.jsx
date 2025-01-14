import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import {
  getAdminName,
  getavailableposition,
} from "../../../Services/Superadmin/Superadmin";
import { fDateTime } from "../../../Utils/Date_format/datefromat";

const Position = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;
  const Role = userDetails?.Role;

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [adminNames, setAdminNames] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");

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
  ];

  // getting data
  const getuserallhistory = async () => {
    try {
      const response = await getavailableposition({});

      // Get unique admin names
      const uniqueAdminNames = [
        ...new Set(response?.data?.map((item) => item.adminName)),
      ];
      const res = await getAdminName();
      const adminNames = res.data.map((item) => item.UserName);
 
      setAdminNames(adminNames);

      const searchfilter = response.data?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.symbol &&
            item.symbol.toLowerCase().includes(search.toLowerCase()));

        const adminFilterMatch =
          selectedAdmin === "" ||
          item.adminName.trim().toLowerCase() ===
            selectedAdmin.trim().toLowerCase();

        return adminFilterMatch && searchInputMatch;
      });

      setData(search || selectedAdmin ? searchfilter : response.data);
    } catch (error) {}
  };

  useEffect(() => {
    getuserallhistory();
  }, [search, selectedAdmin]);

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
                      <div className="mb-3 ms-4 d-flex align-items-center">
                        {/* Search Input */}
                        <div className="me-3">
                          Search:{" "}
                          <input
                            className="input-search form-control"
                            style={{ width: "200px" }}
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>

                        {/* Dropdown */}
                        <div className="mt-3">
                          <select
                            className="form-select"
                            style={{ width: "200px", height: "35px" }} // Adjust width if needed
                            onChange={(e) => setSelectedAdmin(e.target.value)}>
                            <option value={selectedAdmin}>Select Admin</option>
                            {/* Render admin names dynamically */}
                            {adminNames.map((item, index) => (
                              <option key={index} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {data && data.length > 0 ? (
                        <Table columns={columns} data={data && data} />
                      ) : (
                        <div>No data available</div>
                      )}

                      {/* <Table columns={columns} data={data && data} /> */}
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
