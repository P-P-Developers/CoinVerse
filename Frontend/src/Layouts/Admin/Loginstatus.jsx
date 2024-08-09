import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table"
import {fDateTime} from "../../Utils/Date_format/datefromat"
import {getlogoutuser} from "../../Services/Admin/Addmin"





const Loginstatus = () => {


  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;



  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");


  const columns = [
    { Header: "UserName", accessor: "UserName" },

    { Header: "Role", accessor: "role" },
    {
      Header: "Create Date",
      accessor: "createdAt",
      Cell: ({ cell }) => {
        return fDateTime(cell.value)

      },
    },
    {
      Header: "login_status",
      accessor: "login_status",
      Cell: ({ cell }) => (
        <span style={{ color: cell.value === "Panel On" ? "green" : "red" }}>
          {cell.value}
        </span>
      ),
    },
  ];



  // getting data
  const getlogsuser = async () => {
    try {
      const data = {userid :user_id}
      const response = await getlogoutuser(data);
      const searchfilter = response.data?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.UserName && item.UserName.toLowerCase().includes(search.toLowerCase())) ||
          (item.login_status && item.login_status.toLowerCase().includes(search.toLowerCase()));

        return searchInputMatch;
      });
      setData(search ? searchfilter : response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getlogsuser();
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
                    <h4 className="card-title">Login status</h4>
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

export default Loginstatus;
