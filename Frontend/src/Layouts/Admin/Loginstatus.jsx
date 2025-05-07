import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { fDateTime } from "../../Utils/Date_format/datefromat";
import { getlogoutuser, GetUsersName } from "../../Services/Admin/Addmin";

const Loginstatus = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null); // For selected user
  const [users, setUsers] = useState([]); // For dropdown user list
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch users for dropdown
  const fetchUsers = async () => {
    try {
      const response = await GetUsersName({ admin_id: user_id });
      if (response && response.data && response.data.length > 0) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      setUsers([]); // Fallback in case of error
    }
  };

  // Fetch logs when selected user changes or no user is selected (show all data)
  const getLogsForSelectedUser = async () => {
    try {
      const data = { userid: user_id, selectedUserId };

      // Fetch all data if no user is selected
      const response = await getlogoutuser(data);

      // Check if selectedUserId is empty or null and show data of all users
      const filteredData = response.data?.filter((item) => {
        // Search filter logic
        const searchInputMatch =
          search === "" ||
          (item.UserName &&
            item.UserName.toLowerCase().includes(search.toLowerCase())) ||
          (item.login_status &&
            item.login_status.toLowerCase().includes(search.toLowerCase())) ||
          (item.role && item.role.toLowerCase().includes(search.toLowerCase())); // Added role to search logic

        // If selectedUserId is null or empty, show data for all users
        if (!selectedUserId) {
          return searchInputMatch;
        }

        // If a user is selected, filter by selectedUserId
        return searchInputMatch && item.UserName === selectedUserId;
      });

      setData(filteredData || response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch logs whenever selectedUserId or search changes
  useEffect(() => {
    getLogsForSelectedUser();
  }, [selectedUserId, search]);

  const columns = [
    { Header: "UserName", accessor: "UserName" },
    { Header: "Role", accessor: "role" },
    { Header: "Created By", accessor: "parent_role" },
    {
      Header: "Create Date",
      accessor: "createdAt",
      Cell: ({ cell }) => {
        return fDateTime(cell.value);
      },
    },
    {
      Header: "Login Status",
      accessor: "login_status",
      Cell: ({ cell }) => (
        <span style={{ color: cell.value === "Panel On" ? "green" : "red" }}>
          {cell.value}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card transaction-table">
              <div className="card-header border-0 flex-wrap pb-0">
                <div className="mb-4">
                  <h4 className="card-title">Login Status</h4>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="tab-content" id="myTabContent1">
                  <div className="row mb-3 ms-3">
                    {/* Vertical Layout for Search and Select User */}
                    <div className="col-md-3">
                      <div className="">
                        <label className="me-2">Search:</label>
                        <input
                          className="form-control"
                          style={{ width: "75%" }}
                          type="text"
                          placeholder="Search..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* User Dropdown */}
                    <div className="col-md-3">
                      <div className="">
                        <label className="me-2">Select User:</label>
                        <select
                          className="form-control"
                          style={{ width: "50%%" }}
                          onChange={(e) => setSelectedUserId(e.target.value)}
                          value={selectedUserId}>
                          <option value="">Select a user</option>
                          {users.length > 0 ? (
                            users.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user?.UserName}
                              </option>
                            ))
                          ) : (
                            <option>No users available</option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Table Section */}
                  <div
                    className="tab-pane fade show active"
                    id="Week"
                    role="tabpanel"
                    aria-labelledby="Week-tab">
                    <Table
                      columns={columns}
                      data={data}
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
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
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
  );
};

export default Loginstatus;
