import React, { useState, useEffect } from "react";
import { getAllClient } from "../../Services/Superadmin/Superadmin";
import { UpdateRefferPrice } from "../../Services/Admin/Addmin";
import Swal from "sweetalert2";
import { getReferClients } from "../../Services/Admin/Addmin";
import Table from "../../Utils/Table/Table";
import { fDateTimesec } from "../../Utils/Date_format/datefromat";

const Basicsetting = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [referPrice, setReferPrice] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    // { Header: "FullName", accessor: "FullName" },
    { Header: "UserName", accessor: "UserName" },
    { Header: "Password", accessor: "password" },
    {
      Header: "Referred By",
      accessor: "referred_by",
      Cell: ({ cell }) => {
        return cell.value
          ? cell.value === userDetails.user_id
            ? "ADMIN"
            : "USER"
          : "N/A";
      },
    },
    {
      Header: "Referral Price",
      accessor: "referral_price",
      Cell: ({ cell }) => {
        return cell.value;
      },
    },
    {
      Header: "Created",
      accessor: "isActive",
      Cell: ({ cell }) => {
        return cell.value ? "Active" : "Inactive";
      },
    },
    {
      Header: "Refferal Point",
      accessor: "isPaymentDone",
      Cell: ({ cell }) => {
        return cell.value ? "Paid" : "Unpaid";
      },
    },

    {
      Header: "Create Date",
      accessor: "createdAt",
      Cell: ({ cell }) => {
        return fDateTimesec(cell.value);
      },
    },
  ];

  const getallclient = async () => {
    try {
      const data = { userid: user_id };
      const response = await getAllClient(data);
      if (response.status) {
        setReferPrice(response?.data?.Refer_Price);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getallclient();
  }, []);

  const Update_RefferPrice = async () => {
    try {
      const data = { userId: user_id, referPrice: referPrice };
      const response = await UpdateRefferPrice(data);
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.message,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getsignupuser = async () => {
    try {
      const admin_id = userDetails?.user_id;
      const response = await getReferClients({ admin_id });
      const searchfilter = response.data?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.UserName &&
            item.UserName.toLowerCase().includes(search.toLowerCase()));
        return searchInputMatch;
      });
      setData(search ? searchfilter : response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getsignupuser();
  }, [search]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card transaction-table">
            <div className="card-header border-0 flex-wrap pb-0">
             
                <h4 className="card-title">Refer And Earn</h4>
             
            </div>
            <div className="card profile-card card-bx">
              <div className="profile-form">
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label">Refer Price </label>
                        <div className="row">
                          <div className="col-lg-6 mb-2">
                            <input
                              type="number"
                              className="form-control "
                              placeholder="Enter Refer Point Price"
                              value={referPrice}
                              onChange={(e) => setReferPrice(e.target.value)}
                            />
                          </div>
                          <div className="col-lg-4 mb-2">
                            <button
                              className="btn btn-primary w-100"
                              onClick={Update_RefferPrice}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Search : </label>
                        <input
                          className="ml-2 input-search form-control mb-3"
                          type="text"
                          placeholder="Search..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />

                        <Table
                          columns={columns}
                          data={data && data}
                          rowsPerPage={rowsPerPage}
                        />
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

export default Basicsetting;
