import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import ChatModal from "../ChatModal";
import {
  getUserdata,
  Addbalance,
  updateActivestatus,
} from "../../../Services/Superadmin/Superadmin";
import {
  updateuserLicence,
  DeleteUserdata,
  adminWalletBalance,
  TotalcountLicence,
} from "../../../Services/Admin/Addmin";

import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  CirclePlus,
  Pencil,
  Trash2,
  CircleDollarSign,
  CircleMinus,
  Eye,
} from "lucide-react";

import Swal from "sweetalert2";
import { fDateTime } from "../../../Utils/Date_format/datefromat";
import Loader from "../../../Utils/Loader/Loader";

const Users = () => {
  const navigate = useNavigate();

  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [balance, setBalance] = useState("");
  const [modal, setModal] = useState(false);
  const [id, setID] = useState("");
  const [type, setType] = useState("");
  const [refresh, setrefresh] = useState(false);

  const [license, setLicence] = useState(false);
  const [licenseid, setLicenceId] = useState("");
  const [licencevalue, setLicencevalue] = useState("");
  const [checkLicence, setCheckLicence] = useState([]);

  const [loading, setLoading] = useState(false);

  const [checkprice, setCheckprice] = useState("");

  const [employeename, setEmployeename] = useState([])
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedUser, setSelectedUser] = useState(null);

  const columns = [
    { Header: "FullName", accessor: "FullName" },
    { Header: "UserName", accessor: "UserName" },
    { Header: "Email", accessor: "Email" },
    { Header: "Phone No", accessor: "PhoneNo" },
    {
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

            {parseFloat(cell.value).toFixed(2)}
          </span>
          {/* <CircleMinus
              size={20}
              style={{
                marginBottom: "-4px",
                marginRight: "5px",
                verticalAlign: "middle",
                marginLeft:"10px"
  
              }}
              onClick={() => {
            setModal(true);
            setID(cell.row._id);
            setType("DEBIT")

          }}
            /> */}
        </div>
      ),
    },
    {
      Header: "Employee Allotment",
      accessor: "employee_id",
      Cell: ({ cell, row }) => {
        const employee_id = cell.row.employee_id;

        const employee = employeename.find(emp => emp._id === employee_id);

        return employee ? employee.UserName : 'N/A';
      }
    },
    // { Header: "Employee", accessor: "employee_id" },
    {
      Header: "ActiveStatus",
      accessor: "ActiveStatus",
      Cell: ({ cell }) => (
        <label className="form-check form-switch">
          <input
            id={`rating_${cell.row.id}`}
            className="form-check-input"
            type="checkbox"
            role="switch"
            onChange={(event) => updateactivestatus(event, cell.row._id)}
            defaultChecked={cell.value == 1}
          />
          <label
            htmlFor={`rating_${cell.row.id}`}
            className="checktoggle checkbox-bg"
          ></label>
        </label>
      ),
    },
    {
      Header: "Licence",
      accessor: "Licence",
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
          onClick={() => {
            setLicence(true);
            setLicenceId(cell.row._id);
          }}
        >
          <span style={{ fontWeight: "bold", verticalAlign: "middle" }}>
            <CirclePlus
              size={20}
              style={{
                marginRight: "5px",
                verticalAlign: "middle",
              }}
            />
            {cell.value}
          </span>
        </div>
      ),
    },
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
    {
      Header: "Action",
      accessor: "Action",
      Cell: ({ cell }) => {
        return (
          <div>
            <Pencil
              style={{ cursor: "pointer", color: "#33B469" }}
              onClick={() => updateuserpage(cell.row._id, cell)}
            />
            {/* <Trash2
              style={{
                cursor: "pointer",
                marginRight: "10px",
                marginLeft: "3px",
                color: "red",
              }}
              onClick={() => DeleteUser(cell.row._id)}
            /> */}
          </div>
        );
      },
    },
    {
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
    {
      Header: "Chat",
      accessor: "Chat",
      Cell: ({ cell }) => {
        return (
          <div>
            <CircleDollarSign
              style={{ cursor: "pointer", color: "#33B469" }}
              onClick={() => setSelectedUser(cell.row)}
            />
          </div>
        );
      },
    }

    ,
  ];

  const Clienthistory = (_id) => {
    navigate(`tradehistory/${_id}`);
  };



  const updateuserpage = (_id, obj) => {
    navigate(`updateuser/${_id}`, { state: { rowData: obj.row } });
  };



  //delete user
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
        // setrefresh(!refresh)
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

  // update Licence
  const updateLicence = async () => {
    try {

      if (parseInt(checkLicence.CountLicence) < parseInt(licencevalue)) {
        Swal.fire({
          title: "Alert",
          text: "Licence is required",
          icon: "warning",
          timer: 1000,
          timerProgressBar: true,
        });
        return;
      }

      await updateuserLicence({
        id: licenseid,
        Licence: licencevalue,
        parent_Id: user_id,
      });
      if (licencevalue) {
        Swal.fire({
          icon: "success",
          title: "Licence Updated",
          text: "The Licence has been updated successfully.",
        });
      }

      else {
        Swal.fire({
          icon: "error",
          title: "Invalid Licence Value",
          text: "Please enter a valid licence value and try again.",
        });
      }

      // setrefresh(!refresh)

      getAlluserdata();
      getadminLicence();
      setLicence(false);

      setLicencevalue("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating the Licence. Please try again.",
      });
    }
  };




  // update  balance
  const updateBalance = async () => {
    try {
      // Validate if balance is provided
      if (!balance || isNaN(balance) || parseFloat(balance) <= 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter a valid number greater than zero for the balance.",
        });
        return;
      }


      // Make the API call to add balance
      const response = await Addbalance({
        id: id,
        Balance: balance,
        parent_Id: user_id,
        Type: type,
      });

      // Handle API response
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Balance Updated",
          text: response.message || "The balance has been updated successfully.",
        });

        // Refresh data and reset states
        getAlluserdata();
        setModal(false);
        setBalance("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "An error occurred while updating the balance.",
        });
      }
    } catch (error) {
      // Handle unexpected errors
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "An unexpected error occurred.",
      });
    }
  };




  // update acctive status

  const updateactivestatus = async (event, id) => {
    const user_active_status = event.target.checked ? 1 : 0;

    const result = await Swal.fire({
      title: "Do you want to save the changes?",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      try {
        const response = await updateActivestatus({ id, user_active_status });
        if (response.status) {
          Swal.fire({
            title: "Saved!",
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            Swal.close();
          }, 1000);
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "There was an error processing your request.",
          "error"
        );
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // setrefresh(!refresh)

      getAlluserdata();
    }
  };




  // get all admin
  const getAlluserdata = async () => {
    setLoading(true);
    const data = { id: user_id };


    try {
      const response = await getUserdata(data);
      const result =
        response.data &&
        response.data.filter((item) => {
          return item.Role === "USER";
        });

      const filterusername = response.data && response.data.filter((item) => {
        return item._id
      })

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

      setEmployeename(filterusername)
      setData(search ? searchfilter : result);
      setFilteredData(result);
      setLoading(false);
    } catch (error) {
    }
  };

  // // admin blaance
  // const getadminbalance = async () => {
  //   const data = {userid: user_id};
  //   try {
  //     const response = await adminWalletBalance(data);
  //     setCheckprice(response.Balance);
  //   } catch (error) {
  //   }
  // };

  // check licence



  const getadminLicence = async () => {
    const data = { userid: user_id };
    try {
      const response = await TotalcountLicence(data);
      setCheckLicence(response.data);
    } catch (error) {

    }
  };



  useEffect(() => {
    getAlluserdata();
  }, [search, refresh]);



  useEffect(() => {
    getadminLicence();
  }, []);




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
                <Link
                  to="/admin/adduser"
                  className="float-end mb-4 btn btn-primary"
                >
                  Add User
                </Link>
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
                        <Table columns={columns} data={data && data} rowsPerPage={rowsPerPage} />
                    )}
                  </div>
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



      {license && (
        <div
          className="modal custom-modal d-block"
          id="add_vendor"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Add Licence</h4>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setLicence(false)}
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
                          placeholder="Enter Licence Here"
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            value = Math.max(0, Math.min(12, value));
                            setLicencevalue(value);
                          }}
                          value={licencevalue ? `${licencevalue}` : ""} // Display the value with no '%', since it's not applicable here
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
                    onClick={() => setLicence(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-primary paid-continue-btn"
                    onClick={updateLicence}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
      
        </div>
      )}


      {selectedUser && (
  <ChatModal user={selectedUser} adminId={user_id} onClose={() => setSelectedUser(null)} />
)}
    </>
  );
};

export default Users;
