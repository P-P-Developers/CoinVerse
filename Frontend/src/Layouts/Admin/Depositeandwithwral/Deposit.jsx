import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { getFundstatus } from "../../../Services/Admin/Addmin";
import { UpdatestatusForpaymenthistory } from "../../../Services/Admin/Addmin";
import Swal from "sweetalert2";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";
import { Modal } from "react-bootstrap";

const Deposit = () => {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedValues, setSelectedValues] = useState({});
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // for backend total rows

  useEffect(() => {
    getAllfundsstatus();
  }, [search, activeTab, page, rowsPerPage]);

  const columns = [
    { Header: "Name", accessor: "FullName" },
    {
      Header: "Request",
      accessor: "type",
      Cell: ({ cell }) => (cell.row.type == 1 ? "Deposite" : cell),
    },
    { Header: "Balance", accessor: "Balance" },
    // {
    //   Header: "Balance",
    //   accessor: "UserBalance",
    //   Cell: ({ cell }) => cell.value?.toFixed(4),
    // },
    { Header: "Transaction Id", accessor: "transactionId" },
    {
      Header: "ScreenShot",
      accessor: "ScreenShot",
      Cell: ({ cell }) =>
        cell.value ? <ImageCell src={cell.value} /> : "No Image",
    },

    {
      Header: "Date",
      accessor: "createdAt",
      Cell: ({ cell }) => fDateTimesec(cell.value),
    },
  ];



  const handleSelectChange = async (rowId, row, event) => {
    const newSelectedValues = {
      ...selectedValues,
      [rowId]: event.target.value,
    };
    setSelectedValues(newSelectedValues);
    await Updatestatus(row._id, newSelectedValues[rowId]);
  };

  const Updatestatus = async (id, status) => {
    try {
      const data = { admin_id: user_id, id, status };
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
      setLoading(true); // Start loading

      const data = {
        adminid: user_id,
        type: 1,
        activeTab,
        page,
        limit: rowsPerPage,
        search,
      };
      const response = await getFundstatus(data);

      if (response.status) {
        const filtertype = response.data || [];
        setData(filtertype);
        setTotalCount(response?.pagination?.totalPages || 0); // assuming backend returns total count
      }
    } catch (error) {
    } finally {
      setLoading(false); // Stop loading in both success and error cases
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const filterDataByStatus = (status) => {
    return data.filter((item) => item.status === status);
  };

  const renderTable = (status) => {
    return (
      <div className="table-responsive">
        <div className="mb-3">
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

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              data={filterDataByStatus(status)}
              rowsPerPage={rowsPerPage}
              totalCount={totalCount}
              page={page}
              isPage={false}
            />
            <div
              className="d-flex align-items-center"
              style={{
                marginBottom: "20px",
                marginLeft: "20px",
                // marginTop: "-48px",
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

            <div className="d-flex justify-content-end align-items-center gap-2 px-3 py-2">
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
          </>
        )}
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
                    <h4 className="card-title">Deposit History</h4>
                  </div>

                  <div className="card-body pt-0">
                    {/* Nav Pills */}
                    <ul className="nav nav-pills nav-pills1 mb-4 light">
                      {["Pending", "Complete", "Reject"].map((tab, index) => (
                        <li className="nav-item" key={tab}>
                          <a
                            href={`#navpills-${index + 1}`}
                            className={`nav-link navlink ${
                              activeTab === tab ? "active" : ""
                            }`}
                            data-bs-toggle="tab"
                            onClick={() => handleTabClick(tab)}
                          >
                            {tab}
                          </a>
                        </li>
                      ))}
                    </ul>

                    {/* Tab Content */}
                    <div className="tab-content">
                      {["Pending", "Complete", "Reject"].map((tab, index) => (
                        <div
                          key={tab}
                          id={`navpills-${index + 1}`}
                          className={`tab-pane ${
                            activeTab === tab ? "active" : ""
                          }`}
                        >
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="card transaction-table">
                                <div className="card-body p-0">
                                  {/* Render Table */}
                                  {renderTable(index)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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

const ImageCell = ({ src }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <img
        src={src}
        alt="Thumbnail"
        style={{
          width: "50px",
          height: "50px",
          cursor: "pointer",
          objectFit: "cover",
        }}
        onClick={() => setShow(true)}
      />

      <Modal show={show} onHide={() => setShow(false)} centered size="lg">
        <Modal.Body className="p-0">
          <img
            src={src}
            alt="Full View"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Deposit;
