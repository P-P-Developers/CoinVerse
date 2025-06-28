import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import {
  getAdminLogsAPI,
  getUserdata,
  updateActivestatus,
} from "../../../Services/Superadmin/Superadmin";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Pencil, Eye } from "lucide-react";
import Swal from "sweetalert2";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";
import { Modal, Button } from "react-bootstrap";
import { getUserFromToken } from "../../../Utils/TokenVerify";

const Admin = () => {



  const navigate = useNavigate();
  const location = useLocation();
  const TokenData = getUserFromToken();
  const user_id = TokenData?.user_id;


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [getActiveInactive, setActiveInactive] = useState(
    location.state?.status || "all"
  );

  
  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [logsData, setLogsData] = useState([]);

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
      Header: "Logs",
      accessor: "",
      Cell: ({ cell }) => {
        return (
          <div>
            <Eye
              style={{ cursor: "pointer", color: "#33B469" }}
              onClick={() => AdminLogs(cell.row._id)}
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

  const AdminLogs = async (_id) => {
    const data = { id: _id };
    const response = await getAdminLogsAPI(data);
    setLogsData(response.data || []);
    setLogsModalOpen(true);
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

        const matchesSearch =
          searchTerm.trim() === "" ||
          item.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.UserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.PhoneNo.toLowerCase().includes(searchTerm.toLowerCase());


        const matchesStatus =
          getActiveInactive === "all" ||
          (getActiveInactive === "Active" && item.ActiveStatus == 1) ||
          (getActiveInactive === "Inactive" && item.ActiveStatus == 0);


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

      <Modal
        show={logsModalOpen}
        onHide={() => setLogsModalOpen(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Admin Logs</Modal.Title>
        </Modal.Header>
        <Modal.Body className="overflow-auto" style={{ maxHeight: "70vh" }}>
          {logsData.length === 0 ? (
            <div className="text-center">No logs found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    <th>S.No</th>
                    <th>Field</th>
                    <th>Old Value</th>
                    <th>New Value</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let serial = 1;
                    const rows = [];
                    logsData.forEach((log) => {
                      if (log.changes && log.changes.length > 0) {
                        log.changes.forEach((change) => {
                          rows.push(
                            <tr key={`${log._id}-${serial}`}>
                              <td>{serial++}</td>
                              <td>{change.field}</td>
                              <td>
                                {change.oldValue === true
                                  ? "Checked"
                                  : change.oldValue === false
                                    ? "Unchecked"
                                    : String(change.oldValue)}
                              </td>
                              <td>
                                {change.newValue === true
                                  ? "Checked"
                                  : change.newValue === false
                                    ? "Unchecked"
                                    : String(change.newValue)}
                              </td>
                              <td>
                                {log.timestamp
                                  ? fDateTimesec(log.timestamp)
                                  : "-"}
                              </td>
                            </tr>
                          );
                        });
                      } else {
                        rows.push(
                          <tr key={`${log._id}-nochange`}>
                            <td>{serial++}</td>
                            <td colSpan={4} className="text-center">
                              No changes
                            </td>
                          </tr>
                        );
                      }
                    });
                    return rows;
                  })()}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setLogsModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
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
