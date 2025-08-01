import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import {
  getUserdata,
  Addbalance,
  updateActivestatus,
} from "../../../Services/Superadmin/Superadmin";
import { delete_Employee } from "../../../Services/Admin/Addmin";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { fDateTime } from "../../../Utils/Date_format/datefromat";
import Loader from "../../../Utils/Loader/Loader";
import { getUserFromToken } from "../../../Utils/TokenVerify";

const Employee = () => {
  const navigate = useNavigate();
  const TokenData = getUserFromToken();

  const user_id = TokenData?.user_id;

  const [data, setData] = useState([]);
  const [balance, setBalance] = useState("");
  const [modal, setModal] = useState(false);
  const [id, setID] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getAlluserdata();
  }, [search]);

  const columns = [
    { Header: "FullName", accessor: "FullName" },
    { Header: "UserName", accessor: "UserName" },
    { Header: "Password", accessor: "Otp" },
    { Header: "Email", accessor: "Email" },
    { Header: "Phone No", accessor: "PhoneNo" },

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
      Header: "Action",
      accessor: "Action",
      Cell: ({ cell }) => {
        return (
          <div>
            <Pencil
              style={{ cursor: "pointer", color: "#33B469" }}
              onClick={() =>
                updateEmploye(cell.row._id, cell || cell.permissions)
              }
            />
           
          </div>
        );
      },
    },
    {
      Header: "Create Date",
      accessor: "Create_Date",
      Cell: ({ cell }) => {
        return fDateTime(cell.value);
      },
    },
  ];

  const updateEmploye = (_id, obj) => {
    navigate(`updateemploye/${_id}`, { state: { rowData: obj.row } });
  };

  const DeleteEmployee = async (_id) => {
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
        await delete_Employee(data);

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

  const updateBalance = async () => {
    try {
      await Addbalance({
        id: id,
        Balance: balance,
        parent_Id: user_id,
      });

      Swal.fire({
        icon: "success",
        title: "Balance Updated",
        text: "The balance has been updated successfully.",
      });
      getAlluserdata();
      setModal(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating the balance. Please try again.",
      });
    }
  };

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
            Swal.close(); // Close the modal
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
      getAlluserdata();
    }
  };

  const getAlluserdata = async () => {
    setLoading(true);
    const data = { id: user_id };
    try {
      const response = await getUserdata(data);
      const result =
        response.data &&
        response.data.filter((item) => {
          return item.Role === "EMPLOYE";
        });
      const searchfilter =
        result &&
        result.filter((item) => {
          const searchInputMatch =
            search == "" ||
            (item.FullName &&
              item.FullName.toLowerCase().includes(search.toLowerCase())) ||
            (item.UserName &&
              item.UserName.toLowerCase().includes(search.toLowerCase())) ||
            (item.PhoneNo &&
              item.PhoneNo.toLowerCase().includes(search.toLowerCase())) ||
            (item.Email &&
              item.Email.toLowerCase().includes(search.toLowerCase()));

          return searchInputMatch;
        });

      setData(search ? searchfilter : result);
      setLoading(false);
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
                  <h4 className="card-title">All Employees</h4>
                </div>
                <Link
                  to="/admin/addemployees"
                  className="float-end mb-4 btn btn-primary"
                >
                  Add Employee
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
                        autoFocus
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    {loading ? (
                      <Loader />
                    ) : (
                      <Table
                        columns={columns}
                        data={data}
                        rowsPerPage={rowsPerPage}
                      />
                    )}
                  </div>
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

export default Employee;
