import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { getFundstatus } from "../../Services/Admin/Addmin";
import { UpdatestatusForpaymenthistory } from "../../Services/Admin/Addmin";
import Swal from "sweetalert2";
import { fDateTime } from "../../Utils/Date_format/datefromat";
import Modal from "react-modal"; // Import Modal if not already imported
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

const Withdraw = () => {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedValues, setSelectedValues] = useState({});
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

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
      admin_id: user_id,
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
    { Header: "Requested Balance", accessor: "Balance" },
    { Header: "Balance", accessor: "UserBalance", Cell: ({ cell }) => cell.value?.toFixed(4) },
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
      const admin_id = user_id;
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
      console.log("Error:", error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getAllfundsstatus = async () => {
    try {
      const data = { adminid: user_id, type: 0, activeTab };
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
      console.log("error");
    }
  };

  useEffect(() => {
    getAllfundsstatus();
  }, [search, activeTab]);

  const filterDataByStatus = (status) => {
    return data.filter((item) => item.status === status);
  };

  const renderTable = (status) => {
    return (
      <div className="table-responsive">
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
        <h5>{activeTab} Transactions</h5>
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
            <option value={100}>100</option>
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
                    <h4 className="card-title">Withdrawal History</h4>
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
                              className={`nav-link navlink ${activeTab === "Pending" ? "active" : ""
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
                              className={`nav-link navlink ${activeTab === "Complete" ? "active" : ""
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
                              className={`nav-link navlink ${activeTab === "Reject" ? "active" : ""
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
                            className={`tab-pane ${activeTab === "Pending" ? "active" : ""
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
                            className={`tab-pane ${activeTab === "Complete" ? "active" : ""
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
                            className={`tab-pane ${activeTab === "Reject" ? "active" : ""
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
        <h4 className="text-center mb-4">Bank Details</h4>
        {selectedBankDetails && (
          <div>
            <p>
              <strong>Account Holder Name:</strong>{" "}
              {selectedBankDetails.accountHolderName || "N/A"}
            </p>
            <p>
              <strong>Bank Account No:</strong>{" "}
              {selectedBankDetails.bankAccountNo || "N/A"}
            </p>
            <p>
              <strong>Bank IFSC:</strong>{" "}
              {selectedBankDetails.bankIfsc || "N/A"}
            </p>
            <p>
              <strong>Bank Name:</strong>{" "}
              {selectedBankDetails.bankName || "N/A"}
            </p>
            <p>
              <strong>UPI ID:</strong>{" "}
              {selectedBankDetails.upiId || "N/A"}
            </p>
          </div>
        )}
        <div className="text-center mt-4">
          <button
            onClick={handleCloseModal}
            className="btn btn-danger"
          >
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
