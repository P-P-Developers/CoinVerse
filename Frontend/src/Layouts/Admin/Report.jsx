import React, { useEffect, useState } from "react";
import { getlicencedata } from "../../Services/Admin/Addmin";
import { fDateTime } from "../../Utils/Date_format/datefromat";
import Table from "../../Utils/Table/Table";

const Report = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  // Ensure the state is initialized as an array
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

  // Fetching license history
  const getlicensehistory = async () => {
    try {
      const data = { userid: user_id };
      const response = await getlicencedata(data);

      // Ensure filters are applied only when `response.data` exists
      const searchfilter = response?.data?.allData?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.UserName &&
            item.UserName.toLowerCase().includes(search.toLowerCase())) ||
          (item.Type && item.Type.toLowerCase().includes(search.toLowerCase()));

        return searchInputMatch;
      }) || [];

      const searchfilter1 = response?.data?.liveData?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.UserName &&
            item.UserName.toLowerCase().includes(search.toLowerCase())) ||
          (item.Type && item.Type.toLowerCase().includes(search.toLowerCase()));

        return searchInputMatch;
      }) || [];

      const searchfilter2 = response?.data?.expiredData?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.UserName &&
            item.UserName.toLowerCase().includes(search.toLowerCase())) ||
          (item.Type && item.Type.toLowerCase().includes(search.toLowerCase()));

        return searchInputMatch;
      }) || [];

      setAlllivedata(search ? searchfilter : response?.data?.allData || []);
      setActivedata(search ? searchfilter1 : response?.data?.liveData || []);
      setExpired(search ? searchfilter2 : response?.data?.expiredData || []);
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
                    <div className="tab-pane fade show active" id="NavPills">
                      <div className="card-body pt-0">
                        <ul className="nav nav-pills mb-4 light">
                          <li className="nav-item">
                            <a
                              href="#navpills-1"
                              className="nav-link active navlink"
                              data-bs-toggle="tab"
                            >
                              All Clients
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              href="#navpills-2"
                              className="nav-link navlink"
                              data-bs-toggle="tab"
                            >
                              Active Live Clients
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              href="#navpills-3"
                              className="nav-link navlink"
                              data-bs-toggle="tab"
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
                                        data={alllivedata}
                                      />
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
                                      {activedata.length > 0 ? (
                                        <Table
                                          columns={columns}
                                          data={activedata}
                                        />
                                      ) : (
                                        <div className="text-center">
                                          No Data Found
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div id="navpills-3" className="tab-pane">
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
                              {expired.length > 0 ? (
                                <Table columns={columns} data={expired} />
                              ) : (
                                <div className="text-center">No Data Found</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="NavPills-html"></div>
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
