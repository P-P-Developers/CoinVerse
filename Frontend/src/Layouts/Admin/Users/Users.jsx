import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";

import {
  getAllUser,
  Addbalance,
  updateActivestatus,
} from "../../../Services/Superadmin/Superadmin";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CirclePlus, Pencil, CircleDollarSign, Eye, CircleMinus } from "lucide-react";
import { getAllClient } from "../../../Services/Superadmin/Superadmin";

import Swal from "sweetalert2";
import { fDateTime } from "../../../Utils/Date_format/datefromat";
import Loader from "../../../Utils/Loader/Loader";
import { getUserFromToken } from "../../../Utils/TokenVerify";

const Users = () => {
  const navigate = useNavigate();
  const TokenData = getUserFromToken();

  const location = useLocation()
  const path = location?.state?.path



  useEffect(() => {
    if (path === "Totaluser") {
      setRedirectstatus("all")
    } else if (path === "activeuser") {
      setRedirectstatus("Active")
    } else if (path === "inactive") {
      setRedirectstatus("Inactive")
    } else {
      setRedirectstatus("")
    }
  }, [path])


  const user_id = TokenData?.user_id;

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [balance, setBalance] = useState("");
  const [modal, setModal] = useState(false);
  const [id, setID] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(false);
  const [employeename, setEmployeename] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [getActiveInactive, setActiveInactive] = useState("all");
  const [redirectstatus, setRedirectstatus] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const [client, setClient] = useState([]);





  const columns = [
    { Header: "FullName", accessor: "FullName" },
    { Header: "UserName", accessor: "UserName" },
    { Header: "Password", accessor: "Otp" },
    {
      Header: "pin",
      accessor: "pin",
      Cell: ({ cell }) => <span>{cell.value ? cell.value : "-"}</span>,
    },
    { Header: "Email", accessor: "Email" },
    { Header: "Phone No", accessor: "PhoneNo" },
    {
      Header: "Plan",
      accessor: "plan_type",
      Cell: ({ cell }) => {
        const planLabels = {
          1: "Basic Plan",
          2: "Standard Plan",
          3: "Premium Plan",
        };

        return <span>{planLabels[cell.value] || "--"}</span>;
      }
    },
    client?.Edit_balance == 1 &&
    {
      Header: "Balance",
      accessor: "Balance",
      Cell: ({ cell }) => (
        <div
          style={{
            backgroundColor: "#E1FFED",
            color: "#33B469",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "500",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>

            <span style={{ fontWeight: "bold" }}>
              {parseFloat(cell.value).toFixed(2)}
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <CirclePlus
              size={20}
              style={{
                color: "#22c55e",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onClick={() => {
                setModal(true);
                setID(cell.row._id);
                setType("CREDIT");
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <CircleMinus
              size={20}
              style={{
                color: "#ef4444",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onClick={() => {
                setModal(true);
                setID(cell.row._id);
                setType("DEBIT");
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>
      ),
    },

    {
      Header: "Status",
      accessor: "ActiveStatus",
      Cell: ({ cell }) => (
        <label className="form-check form-switch">
          <input
            id={`rating_${cell.row.id}`}
            className="form-check-input"
            type="checkbox"
            role="switch"
            onChange={(event) => updateactivestatus(event, cell.row._id)}
            defaultChecked={cell.value == 1}
          />
          <label
            htmlFor={`rating_${cell.row.id}`}
            className="checktoggle checkbox-bg"
          ></label>
        </label>
      ),
    },

    {
      Header: "Action",
      accessor: "Action",
      Cell: ({ cell }) => {
        return (
          <div>
            <Pencil
              style={{ cursor: "pointer", color: "#33B469" }}
              onClick={() => updateuserpage(cell.row._id, cell)}
            />
          </div>
        );
      },
    },
    {
      Header: "Start Date",
      accessor: "Start_Date",
      Cell: ({ cell }) => {
        return fDateTime(cell.value);
      },
    },

    {
      Header: "Trade History",
      accessor: "Trade History",
      Cell: ({ cell }) => {
        return (
          <div>
            <Eye
              style={{ cursor: "pointer", color: "#33B469" }}
              onClick={() => Clienthistory(cell.row._id)}
            />
          </div>
        );
      },
    },
    {
      Header: "Employee Allotment",
      accessor: "employee_id",
      Cell: ({ cell, row }) => {
        const employee_id = cell.row.employee_id;

        const employee = employeename.find((emp) => emp._id === employee_id);

        return employee ? employee.UserName : "N/A";
      },
    },
  ];

  const Clienthistory = (_id) => {
    navigate(`tradehistory/${_id}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const updateuserpage = (_id, obj) => {
    navigate(`updateuser/${_id}`, { state: { rowData: obj.row } });
  };

  // update  balance
  const updateBalance = async () => {
    try {
      // Validate if balance is provided
      if (!balance || isNaN(balance) || parseFloat(balance) <= 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter a valid number greater than zero for the balance.",
        });
        return;
      }

      if (!reason) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter a valid Reason.",
        });
        return;
      }

      // Show confirmation popup
      const confirmation = await Swal.fire({
        title: "Confirm Update",
        text: `Are you sure you want to update the balance to ${balance}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
      });

      // Proceed only if user confirms
      if (confirmation.isConfirmed) {
        const response = await Addbalance({
          id: id,
          Balance: balance,
          parent_Id: user_id,
          Type: type,
        });

        // Handle API response
        if (response.status) {
          Swal.fire({
            icon: "success",
            title: "Balance Updated",
            text:
              response.message || "The balance has been updated successfully.",
          });

          getAlluserdata();
          setModal(false);
          setBalance("");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              response.message ||
              "An error occurred while updating the balance.",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "An unexpected error occurred.",
      });
    }
  };

  // update acctive status
  const updateactivestatus = async (event, id) => {
    const user_active_status = event.target.checked ? 1 : 0;

    const result = await Swal.fire({
      title: "Do you want to save the changes?",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      try {
        const response = await updateActivestatus({ id, user_active_status });
        if (response.status) {
          Swal.fire({
            title: "Saved!",
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            Swal.close();
          }, 1000);
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "There was an error processing your request.",
          "error"
        );
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      getAlluserdata();
    }
  };

  const getAlluserdata = async () => {
    setLoading(true);

    const params = {
      id: user_id,
      page,
      limit: rowsPerPage,
      search: search || "",
      ActiveStatus: redirectstatus ? redirectstatus : getActiveInactive,
    };

    try {
      const response = await getAllUser(params);
      const allUsers = response?.data || [];

      // Extract all usernames
      const userNames = allUsers.map((user) => user.UserName);

      // Filter by search and status
      const filteredData = allUsers.filter((user) => {
        const searchMatch =
          !search ||
          (user.FullName &&
            user.FullName.toLowerCase().includes(search.toLowerCase())) ||
          (user.UserName &&
            user.UserName.toLowerCase().includes(search.toLowerCase())) ||
          (user.Email &&
            user.Email.toLowerCase().includes(search.toLowerCase()));

        const statusMatch =
          getActiveInactive === "all" ||
          (getActiveInactive === "Active" && user.ActiveStatus === "1") ||
          (getActiveInactive === "Inactive" && user.ActiveStatus === "0");

        return searchMatch && statusMatch;
      });

      setData(filteredData);
      setEmployeename(userNames);
      setTotalCount(response?.pagination?.totalPages || 0);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };


  const getallclient = async () => {
    try {
      const data = { userid: user_id };
      const response = await getAllClient(data);
      if (response.status) {
        setClient(response.data);
      }
    } catch (error) { }
  };


  useEffect(() => {
    getallclient()
  }, [])

  useEffect(() => {
    getAlluserdata();
  }, [debouncedSearch, page, rowsPerPage, getActiveInactive, redirectstatus]);




  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, getActiveInactive]);




  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);



    return () => {
      clearTimeout(handler);
    };
  }, [search]);


  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card transaction-table">
              <div className="card-header border-0 flex-wrap pb-0">
                <div className="mb-4">
                  <h4 className="card-title">All Users</h4>
                </div>
                <Link
                  to="/admin/adduser"
                  className="float-end mb-4 btn btn-primary"
                >
                  Add User
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
                    <div className="row mb-3 ms-2">
                      {/* Search Box */}
                      <div className="col-md-4 mb-2">
                        <label
                          htmlFor="searchInput"
                          className="form-label fw-bold"
                        >
                          🔍 Search
                        </label>
                        <input
                          id="searchInput"
                          type="text"
                          className="form-control"
                          placeholder="Search here..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>

                      {/* Active / Inactive Filter */}
                      <div className="col-md-3 mb-2">
                        <label
                          htmlFor="statusSelect"
                          className="form-label fw-bold"
                        >
                          Active / Inactive
                        </label>
                        <select
                          id="statusSelect"
                          className="form-select"
                          value={getActiveInactive}
                          onChange={(e) => setActiveInactive(e.target.value)}
                        >
                          <option value="all">All</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    {loading ? (
                      <Loader />
                    ) : (
                      <Table
                        columns={columns}
                        data={data && data}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        isPage={false}
                      />
                    )}
                  </div>
                  <div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ marginBottom: "20px" }}>
                    {/* Rows per page selector */}
                    <div className="d-flex align-items-center">
                      <span>Rows per page:</span>
                      <select
                        className="form-select ms-2"
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        style={{ width: "auto" }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>

                    {/* Pagination controls */}
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      >
                        <i className="bi bi-chevron-left"></i>
                        <span>Prev</span>
                      </button>

                      <span className="fw-semibold text-secondary small">
                        Page {page} of {totalCount}
                      </span>

                      <button
                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalCount}
                      >
                        <span>Next</span>
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <div className="modal custom-modal d-block" id="add_vendor" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0"> {type == "CREDIT" ? "Credit Fund" : "Debit Fund"}</h4>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setModal(false);
                    setReason("");
                    setCustomReason("");
                    setBalance("");
                  }}
                ></button>
              </div>
              <div>
                <div className="modal-body">
                  <div className="row">
                    {/* Fund Input */}
                    <div className="col-lg-12 col-sm-12">
                      <div className="input-block mb-3">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter Fund"
                          onChange={(e) => {
                            let value = e.target.value;
                            if (Number(value) > 10000) {
                              value = "10000";
                            }
                            setBalance(value);
                          }}
                          value={balance}
                        />
                      </div>
                    </div>

                    {/* Reason Dropdown */}
                    <div className="col-lg-12 col-sm-12">
                      <div className="input-block mb-3">
                        <select
                          className="form-select"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        >
                          <option value="">Select Reason</option>
                          <option value="Profit Share">Profit Share</option>
                          <option value="Referral Bonus">Referral Bonus</option>
                          <option value="Manual Credit">Manual Credit</option>
                          <option value="Manual Debit">Manual Debit</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Show custom input if "Other" is selected */}
                    {reason === "Other" && (
                      <div className="col-lg-12 col-sm-12">
                        <div className="input-block mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Custom Reason"
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-back cancel-btn me-2"
                    onClick={() => {
                      setModal(false);
                      setReason("");
                      setCustomReason("");
                      setBalance("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-primary paid-continue-btn"
                    onClick={updateBalance}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
