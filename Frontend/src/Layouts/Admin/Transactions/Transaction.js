import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";
import { gethistory } from "../../../Services/Superadmin/Superadmin";
import { DollarSign } from 'lucide-react';

const Transaction = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page

  const columns = [
    { Header: "UserName", accessor: "UserName" },
    {
      Header: "Balance",
      accessor: "Balance",
      Cell: ({ cell }) => (
        <>
          <DollarSign style={{ marginRight: '5px', color: "green" }} />
          {cell.value}
        </>
      ),
    },
       {
      Header: "Status",
      accessor: "Type",
      Cell: ({ cell }) => (
        <span style={{ color: cell.value === "CREDIT" ? "green" : "red" }}>
          {cell.value}
        </span>
      ),
    },
    {
      Header: "Create Date",
      accessor: "createdAt",
      Cell: ({ cell }) => fDateTimesec(cell.value),
    },
 
  ];

  const getallhistory = async () => {
    try {
      const response = await gethistory({});
      const result = response.data?.filter((item) => item.parent_Id == user_id);

      const searchfilter = result?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.UserName && item.UserName.toLowerCase().includes(search.toLowerCase())) ||
          (item.Type && item.Type.toLowerCase().includes(search.toLowerCase()));

        return searchInputMatch;
      });

      setData(search ? searchfilter : result);
    } catch (error) {
    }
  };

  useEffect(() => {
    getallhistory();
  }, [search]);

  return (
    <>
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card transaction-table">
                <div className="card-header border-0 flex-wrap pb-0">
                  <div className="mb-4">
                    <h4 className="card-title">Transaction History</h4>
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
                      <div className="mb-3 ms-4">
                        Search:{" "}
                        <input
                          className="ml-2 input-search form-control"
                          style={{ width: "20%" }}
                          type="text"
                          placeholder="Search..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <Table columns={columns} data={data || []} rowsPerPage={rowsPerPage} />
                      <div className="d-flex align-items-center" style={{ marginBottom: "20px", marginLeft: "20px", marginTop: "-48px" }}>

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

export default Transaction;
