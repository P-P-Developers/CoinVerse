import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import {
  Addbalance,
  getAllClient,
} from "../../../Services/Superadmin/Superadmin";
import { DeleteUserdata } from "../../../Services/Admin/Addmin";

import { Link, useNavigate } from "react-router-dom";
import {
  CirclePlus,
  Pencil,
  Trash2,
  CircleDollarSign,
  Eye,
} from "lucide-react";

import Swal from "sweetalert2";
import { fDateTime } from "../../../Utils/Date_format/datefromat";
import Loader from "../../../Utils/Loader/Loader";
import { getEmployeedata } from "../../../Services/Employee/Employee";
import { getEmployee_permissiondata } from "../../../Services/Employee/Employee";

import { getUserFromToken } from "../../../Utils/TokenVerify";

const Users = () => {
  const navigate = useNavigate();
  const TokenData = getUserFromToken();

  const user_id = TokenData?.user_id;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [balance, setBalance] = useState("");
  const [modal, setModal] = useState(false);
  const [id, setID] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(false);
  const [getaccess, setGetaccess] = useState({});
  const [getid, setGetid] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { Header: "FullName", accessor: "FullName" },
    { Header: "UserName", accessor: "UserName" },
    { Header: "Email", accessor: "Email" },
    { Header: "Phone No", accessor: "PhoneNo" },
    getaccess.Balance_edit === 1 && {
      Header: "Balance",
      accessor: "Balance",
      Cell: ({ cell }) => (
        <div
          style={{
            backgroundColor: "#E1FFED",
            border: "none",
            color: "#33B469",
            padding: "6px 10px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "13px",
            cursor: "pointer",
            borderRadius: "10px",
            transition: "background-color 0.3s ease",
          }}
        >
          <CircleDollarSign
            style={{
              height: "16px",
              marginBottom: "-4px",
              marginRight: "5px",
              verticalAlign: "middle",
            }}
          />
          <span style={{ fontWeight: "bold", verticalAlign: "middle" }}>
            <CirclePlus
              size={20}
              style={{
                marginBottom: "-4px",
                marginRight: "5px",
                verticalAlign: "middle",
              }}
              onClick={() => {
                setModal(true);
                setID(cell.row._id);
                setType("CREDIT");
              }}
            />

            {parseFloat(cell.value).toFixed(4)}
          </span>
        </div>
      ),
    },
 
    {
      Header: "Create Date",
      accessor: "Create_Date",
      Cell: ({ cell }) => {
        return fDateTime(cell.value);
      },
    },

    getaccess.Edit === 1 && {
      Header: "Action",
      accessor: "Action",
      Cell: ({ cell }) => {
        return (
          <div>
            <Pencil
              style={{ cursor: "pointer", color: "#33B469" }}
              onClick={() => updateuserpage(cell.row._id, cell)}
            />
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

    getaccess.trade_history === 1 && {
      Header: "Trade History",
      accessor: "Trade History",
      Cell: ({ cell }) => {
        return (
          <div>
            <Eye
              style={{ cursor: "pointer", color: "#33B469" }}
              onClick={() => Clienthistory(cell.row._id)}
            />
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    getAlluserdata();
    getpermission();
    getallclient();
  }, [search]);

  const updateuserpage = (_id, obj) => {
    navigate(`updateuser/${_id}`, { state: { rowData: obj.row } });
  };

  const Clienthistory = (_id) => {
    navigate(`tradehistory/${_id}`);
  };

  const DeleteUser = async (_id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this user!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirmResult.isConfirmed) {
        const data = { id: _id };
        await DeleteUserdata(data);

        Swal.fire({
          icon: "success",
          title: "User Deleted",
          text: "The user has been deleted successfully.",
        });

        getAlluserdata();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: "There was an error deleting the user. Please try again.",
      });
    }
  };

  // update  balance
  const updateBalance = async () => {
    try {
      const response = await Addbalance({
        id: id,
        Balance: balance,
        parent_Id: getid,
        Type: type,
      });

      Swal.fire({
        icon: "success",
        title: "Balance Updated",
        text: response.message || "The balance has been updated successfully.",
      });

      getAlluserdata();
      setModal(false);
    } catch (error) {
      let errorMessage =
        "There was an error updating the balance. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMessage,
      });
    }
  };

  const getpermission = async () => {
    try {
      const data = { id: user_id };
      const response = await getEmployee_permissiondata(data);
      if (response.status) {
        setGetaccess(response.data[0]);
      }
    } catch (error) {}
  };

  // get all admin
  const getAlluserdata = async () => {
    setLoading(true);
    const data = { id: user_id };
    try {
      const response = await getEmployeedata(data);
      const result =
        response.data &&
        response.data.filter((item) => {
          return item.Role === "USER";
        });
      const searchfilter = result?.filter((item) => {
        const searchInputMatch =
          search == "" ||
          (item.FullName &&
            item.FullName.toLowerCase().includes(search.toLowerCase())) ||
          (item.UserName &&
            item.UserName.toLowerCase().includes(search.toLowerCase())) ||
          (item.Email &&
            item.Email.toLowerCase().includes(search.toLowerCase()));

        return searchInputMatch;
      });

      setData(search ? searchfilter : result);

      setLoading(false);
    } catch (error) {}
  };

  const getallclient = async () => {
    try {
      const data = { userid: user_id };
      const response = await getAllClient(data);
      if (response.status) {
        setGetid(response.data.parent_id);
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card transaction-table">
              <div className="card-header border-0 flex-wrap pb-0">
                <div className="mb-4">
                  <h4 className="card-title">All Users</h4>
                </div>

                {getaccess && getaccess.client_add === 1 ? (
                  <Link
                    to="/employee/adduser"
                    className="float-end mb-4 btn btn-primary"
                  >
                    Add User
                  </Link>
                ) : (
                  ""
                )}
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
                        autoFocus
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    {loading ? (
                      <Loader />
                    ) : (
                      <Table
                        columns={columns}
                        data={data && data}
                        rowsPerPage={rowsPerPage}
                      />
                    )}
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

      {modal && (
        <div
          className="modal custom-modal d-block"
          id="add_vendor"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Add Fund</h4>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setModal(false)}
                ></button>
              </div>
              <div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-12 col-sm-12">
                      <div className="input-block mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Fund"
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (Number(value) > 10000) {
                              value = "10000";
                            }
                            setBalance(value);
                          }}
                          value={balance}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-back cancel-btn me-2"
                    onClick={() => setModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-primary paid-continue-btn"
                    onClick={updateBalance}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
