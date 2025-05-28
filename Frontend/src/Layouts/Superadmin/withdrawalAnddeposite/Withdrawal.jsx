import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { getFundstatus } from "../../../Services/Admin/Addmin";
import { UpdatestatusForpaymenthistory } from "../../../Services/Admin/Addmin";
import Swal from "sweetalert2";
import { fDateTime } from "../../../Utils/Date_format/datefromat";
import Modal from "react-modal"; // Import Modal if not already imported
import { GetAdminUsername } from "../../../Services/Superadmin/Superadmin";

const Withdraw = () => {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedValues, setSelectedValues] = useState({});
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (data) => {
    setSelectedBankDetails(data);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBankDetails(null);
  };

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [selectedAdminName, setSelectedAdminName] = useState("");
  const [adminNames, setAdminNames] = useState([]);

  useEffect(() => {
    getAdminNames();
    getAllfundsstatus();
  }, [search, activeTab,selectedAdminName]);

  const getAdminNames = async () => {
    try {
      const response = await GetAdminUsername();
 
      setAdminNames(response.data);
    } catch (error) {
    }
  };

  const handleSelectChange = async (rowId, row, event) => {
    const newSelectedValues = {
      ...selectedValues,
      [rowId]: event.target.value,
    };
    setSelectedValues(newSelectedValues);

    if (event.target.value === "1") {
      setCurrentRowId(row._id);
      setShowCompleteModal(true);
    } else {
      await Updatestatus(row._id, newSelectedValues[rowId]);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = async () => {
    if (!transactionId || !uploadedImage) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please provide both Transaction ID and Screenshot.",
        timer: 2000,
      });
      return;
    }

    const status = "1"; // Complete
    const data = {
      admin_id: selectedAdminName,
      id: currentRowId,
      status,
      transactionId,
      screenshot: uploadedImage,
    };

    try {
      const response = await UpdatestatusForpaymenthistory(data);
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.message || "Request marked as complete.",
          timer: 2000,
        });
        setShowCompleteModal(false);
        setTransactionId("");
        setUploadedImage(null);
        getAllfundsstatus();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Failed to update the request.",
          timer: 2000,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An unexpected error occurred.",
        timer: 2000,
      });
    }
  };

  const handleCancel = () => {
    setShowCompleteModal(false);
    setTransactionId("");
    setUploadedImage(null);
  };

  const columns = [
    { Header: "Name", accessor: "FullName" },
    {
      Header: "Request",
      accessor: "type",
      Cell: ({ cell }) => (cell.row.type == 0 ? "Withdrawal" : cell),
    },
    // { Header: "Requested Balance", accessor: "Balance" },
    { Header: "Balance", accessor: "Balance" },

    {
      Header: "Balance",
      accessor: "UserBalance",
      Cell: ({ cell }) => cell.value?.toFixed(4),
    },
    {
      Header: "Bank Details",
      accessor: "bankDetails",
      Cell: ({ cell }) => (
        <button
          onClick={() => handleOpenModal(cell.row)}
          className="btn btn-primary btn-sm d-flex align-items-center"
        >
          <i className="bi bi-eye me-2"></i> View Bank Details
        </button>
      ),
    },

    {
      Header: "Date",
      accessor: "createdAt",
      Cell: ({ cell }) => fDateTime(cell.value),
    },
  ];

  if (activeTab === "Pending") {
    columns.push({
      Header: "Action",
      accessor: "Action",
      Cell: ({ cell }) => (
        <div>
          <select
            className="form-select"
            onChange={(event) =>
              handleSelectChange(cell.row.id, cell.row, event)
            }
            Value={selectedValues[cell.row.id] || "0"}
          >
            <option value="0">Pending</option>
            <option value="2">Reject</option>
            <option value="1">Complete</option>
          </select>
        </div>
      ),
    });
  }

  const Updatestatus = async (id, status) => {
    try {
      const admin_id = selectedAdminName;
      const data = { admin_id, id, status };
      const response = await UpdatestatusForpaymenthistory(data);

      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text:
            response.message ||
            "An unexpected error occurred. Please try again.",
          timer: 2000,
        });
        getAllfundsstatus();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            response.message ||
            "Failed to update the request. Please try again.",
          timer: 2000,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.message || "An unexpected error occurred. Please try again.",
        timer: 2000,
      });
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getAllfundsstatus = async () => {
    try {
      if(selectedAdminName === "") {
        setData([]);
        return;
      }

      const data = { adminid: selectedAdminName, type: 0, activeTab };
      let response = await getFundstatus(data);
      if (response.status) {
        const filtertype =
          response.data &&
          response.data.filter((item) => {
            return item.type == 0;
          });
        const searchfilter = filtertype?.filter((item) => {
          const searchInputMatch =
            search === "" ||
            (item.UserName &&
              item.UserName.toLowerCase().includes(search.toLowerCase()));

          return searchInputMatch;
        });

        setData(search ? searchfilter : filtertype);
      }
    } catch (error) {
    }
  };

  const filterDataByStatus = (status) => {
    return data.filter((item) => item.status === status);
  };

 const renderTable = (status) => {
  return (
    <div className="table-responsive">
      {/* Controls Row */}
      <div className="row g-3 align-items-end mb-4">
        {/* Search Input */}
        <div className="col-md-6 col-lg-4">
          <label htmlFor="searchInput" className="form-label fw-semibold">
            🔍 Search:
          </label>
          <input
            id="searchInput"
            className="form-control"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Admin Dropdown */}
        <div className="col-md-6 col-lg-4">
          <label htmlFor="userSelect" className="form-label fw-semibold">
            Admin Name:
          </label>
          <select
            id="userSelect"
            className="form-select"
            value={selectedAdminName}
            onChange={(e) => setSelectedAdminName(e.target.value)}
          >
            <option value="">Select Admin</option>
            {adminNames?.map((item, index) =>
              item ? (
                <option value={item._id} key={index}>
                  {item.UserName}
                </option>
              ) : null
            )}
          </select>
        </div>
      </div>

      <h5 className="mb-3">{activeTab} Transactions</h5>

      <Table
        columns={columns}
        data={filterDataByStatus(status)}
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
  );
};


  return (
    <div>
      <div className="row">
        <div className="demo-view">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="card dz-card" id="nav-pills">
                  <div className="card-header flex-wrap border-0">
                    <h4 className="card-title">🏦 Withdrawal History</h4>
                  </div>
                  <div className="tab-content" id="myTabContent3">
                    <div
                      className="tab-pane fade show active"
                      id="NavPills"
                      role="tabpanel"
                      aria-labelledby="home-tab3"
                    >
                      <div className="card-body pt-0">
                        <ul className="nav nav-pills nav-pills1 mb-4 light">
                          <li className="nav-item">
                            <a
                              href="#navpills-1"
                              className={`nav-link navlink ${
                                activeTab === "Pending" ? "active" : ""
                              }`}
                              data-bs-toggle="tab"
                              aria-expanded="false"
                              onClick={() => handleTabClick("Pending")}
                            >
                              Pending
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              href="#navpills-2"
                              className={`nav-link navlink ${
                                activeTab === "Complete" ? "active" : ""
                              }`}
                              data-bs-toggle="tab"
                              aria-expanded="false"
                              onClick={() => handleTabClick("Complete")}
                            >
                              Complete
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              href="#navpills-3"
                              className={`nav-link navlink ${
                                activeTab === "Reject" ? "active" : ""
                              }`}
                              data-bs-toggle="tab"
                              aria-expanded="true"
                              onClick={() => handleTabClick("Reject")}
                            >
                              Reject
                            </a>
                          </li>
                        </ul>
                        <div className="tab-content">
                          <div
                            id="navpills-1"
                            className={`tab-pane ${
                              activeTab === "Pending" ? "active" : ""
                            }`}
                          >
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="card transaction-table">
                                  <div className="card-body p-0">
                                    <div
                                      className="tab-content"
                                      id="myTabContent1"
                                    >
                                      <div
                                        className="tab-pane fade show active"
                                        id="Week"
                                        role="tabpanel"
                                        aria-labelledby="Week-tab"
                                      >
                                        {renderTable(0)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            id="navpills-2"
                            className={`tab-pane ${
                              activeTab === "Complete" ? "active" : ""
                            }`}
                          >
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="card transaction-table">
                                  <div className="card-body p-0">
                                    <div
                                      className="tab-content"
                                      id="myTabContent1"
                                    >
                                      <div
                                        className="tab-pane fade show active"
                                        id="Week"
                                        role="tabpanel"
                                        aria-labelledby="Week-tab"
                                      >
                                        {renderTable(1)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            id="navpills-3"
                            className={`tab-pane ${
                              activeTab === "Reject" ? "active" : ""
                            }`}
                          >
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="card transaction-table">
                                  <div className="card-body p-0">
                                    <div
                                      className="tab-content"
                                      id="myTabContent1"
                                    >
                                      <div
                                        className="tab-pane fade show active"
                                        id="Week"
                                        role="tabpanel"
                                        aria-labelledby="Week-tab"
                                      >
                                        {renderTable(2)}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <Modal
  isOpen={showModal}
  onRequestClose={handleCloseModal}
  contentLabel="Bank Details"
  style={{
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "480px",
      padding: "30px",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      backgroundColor: "#fff",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
  }}
>
  <h4 className="text-center mb-4 fw-bold">Bank Details</h4>

  {selectedBankDetails ? (
    <div className="text-start">
      <div className="mb-3">
        <label className="form-label fw-semibold">Account Holder Name</label>
        <div className="form-control bg-light">{selectedBankDetails.accountHolderName || "N/A"}</div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Bank Account No</label>
        <div className="form-control bg-light">{selectedBankDetails.bankAccountNo || "N/A"}</div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Bank IFSC</label>
        <div className="form-control bg-light">{selectedBankDetails.bankIfsc || "N/A"}</div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Bank Name</label>
        <div className="form-control bg-light">{selectedBankDetails.bankName || "N/A"}</div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">UPI ID</label>
        <div className="form-control bg-light">{selectedBankDetails.upiId || "N/A"}</div>
      </div>
    </div>
  ) : (
    <p className="text-center">No bank details available.</p>
  )}

  <div className="text-center mt-4">
    <button onClick={handleCloseModal} className="btn btn-outline-danger px-4 py-2">
      Close
    </button>
  </div>
</Modal>

      <Modal
        isOpen={showCompleteModal}
        onRequestClose={handleCancel}
        contentLabel="Complete Transaction"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <h4 className="text-center mb-4">Complete Transaction</h4>
        <div>
          <div className="mb-3">
            <label htmlFor="transactionId" className="form-label">
              Transaction ID
            </label>
            <input
              type="text"
              id="transactionId"
              className="form-control"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="screenshot" className="form-label">
              Upload Screenshot
            </label>
            <input
              type="file"
              id="screenshot"
              className="form-control"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>
        <div className="text-center mt-4">
          <button onClick={handleComplete} className="btn btn-success me-3">
            Mark Complete
          </button>
          <button onClick={handleCancel} className="btn btn-danger">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Withdraw;
