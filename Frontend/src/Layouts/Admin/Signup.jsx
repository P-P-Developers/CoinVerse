import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { fDateTimesec } from "../../Utils/Date_format/datefromat";
import { getSignIn,DeleteSignIn } from "../../Services/Admin/Addmin";
import { Pencil, Trash2 } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import SweetAlert from "sweetalert2";

const Signup = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;
  const referralCode = userDetails?.ReferralCode;
  const referralLink = `${window.location.origin}/#/register/${referralCode}`;

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentClient, setCurrentClient] = useState(null);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { Header: "FullName", accessor: "FullName" },
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
      Header: "Create Date",
      accessor: "createdAt",
      Cell: ({ cell }) => {
        return fDateTimesec(cell.value);
      },
    },
    {
      Header: "Action",
      accessor: "Action",
      Cell: ({ cell }) => {
        return (
          <div>
            <Pencil
              style={{ cursor: "pointer", color: "#33B469" }}
              onClick={() => EditClient(cell.row._id)}
            />
            {/* add delete button  */}
            <Trash2
              style={{
                cursor: "pointer",
                marginRight: "10px",
                marginLeft: "3px",
                color: "red",
              }}
              onClick={() => DeleteUser(cell.row._id)}
            />
          </div>
        );
      },
    },
  ];

  const DeleteUser = async (rowId) => {

  
    const ConfirmDelete = await SweetAlert.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (ConfirmDelete.isConfirmed) {
      try {
        const response = await DeleteSignIn({ id: rowId });
        if (response.status) {
          SweetAlert.fire("Deleted!", "Your file has been deleted.", "success");
          getsignupuser();
        } else {
          SweetAlert.fire("Error!", "Failed to delete the user.", "error");
        }
      } catch (error) {
        console.log("error", error);
      }
    } else {
      SweetAlert.fire("Cancelled", "Your imaginary file is safe :)", "error");
    }
  };
  

  const EditClient = (rowId) => {
    const clientData = data.find((item) => item._id === rowId);
    navigate("/admin/adduser", { state: { clientData } });
  };

  const getsignupuser = async () => {
    try {
      const admin_id = userDetails?.user_id;
      const response = await getSignIn({ admin_id });
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
    <>
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card transaction-table">
                <div className="card-header border-0 flex-wrap pb-0">
                  <div className="mb-4">
                    <h4 className="card-title">Sing Up Request</h4>
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
                      <div className="d-flex align-items-center mb-3 ms-4">
                        <div className="me-4">
                          Search:{" "}
                          <input
                            className="ml-2 input-search form-control"
                            // style={{ width: "0%" }}
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>
                        {/* Referral Link Section */}
                        <div>
                          <h5>Your Referral Link:</h5>
                          <div className="d-flex align-items-center">
                            <input
                              type="text"
                              value={referralLink}
                              readOnly
                              className="form-control me-2"
                              style={{ width: "400px" }}
                            />
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                navigator.clipboard.writeText(referralLink);
                                alert("Referral link copied to clipboard!");
                              }}
                            >
                              Copy Link
                            </button>
                          </div>
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

export default Signup;
