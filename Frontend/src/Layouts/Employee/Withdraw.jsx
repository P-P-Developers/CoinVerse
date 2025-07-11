import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { getFundstatus } from "../../Services/Admin/Addmin";
import { UpdatestatusForpaymenthistory } from "../../Services/Admin/Addmin";
import Swal from "sweetalert2";
import { getUserFromToken } from "../../Utils/TokenVerify";

const Withdraw = () => {
  const TokenData = getUserFromToken();

  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedValues, setSelectedValues] = useState({});

  const user_id = TokenData?.user_id;

  useEffect(() => {
    getAllfundsstatus();
  }, [activeTab]);

  const columns = [
    { Header: "Name", accessor: "FullName" },
    {
      Header: "Request",
      accessor: "type",
      Cell: ({ cell }) => (cell.row.type == 0 ? "Withdrawal" : cell),
    },
    { Header: "Balance", accessor: "Balance" },
    { Header: "Date", accessor: "createdAt" },
  ];

  if (activeTab === "Pending") {
    columns.push({
      Header: "Action",
      accessor: "Action",
      Cell: ({ cell }) => (
        <div>
          <select
            onChange={(event) =>
              handleSelectChange(cell.row.id, cell.row, event)
            }
            defaultValue={selectedValues[cell.row.id] || "0"}
          >
            <option value="0">Pending</option>
            <option value="2">Reject</option>
            <option value="1">Complete</option>
          </select>
        </div>
      ),
    });
  }

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
      const data = { id, status };
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
      const data = { adminid: user_id, type: 0, activeTab };
      let response = await getFundstatus(data);
      if (response.status) {
        const filtertype =
          response.data &&
          response.data.filter((item) => {
            return item.type == 0;
          });
        setData(filtertype);
      }
    } catch (error) {}
  };

  const filterDataByStatus = (status) => {
    return data.filter((item) => item.status === status);
  };

  const renderTable = (status) => {
    return (
      <div className="table-responsive">
        <div className="mb-2">
          Search :{" "}
          <input
            className="ml-2 input-search form-control"
            defaultValue=""
            style={{ width: "20%" }}
          />
        </div>
        <h5>{activeTab}Transactions</h5>
        <Table columns={columns} data={filterDataByStatus(status)} />
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
    </div>
  );
};

export default Withdraw;
