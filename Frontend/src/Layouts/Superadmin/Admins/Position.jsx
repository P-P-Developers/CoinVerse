import React, { useEffect, useState } from "react";
import {
  getAdminName,
  getavailableposition,
} from "../../../Services/Superadmin/Superadmin";
import AggregatedPosition from "./AggregatedPosition";
import {
  AddCondition,
  GetConditions,
} from "../../../Services/Superadmin/Superadmin";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";

import Dropdown from "react-bootstrap/Dropdown";

const Position = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [adminNames, setAdminNames] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [logsData, setLogsData] = useState([]);
  const [logsPage, setLogsPage] = useState(0);
  const logsPerPage = 10;

  useEffect(() => {
    getuserallhistory();
  }, [search, selectedAdmin]);

  useEffect(() => {
    GetAdminUserName();
  }, []);

  const getuserallhistory = async () => {
    try {
      const response = await getavailableposition({ adminid: selectedAdmin });
      setData(response.data);
      const responseData = await GetConditions();
      setLogsData(responseData.data);
    } catch (error) { }
  };

  const GetAdminUserName = async () => {
    try {
      const res = await getAdminName();
      setAdminNames(res.data);
    } catch (error) { }
  };

  // Dummy log data
  const openLogsModal = () => {
    setShowModal(true);
  };

  const closeLogsModal = () => {
    setShowModal(false);
    setLogsPage(0);
  };

  // Pagination logic for logs
  const totalLogsPages = Math.ceil(logsData.length / logsPerPage);
  const paginatedLogs = logsData.slice(
    logsPage * logsPerPage,
    (logsPage + 1) * logsPerPage
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card transaction-table">
            <div className="card-header border-0 flex-wrap pb-0 d-flex justify-content-between align-items-center">
              <h4 className="card-title">📈 Open Positions</h4>
              <button className="btn btn-dark" onClick={openLogsModal}>
                📋 Show Logs
              </button>
            </div>
            <div className="card-body p-0">
              <div className="tab-content">
                <div className="tab-pane fade show active">
                  <div className="d-flex flex-wrap gap-3 p-3 rounded shadow-sm">
                    <div>
                      <label className="form-label mb-1">🔍 Search</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type to search..."
                        style={{ width: "220px" }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label mb-1">🛡️ Admins</label>
                      <select
                        className="form-select"
                        style={{
                          width: "220px",
                          borderRadius: "8px",
                          background: "var(--bs-light, #f8fafc)",
                          border: "1.5px solid #2563eb55",
                          fontWeight: 500,
                          color: "#2563eb",
                          boxShadow: "0 1px 4px rgba(37,99,235,0.07)",
                          transition: "border-color 0.2s, box-shadow 0.2s",
                        }}
                        value={selectedAdmin}
                        onChange={(e) => setSelectedAdmin(e.target.value)}
                      >
                        <option value="" style={{ color: "#64748b" }}>
                          Select Admin
                        </option>
                        {adminNames?.map((item, index) => (
                          <option
                            key={index}
                            value={item._id}
                            style={{
                              color: "#1e293b",
                              background: "#fff",
                              fontWeight: 500,
                            }}
                          >
                            {item.UserName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <AggregatedPosition groupedData={data} search={search} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(7px)",
            WebkitBackdropFilter: "blur(7px)",
            transition: "backdrop-filter 0.3s",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered" style={{ maxWidth: "1100px" }}>
            <div
              className="modal-content"
              style={{
                borderRadius: "18px",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
                border: "none",
                overflow: "hidden",
                animation: "fadeInModal 0.35s cubic-bezier(.4,0,.2,1)",
                background: "rgba(255,255,255,0.97)",
              }}
            >
              <div
                className="modal-header bg-primary text-white"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  borderBottom: "1px solid #e3e6f0",
                  background: "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
                  boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
                }}
              >
                <h5 className="modal-title fw-bold" style={{ letterSpacing: 1 }}>
                  📋 Logs
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeLogsModal}
                  style={{ filter: "brightness(1.2)" }}
                ></button>
              </div>
              <div
                className="modal-body"
                style={{
                  maxHeight: "65vh",
                  overflowY: "auto",
                  padding: "2rem 1.5rem 1.5rem 1.5rem",
                  background: "rgba(250,252,255,0.98)",
                }}
              >
                <table
                  className="table table-bordered table-hover align-middle mb-0"
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "#fff",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  <thead
                    className="table-primary sticky-top"
                    style={{
                      zIndex: 1,
                      background: "#e3eefd",
                      fontWeight: 600,
                      fontSize: "1.04em",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <tr>
                      <th>#</th>
                      <th>Symbol</th>
                      <th>Initial Price</th>
                      <th>Drop Threshold</th>
                      <th>Time Window</th>
                      <th>Status</th>
                      <th>Triggered</th>
                      <th>Created At</th>
                      <th>Logs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.length === 0 && (
                      <tr>
                        <td colSpan={9} className="text-center text-muted py-4">
                          No logs found.
                        </td>
                      </tr>
                    )}
                    {paginatedLogs.map((log, i) => (
                      <tr key={log.id || i}>
                        <td className="fw-semibold">{logsPage * logsPerPage + i + 1}</td>
                        <td>{log.symbol}</td>
                        <td>{log.initialPrice}</td>
                        <td>{log.dropThreshold}</td>
                        <td>{log.timeWindow}</td>
                        <td>
                          <span className={`badge rounded-pill ${log.isActive ? "bg-success" : "bg-secondary"}`}>
                            {log.isActive ? "On" : "Off"}
                          </span>
                        </td>
                        <td>
                          <span className={`badge rounded-pill ${log.triggered ? "bg-warning text-dark" : "bg-secondary"}`}>
                            {log.triggered ? "On" : "Off"}
                          </span>
                        </td>
                        <td>
                          {log.createdAt ? fDateTimesec(log.createdAt) : "-"}
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="outline-primary"
                              size="sm"
                              className="rounded-pill"
                            >
                              View Logs ({log.logs.length})
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                              style={{ maxHeight: "400px", overflowY: "auto", minWidth: "250px" }}
                            >
                              {log.logs.length === 0 && (
                                <Dropdown.Item disabled>No log entries</Dropdown.Item>
                              )}
                              {log.logs.map((data) => (
                                <Dropdown.Item key={data._id}>
                                  <div>
                                    <span className="fw-bold">💵 Price:</span> {data.price}
                                  </div>
                                  <small className="text-muted">
                                    🕒 {fDateTimesec(data.time)}
                                  </small>
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <hr style={{ margin: 0, borderTop: "1.5px solid #e3e6f0" }} />
              <div
                className="modal-footer bg-light d-flex flex-column flex-md-row justify-content-between align-items-center"
                style={{
                  borderTop: "none",
                  padding: "1.2rem 2rem",
                  background: "rgba(245,247,250,0.98)",
                }}
              >
                <div>
                  <button
                    className="btn btn-secondary rounded-pill px-4"
                    onClick={closeLogsModal}
                  >
                    Close
                  </button>
                </div>
                <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    disabled={logsPage === 0}
                    onClick={() => setLogsPage((prev) => prev - 1)}
                  >
                    ◀ Prev
                  </button>
                  <span style={{ fontWeight: 500 }}>
                    Page {logsPage + 1} of {totalLogsPages || 1}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    disabled={logsPage + 1 >= totalLogsPages}
                    onClick={() => setLogsPage((prev) => prev + 1)}
                  >
                    Next ▶
                  </button>
                </div>
              </div>
              <style>
                {`
                  @keyframes fadeInModal {
                    0% { opacity: 0; transform: translateY(40px);}
                    100% { opacity: 1; transform: translateY(0);}
                  }
                `}
              </style>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Position;
