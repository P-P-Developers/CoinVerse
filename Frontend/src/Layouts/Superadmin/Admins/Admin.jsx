import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import {
  getUserdata,
  updateActivestatus,
  Delete_Admin,
} from "../../../Services/Superadmin/Superadmin";
import { Link, useNavigate } from "react-router-dom";
import { CirclePlus, Pencil, Trash2, Eye } from "lucide-react";
import Swal from "sweetalert2";
import Loader from "../../../Utils/Loader/Loader";
import {
  MarginpriceRequired,
  updateuserLicence,
} from "../../../Services/Admin/Addmin";

import Modal from "react-modal";

const Admin = () => {
  const navigate = useNavigate();

  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [data, setData] = useState([]);
  const [license, setLicence] = useState(false);
  const [licenseid, setLicenceId] = useState("");
  const [licencevalue, setLicencevalue] = useState("");
  const [loading, setLoading] = useState(false);
  const [rowId, setRowId] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    crypto: "",
    forex: "",
    dollarprice: "",
  });
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    getAllAdmin();
  }, [searchTerm, selectedFilters]);

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

  const handleUpdate = async () => {
    if (!formData.crypto || !formData.dollarprice || !formData.forex) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required. Please fill in all values.",
        confirmButtonColor: "#d33",
      });
      return; // Stop execution if validation fails
    }
    const data = {
      adminid: rowId,
      crypto: formData.crypto,
      dollarprice: formData.dollarprice,
      forex: formData.forex,
    };
    const res = await MarginpriceRequired(data);
    if (res?.status) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: res.message,
        confirmButtonColor: "#33B469",
      });
    }

    setIsCurrencyModalOpen(false);
  };

  const columns = [
    { Header: "FullName", accessor: "FullName" },
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
      Header: "Licence",
      accessor: "Licence",
      Cell: ({ cell }) => (
        <div
          style={{
            backgroundColor: "#E1FFED",
            border: "none",
            color: "#33B469",
            padding: "6px 10px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "13px",
            cursor: "pointer",
            borderRadius: "10px",
            transition: "background-color 0.3s ease",
          }}
          onClick={() => {
            setLicence(true);
            setLicenceId(cell.row._id);
          }}
        >
          <span style={{ fontWeight: "bold", verticalAlign: "middle" }}>
            <CirclePlus
              size={20}
              style={{
                marginRight: "5px",
                verticalAlign: "middle",
              }}
            />
            {cell.value || "0"}
          </span>
        </div>
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
            <Trash2
              style={{
                cursor: "pointer",
                marginRight: "10px",
                marginLeft: "3px",
                color: "red",
              }}
              onClick={() => DeleteAdmin(cell.row._id)}
            />
          </div>
        );
      },
    },

    // {
    //   Header: "Start Date", accessor: "Start_Date",
    //   Cell: ({ cell }) => {
    //     return fDateTime(cell.value)

    //   },
    // },
    // {
    //   Header: "End Date", accessor: "End_Date",
    //   Cell: ({ cell }) => {
    //     return fDateTime(cell.value)

    //   },
    // },
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
      Header: "Brokerage",
      accessor: "Employee",
      Cell: ({ cell }) => {
        return (
          <div>
            <Eye
              style={{ cursor: "pointer", color: "#33B469" }}
              onClick={() => AdminBrokerageDetail(cell.row)}
            />
          </div>
        );
      },
    },
    {
      Header: "Currency Setup",
      accessor: "Currency Setup",
      Cell: ({ cell }) => {
        return (
          <div>
            <button
              style={{
                cursor: "pointer",
                backgroundColor: "#33B469",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
              }}
              onClick={() => {
                setIsCurrencyModalOpen(true);
                setRowId(cell.row._id);
              }}
            >
              Currency Setup
            </button>
          </div>
        );
      },
    },
  ];

  const AdminUserdetail = (_id) => {
    navigate(`adminuser/${_id}`);
  };

  const AdminEmployeedetail = (_id) => {
    navigate(`adminemployee/${_id}`);
  };

  const AdminBrokerageDetail = (row) => {
    navigate(`/superadmin/brokerage/${row._id}`, { state: { rowData: row } });
  };

  const DeleteAdmin = async (_id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this user!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirmResult.isConfirmed) {
        const data = { id: _id };
        await Delete_Admin(data);

        Swal.fire({
          icon: "success",
          title: "User Deleted",
          text: "The user has been deleted successfully.",
        });

        getAllAdmin();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: "There was an error deleting the user. Please try again.",
      });
    }
  };

  const updateAdmin = (_id, obj) => {
    navigate(`updateadmin/${_id}`, { state: { rowData: obj.row } });
  };

  const updateLicence = async () => {
    try {
      await updateuserLicence({
        id: licenseid,
        Licence: licencevalue,
        parent_Id: user_id,
      });

      Swal.fire({
        icon: "success",
        title: "Licence Updated",
        text: "The Licence has been updated successfully.",
      });
      getAllAdmin();
      setLicence(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating the Licence. Please try again.",
      });
    }
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
            Swal.close(); // Close the modal
          }, 1000);
        }
      } catch (error) {
        console.log("Error", error);
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

      const filteredData = response.data.filter(
        (item) =>
          (item.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.UserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.PhoneNo.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (selectedFilters.length === 0 ||
            selectedFilters.some((filter) => item[filter]))
      );
      setData(filteredData);

      setLoading(false);
    } catch (error) {}
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card transaction-table">
              <div className="card-header border-0 flex-wrap pb-0">
                <div className="mb-2">
                  <h4 className="card-title">All Admins</h4>
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
                          placeholder="Search Here"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
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

      <Modal
        isOpen={isCurrencyModalOpen}
        onRequestClose={() => setIsCurrencyModalOpen(false)}
        contentLabel="currencyConfigModal"
        ariaHideApp={false}
        style={{
          content: {
            width: "500px",
            margin: "auto",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            zIndex: 1050, // Ensure modal content is above overlay
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: 1040, // Ensure overlay is beneath modal content
          },
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h4 style={{ margin: "0" }}>Currency Setup</h4>
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
            }}
            onClick={() => setIsCurrencyModalOpen(false)} // Ensure this closes the modal
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: "1" }}>
              <label>Forex Margin</label>
              <input
                type="number"
                name="forex"
                value={formData.forex}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ flex: "1" }}>
              <label>Crypto Margin</label>
              <input
                type="number"
                name="crypto"
                value={formData.crypto}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ flex: "1" }}>
              <label>Dollar Price</label>
              <input
                type="number"
                name="dollarprice"
                value={formData.dollarprice}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            style={{
              backgroundColor: "#ccc",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => setIsCurrencyModalOpen(false)}
          >
            Cancel
          </button>
          <button
            style={{
              backgroundColor: "#33B469",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </Modal>

      {license && (
        <div
          className="modal custom-modal d-block"
          id="add_vendor"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Add Licence</h4>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setLicence(false)}
                ></button>
              </div>
              <div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-12 col-sm-12">
                      <div className="input-block mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Licence Here"
                          onChange={(e) => {
                            let value = e.target.value;
                            setLicencevalue(value);
                          }}
                          value={licencevalue ? `${licencevalue}` : ""} // Display the value with no '%', since it's not applicable here
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-back cancel-btn me-2"
                    onClick={() => setLicence(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-primary paid-continue-btn"
                    onClick={updateLicence}
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

export default Admin;
