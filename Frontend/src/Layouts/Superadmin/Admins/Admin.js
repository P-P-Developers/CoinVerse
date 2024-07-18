import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { getUserdata, Addbalance, updateActivestatus } from "../../../Services/Superadmin/Superadmin";
import { Link } from "react-router-dom";
import { CirclePlus, IndianRupee } from "lucide-react";
import Swal from 'sweetalert2';
import { fDateTime } from "../../../Utils/Date_format/datefromat";
import Loader from "../../../Utils/Loader/Loader";

const Admin = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [data, setData] = useState([]);
  const [balance, setBalance] = useState("");
  const [modal, setModal] = useState(false);
  const [id, setID] = useState("");
  const [loading, setLoading] = useState(false);

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
          onClick={() => {
            setModal(true);
            setID(cell.row._id);
          }}
        >
          <span style={{ fontWeight: "bold", verticalAlign: "middle" }}>
            <CirclePlus
              size={20}
              style={{
                marginBottom: "-4px",
                marginRight: "5px",
                verticalAlign: "middle",
              }}
            />
            <IndianRupee
              style={{
                height: "16px",
                marginBottom: "-4px",
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
      Header: "ActiveStatus",
      accessor: "ActiveStatus",
      Cell: ({ cell }) => (
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"
          // checked={cell.value === 0}
          // onChange={(event) => updateactivestatus(event, cell.row._id)}
          />

        </div>
      ),
    },
    {
      Header: "Create Date",
      accessor: "Create_Date",
      Cell: ({ cell }) => fDateTime(cell.value),
    },
  ];

  // update balance
  const updateBalance = async () => {
    try {
      await Addbalance({
        id: id,
        Balance: balance,
        parent_Id: user_id
      });

      Swal.fire({
        icon: 'success',
        title: 'Balance Updated',
        text: 'The balance has been updated successfully.',
      });
      getAllAdmin();
      setModal(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating the balance. Please try again.',
      });
    }
  };

  // update active status
  // const updateactivestatus = async (event, id) => {
  //   const user_active_status = event.target.checked ? 1 : 0;

  //   const result = await Swal.fire({
  //     title: "Do you want to save the changes?",
  //     showCancelButton: true,
  //     confirmButtonText: "Save",
  //     cancelButtonText: "Cancel",
  //     allowOutsideClick: false,
  //   });

  //   if (result.isConfirmed) {
  //     try {
  //       const response = await updateActivestatus({ id, user_active_status });
  //       if (response.status) {
  //         Swal.fire({
  //           title: "Saved!",
  //           icon: "success",
  //           timer: 1000,
  //           timerProgressBar: true
  //         });
  //         setTimeout(() => {
  //           Swal.close(); // Close the modal
  //           getAllAdmin(); // Refresh the data
  //         }, 1000);
  //       }
  //     } catch (error) {
  //       console.error("Error", error);
  //       Swal.fire("Error", "There was an error processing your request.", "error");
  //     }
  //   } else if (result.dismiss === Swal.DismissReason.cancel) {
  //     getAllAdmin(); // Reload the data to revert the change
  //   }
  // };

  // get all admin
  const getAllAdmin = async () => {
    setLoading(true);
    const data = { id: user_id };
    try {
      const response = await getUserdata(data);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAdmin();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card transaction-table">
                <div className="card-header border-0 flex-wrap pb-0">
                  <div className="mb-2">
                    <h4 className="card-title">All Admins</h4>
                  </div>
                  <Link
                    to="/superadmin/addmin"
                    className="float-end mb-2 btn btn-dark"
                  >
                    Add Admins
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
                      <Table columns={columns} data={data} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="modal custom-modal d-block" id="add_vendor" role="dialog">
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
                            const value = e.target.value.replace(/\D/g, '');
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

export default Admin;
