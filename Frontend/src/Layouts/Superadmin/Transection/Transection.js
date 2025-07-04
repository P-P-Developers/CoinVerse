import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";
import { getlicencedetailforsuperadmin } from "../../../Services/Superadmin/Superadmin";
import { getUserFromToken } from "../../../Utils/TokenVerify";

const Transection = () => {
  const TokenData = getUserFromToken();
  const user_id = TokenData?.user_id;

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [adminNames, setAdminNames] = useState([]);
  const [selectedAdminName, setSelectedAdminName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getlicensedetail();
  }, [search, selectedAdminName]);

  const columns = [
    { Header: "UserName", accessor: "username" },
    { Header: "Licence", accessor: "Licence" },
    {
      Header: "Create Date",
      accessor: "createdAt",
      Cell: ({ cell }) => {
        return fDateTimesec(cell.value);
      },
    },
  ];

  //get license details
  const getlicensedetail = async () => {
    try {
      const data = { userid: user_id };
      const response = await getlicencedetailforsuperadmin(data);

      const adminNames = response?.data?.map(
        (item) => item.username != null && item.username
      );

      let uniqueAdminNames = [...new Set(adminNames)];

      setAdminNames(uniqueAdminNames);

      const searchfilter = response.data?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.username &&
            item.username.toLowerCase().includes(search.toLowerCase()));

        return searchInputMatch;
      });

      const filteredData = response.data?.filter((item) => {
        // Check if selectedAdminName is empty or if it matches the username
        return selectedAdminName === "" || item.username === selectedAdminName;
      });

      // Update data based on the search filter or the full response data
      setData(search ? searchfilter : filteredData);
    } catch (error) {}
  };

  return (
    <>
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card transaction-table">
                <div className="card-header border-0 flex-wrap pb-0">
                  <div className="mb-3">
                    <h4 className="card-title">License History </h4>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="tab-content" id="myTabContent1">
                    <div
                      className="tab-pane fade show active"
                      id="Week"
                      role="tabpanel"
                      aria-labelledby="Week-tab"
                    >
                      <div className="row mb-3 ms-3 align-items-center">
                        {/* Dropdown */}
                        <div className="col-md-6 col-lg-3 ">
                          <label className="form-label fw-bold d-block">
                            Filters
                          </label>
                          <select
                            style={{
                              width: "100%",
                              marginTop: "10px",
                              height: "35px",
                            }}
                            className="form-select"
                            value={selectedAdminName}
                            onChange={(e) =>
                              setSelectedAdminName(e.target.value)
                            }
                          >
                            <option value="">Select Admin</option>
                            {adminNames.map((item, index) => {
                              if (item) {
                                return (
                                  <option value={item} key={index}>
                                    {item}
                                  </option>
                                );
                              }
                              return null;
                            })}
                          </select>
                        </div>
                      </div>

                      <Table
                        columns={columns}
                        data={data && data}
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
                          onChange={(e) =>
                            setRowsPerPage(Number(e.target.value))
                          }
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

export default Transection;
