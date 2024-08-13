import React, { useEffect, useState } from "react";
import { getlicencedata } from "../../Services/Admin/Addmin";
import { fDateTime } from "../../Utils/Date_format/datefromat";
import Table from "../../Utils/Table/Table";

const Report = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [alllivedata, setAlllivedata] = useState([]);
  const [activedata, setActivedata] = useState([]);
  const [expired, setExpired] = useState([]);
  const [search, setSearch] = useState("");

  const columns = [
    { Header: "UserName", accessor: "UserName" },
    {
      Header: "Start Date",
      accessor: "Start_Date",
      Cell: ({ cell }) => {
        return fDateTime(cell.value);
      },
    },
    {
      Header: "End Date",
      accessor: "End_Date",
      Cell: ({ cell }) => {
        return fDateTime(cell.value);
      },
    },
  ];

  // getting data
  const getlicensehistory = async () => {
    try {
      const data = { userid: user_id };
      const response = await getlicencedata(data);
      const searchfilter = response.data.allData?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.UserName &&
            item.UserName.toLowerCase().includes(search.toLowerCase())) ||
          (item.Type && item.Type.toLowerCase().includes(search.toLowerCase()));

        return searchInputMatch;
      });

      const searchfilter1 = response.data.liveData?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.UserName &&
            item.UserName.toLowerCase().includes(search.toLowerCase())) ||
          (item.Type && item.Type.toLowerCase().includes(search.toLowerCase()));

        return searchInputMatch;
      });

      const searchfilter2 = response.data.expiredData?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.UserName &&
            item.UserName.toLowerCase().includes(search.toLowerCase())) ||
          (item.Type && item.Type.toLowerCase().includes(search.toLowerCase()));

        return searchInputMatch;
      });

      setAlllivedata(search ? searchfilter : response.data.allData);
      setActivedata(search ? searchfilter1 : response.data.liveData);
      setExpired(search ? searchfilter2 : response.data.expiredData);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getlicensehistory();
  }, [search]);

  return (
    <div>
      <div className="row">
        <div className="demo-view">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="card dz-card" id="nav-pills">
                  <div className="card-header flex-wrap border-0">
                    <h4 className="card-title">Reports</h4>
                  </div>
                  <div className="tab-content" id="myTabContent3">
                    <div
                      className="tab-pane fade show active"
                      id="NavPills"
                      role="tabpanel"
                      aria-labelledby="home-tab3"
                    >
                      <div className="card-body pt-0">
                        <ul className="nav nav-pills  mb-4 light">
                          <li className=" nav-item">
                            <a
                              href="#navpills-1"
                              className="nav-link active navlink"
                              data-bs-toggle="tab"
                              aria-expanded="false"
                            >
                              All Clients
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              href="#navpills-2"
                              className="nav-link navlink"
                              data-bs-toggle="tab"
                              aria-expanded="false"
                            >
                              Active Live Clients
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              href="#navpills-3"
                              className="nav-link navlink"
                              data-bs-toggle="tab"
                              aria-expanded="true"
                            >
                              Expired Live Clients
                            </a>
                          </li>
                        </ul>
                        <div className="tab-content">
                          <div id="navpills-1" className="tab-pane active">
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
                                        <div className="table-responsive">
                                          <div className="mb-3 ms-4">
                                            Search :{" "}
                                            <input
                                              className="ml-2 input-search form-control"
                                              style={{ width: "20%" }}
                                              type="text"
                                              placeholder="Search..."
                                              value={search}
                                              onChange={(e) =>
                                                setSearch(e.target.value)
                                              }
                                            />
                                          </div>

                                          <Table
                                            columns={columns}
                                            data={alllivedata && alllivedata}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div id="navpills-2" className="tab-pane">
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
                                        <div className="table-responsive">
                                          <div className="mb-3 ms-4">
                                            Search :{" "}
                                            <input
                                              className="ml-2 input-search form-control"
                                              style={{ width: "20%" }}
                                              type="text"
                                              placeholder="Search..."
                                              value={search}
                                              onChange={(e) =>
                                                setSearch(e.target.value)
                                              }
                                            />
                                          </div>

                                          <Table
                                            columns={columns}
                                            data={activedata && activedata}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div id="navpills-3" className="tab-pane">
                            <div
                              className="tab-pane fade show active"
                              id="Week"
                              role="tabpanel"
                              aria-labelledby="Week-tab"
                            >
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
                                <div>
                                  <div className="table-responsive">
                                    <Table
                                      columns={columns}
                                      data={expired && expired}
                                    />
                                  </div>
                                  <div className="pagination">
                                    <button
                                      disabled=""
                                      className="pagination-button pagination-button-left"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={20}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-arrow-left"
                                      >
                                        <path d="m12 19-7-7 7-7" />
                                        <path d="M19 12H5" />
                                      </svg>
                                    </button>
                                    <span>Page 1 of 1</span>
                                    <button
                                      className="pagination-button pagination-button-right"
                                      disabled=""
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={20}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-arrow-right"
                                      >
                                        <path d="M5 12h14" />
                                        <path d="m12 5 7 7-7 7" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="NavPills-html"
                      role="tabpanel"
                      aria-labelledby="home-tab3"
                    ></div>
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

export default Report;
