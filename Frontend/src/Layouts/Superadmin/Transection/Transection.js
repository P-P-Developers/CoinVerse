import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { fDateTime } from "../../../Utils/Date_format/datefromat";

import { getlicencedetailforsuperadmin } from "../../../Services/Superadmin/Superadmin";

const Transection = () => {


  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");


  const columns = [
    { Header:"UserName", accessor: "username" },

    { Header: "Licence", accessor: "Licence" },
    {
      Header: "Create Date",
      accessor: "createdAt",
      Cell: ({ cell }) => {
        return fDateTime(cell.value)

      },
    },
    { Header: "Start_Date", accessor: "Start_Date",
      Cell: ({ cell }) => {
        return fDateTime(cell.value)

      },
     },
    { Header: "End_Date", accessor: "End_Date",
      Cell: ({ cell }) => {
        return fDateTime(cell.value)

      },
     },
  ];

  // getting data
  const getlicensedetail = async () => {
    try {
      const data = {userid:user_id}
      const response = await getlicencedetailforsuperadmin(data);
      const searchfilter = response.data?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.username && item.username.toLowerCase().includes(search.toLowerCase())) 
          

        return searchInputMatch;
      });
      setData(search ? searchfilter : response.data);
    } catch (error) {
      console.log("error", error);
    }
  };


  useEffect(() => {
    getlicensedetail();
  }, [search]);

  return (
    <>
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card transaction-table">
                <div className="card-header border-0 flex-wrap pb-0">
                  <div className="mb-3">
                    <h4 className="card-title">transaction History</h4>
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
                      <Table columns={columns} data={data && data} />
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
