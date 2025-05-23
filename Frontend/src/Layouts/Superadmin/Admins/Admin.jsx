import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import {
  getUserdata,
  updateActivestatus,
} from "../../../Services/Superadmin/Superadmin";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Pencil, Eye } from "lucide-react";
import Swal from "sweetalert2";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";
import { use } from "react";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [getActiveInactive, setActiveInactive] = useState(location.state?.status || "all");



  useEffect(() => {
    getAllAdmin();
  }, [searchTerm, selectedFilters, getActiveInactive]);

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    setSelectedFilters((prevFilters) =>
      checked
        ? [...prevFilters, value]
        : prevFilters.filter((filter) => filter !== value)
    );
  };

  const handleSelectAll = (e) => {
    const { checked } = e.target;
    if (checked) {
      setSelectedFilters([
        "EveryTransaction",
        "FixedPerClient",
        "FundAdd",
        "NetTransactionPercent",
      ]);
    } else {
      setSelectedFilters([]);
    }
  };

  const isAllSelected = selectedFilters.length === 4;

  const columns = [
    // { Header: "FullName", accessor: "FullName" },
    { Header: "UserName", accessor: "UserName" },
    { Header: "Password", accessor: "Otp" },
    { Header: "Email", accessor: "Email" },
    { Header: "Phone No", accessor: "PhoneNo" },

    {
      Header: "Status",
      accessor: "ActiveStatus",
      Cell: ({ cell }) => (
        <label className="form-check form-switch">
          <input
            id={`rating_${cell.row.id}`}
            className="form-check-input"
            type="checkbox"
            onChange={(event) => updateactivestatus(event, cell.row._id)}
            // defaultChecked={cell.value == 1}

            checked={cell.value == 1}
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
              onClick={() => updateAdmin(cell.row._id, cell)}
            />
          </div>
        );
      },
    },

    {
      Header: "User",
      accessor: "Admin_User",
      Cell: ({ cell }) => {
        return (
          <div>
            <Eye
              style={{ cursor: "pointer", color: "#33B469" }}
              onClick={() => AdminUserdetail(cell.row._id)}
            />
          </div>
        );
      },
    },
    {
      Header: "Employee",
      accessor: "Employee",
      Cell: ({ cell }) => {
        return (
          <div>
            <Eye
              style={{ cursor: "pointer", color: "#33B469" }}
              onClick={() => AdminEmployeedetail(cell.row._id)}
            />
          </div>
        );
      },
    },

    {
      Header: "Create Date",
      accessor: "createdAt",
      Cell: ({ cell }) => {
        return cell.value ? fDateTimesec(cell.value) : "";
      },
    },
  ];

  const AdminUserdetail = (_id) => {
    navigate(`adminuser/${_id}`);
  };

  const AdminEmployeedetail = (_id) => {
    navigate(`adminemployee/${_id}`);
  };

  const updateAdmin = (_id, obj) => {
    navigate(`updateadmin/${_id}`, { state: { rowData: obj.row } });
  };

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

            getAllAdmin();
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
      window.location.reload();
    }
  };

  const getAllAdmin = async () => {
    setLoading(true);
    const data = { id: user_id };

    try {
      const response = await getUserdata(data);

      const finalData = response.data.filter((item) => {
        // Search match
        const matchesSearch =
          searchTerm.trim() === "" ||
          item.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.UserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.PhoneNo.toLowerCase().includes(searchTerm.toLowerCase());

        // Status match
        const matchesStatus =
          getActiveInactive === "all" ||
          (getActiveInactive === "Active" && item.ActiveStatus == 1) ||
          (getActiveInactive === "Inactive" && item.ActiveStatus == 0);

        // Filter checkbox match
        const matchesFilters =
          selectedFilters.length === 0 ||
          selectedFilters.some((filter) => item[filter]);

        return matchesSearch && matchesStatus && matchesFilters;
      });

      setData(finalData);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card transaction-table">
              <div className="card-header border-0 flex-wrap pb-0">
                <div className="mb-2">
                  <h4 className="card-title">👩‍💼 All Admins </h4>
                </div>
                <Link
                  to="/superadmin/addmin"
                  className="float-end mb-2 btn btn-primary"
                >
                  Add Admin
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
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
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

                      {/* Filter Dropdown */}
                      <div className="col-md-3 mb-2">
                        <label className="form-label fw-bold d-block">
                          Filters
                        </label>
                        <div className="dropdown">
                          <button
                            className="btn btn-primary dropdown-toggle w-100"
                            type="button"
                            id="filterDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Select Filters
                          </button>

                          <ul
                            className="dropdown-menu w-100"
                            aria-labelledby="filterDropdown"
                          >
                            <li>
                              <label className="dropdown-item">
                                <input
                                  type="checkbox"
                                  checked={isAllSelected}
                                  onChange={handleSelectAll}
                                  className="form-check-input me-2"
                                />
                                Select All
                              </label>
                            </li>
                            {[
                              "EveryTransaction",
                              "FixedPerClient",
                              "FundAdd",
                              "NetTransactionPercent",
                            ].map((filter) => (
                              <li key={filter}>
                                <label className="dropdown-item">
                                  <input
                                    type="checkbox"
                                    value={filter}
                                    checked={selectedFilters.includes(filter)}
                                    onChange={handleFilterChange}
                                    className="form-check-input me-2"
                                  />
                                  {filter.replace(/([A-Z])/g, " $1").trim()}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

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
                      }}
                    >
                      Rows per page:{" "}
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
                        <option value={50}>100</option>
                      </select>
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

export default Admin;
