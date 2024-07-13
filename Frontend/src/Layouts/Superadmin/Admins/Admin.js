import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { getadmindata } from "../../../Services/Superadmin/Superadmin";
import { Link } from "react-router-dom";
const Admin = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [data, setData] = useState([]);

  const columns = [
    { Header: "FullName", accessor: "FullName" },
    { Header: "UserName", accessor: "UserName" },
    { Header: "Email", accessor: "Email" },
    { Header: "Phone No", accessor: "PhoneNo" },
    { Header: "Balance", accessor: "Balance" },
    { Header: "ActiveStatus", accessor: "ActiveStatus" },
    { Header: "Create Date", accessor: "Create_Date" },
  ];

  const getalladmin = async () => {
    const data = { id: user_id };
    await getadmindata(data)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getalladmin();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card transaction-table">
            <div className="card-header border-0 flex-wrap pb-0">
              <div className="mb-2">
                <h4 className="card-title">All Admins</h4>
              </div>
              <Link to="/superadmin/adddmin" className="float-end mb-2 btn btn-dark">

                Add Admins
              </Link>

              {/* <ul className="float-end nav nav-pills mb-2" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="Week-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Week"
                    type="button"
                    role="tab"
                    aria-controls="month"
                    aria-selected="true"
                  >
                    Week
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="month-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#month"
                    type="button"
                    role="tab"
                    aria-controls="month"
                    aria-selected="false"
                  >
                    Month
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="year-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#year"
                    type="button"
                    role="tab"
                    aria-controls="year"
                    aria-selected="false"
                  >
                    Year
                  </button>
                </li>
              </ul> */}
            </div>
            <div className="card-body p-0">
              <div className="tab-content" id="myTabContent1">
                <div
                  className="tab-pane fade show active"
                  id="Week"
                  role="tabpanel"
                  aria-labelledby="Week-tab"
                >
                  <Table columns={columns} data={data} />
                </div>
                <div
                  className="tab-pane fade"
                  id="month"
                  role="tabpanel"
                  aria-labelledby="month-tab"
                >
                  <Table columns={columns} data={data} />
                </div>
                <div
                  className="tab-pane fade"
                  id="year"
                  role="tabpanel"
                  aria-labelledby="year-tab"
                >
                  <Table columns={columns} data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
