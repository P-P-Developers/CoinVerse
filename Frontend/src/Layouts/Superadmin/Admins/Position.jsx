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
    } catch (error) {}
  };

  const GetAdminUserName = async () => {
    try {
      const res = await getAdminName();
      setAdminNames(res.data);
    } catch (error) {}
  };

  // Dummy log data
  const openLogsModal = () => {
    setShowModal(true);
  };

  const closeLogsModal = () => setShowModal(false);

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
                        style={{ width: "220px" }}
                        value={selectedAdmin}
                        onChange={(e) => setSelectedAdmin(e.target.value)}
                      >
                        <option value="">Select Admin</option>
                        {adminNames.map((item, index) => (
                          <option key={index} value={item._id}>
                            {item.UserName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <AggregatedPosition groupedData={data} />
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
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-xl modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">📋 Logs</h5>
          <button
            type="button"
            className="btn-close"
            onClick={closeLogsModal}
          ></button>
        </div>
        <div className="modal-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>symbol</th>
                <th>initialPrice</th>
                <th>dropThreshold</th>
                <th>timeWindow</th>
                <th>isActive</th>
                <th>triggered</th>
                <th>createdAt</th>
                <th>Logs</th>
              </tr>
            </thead>
            <tbody>
              {logsData.map((log, i) => (
                <tr key={log.id}>
                  <td>{i + 1}</td>
                  <td>{log.symbol}</td>
                  <td>{log.initialPrice}</td>
                  <td>{log.dropThreshold}</td>
                  <td>{log.timeWindow}</td>
                  <td>{log.isActive ? "On" : "Off"}</td>
                  <td>{log.triggered ? "On" : "Off"}</td>
                  <td>{log.createdAt ? fDateTimesec(log.createdAt) : "-"}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-primary" size="sm">
                        View Logs ({log.logs.length})
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        style={{ maxHeight: "500px", overflowY: "auto" }}
                      >
                        {log.logs.map((data) => (
                          <Dropdown.Item key={data._id}>
                            <p className="mb-0">💵 Price: {data.price}</p>
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
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeLogsModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Position;
