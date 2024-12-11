


import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { fDateTime } from "../../Utils/Date_format/datefromat";
import { getlogoutuser, getAllUsers, getAllUser, GetUsersName } from "../../Services/Admin/Addmin";
// import { getlogsuser } from "../../../../Backend/App/Controllers/Auth/Auth.controller";

const Loginstatus = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null); // For selected user
  const [users, setUsers] = useState([]); // For dropdown user list
  const [selectedUserDetails, setSelectedUserDetails] = useState();

  // Fetch users for dropdown
  const fetchUsers = async () => {
    try {
      // Fetch users data from API
      const response = await GetUsersName();
      console.log("Response is ",response)
      
      // Ensure users data is available
      if (response && response.data && response.data.length > 0) {
        setUsers(response.data);
      } else {
        setUsers([]); // Fallback if no data
      }
    } catch (error) {
      setUsers([]); // Fallback in case of error
    }
  };

  // Fetch logs when selected user changes
  const getLogsForSelectedUser = async () => {
    try {
      const data = { userid: user_id, selectedUserId };
      const response = await getlogoutuser(data);

      const filteredData = response.data?.filter((item) => {
        // Search filter logic
        const searchInputMatch =
          search === "" ||
          (item.UserName && item.UserName.toLowerCase().includes(search.toLowerCase())) ||
          (item.login_status && item.login_status.toLowerCase().includes(search.toLowerCase()));

        // Filter by selectedUserId
        const userMatch = item.UserName === selectedUserId;

        return searchInputMatch && userMatch; // Filter by both search and user match
      });

      setData(filteredData || response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fetch users and logs data when component mounts or when selected user changes
  useEffect(() => {
    fetchUsers();
  }, []); // Fetch users on component mount

  useEffect(() => {
    if (selectedUserId) {
      getLogsForSelectedUser(); // Fetch logs for selected user
    }
  }, [selectedUserId, search]); // Trigger when selectedUserId or search changes

  const columns = [
    { Header: "UserName", accessor: "UserName" },
    { Header: "Role", accessor: "role" },
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
                  <div
                    className="tab-pane fade show active flex"
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
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        value={selectedUserId}
                      >
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

                    <Table columns={columns} data={data} />
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
