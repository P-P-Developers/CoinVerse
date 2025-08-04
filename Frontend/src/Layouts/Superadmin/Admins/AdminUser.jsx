import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { getadminuserdetail, Addbalance } from "../../../Services/Superadmin/Superadmin";
import { fDateTime } from "../../../Utils/Date_format/datefromat";
import { CirclePlus, Pencil, CircleDollarSign, Eye, CircleMinus } from "lucide-react";
import Swal from "sweetalert2";
import { getUserFromToken } from "../../../Utils/TokenVerify";

const AdminUser = () => {

  const [modal, setModal] = useState(false);
  const [balance, setBalance] = useState("");
  const [type, setType] = useState("");
  const [ids, setID] = useState("");
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);


  const TokenData = getUserFromToken();


  const user_id = TokenData?.user_id;


  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    getuserallhistory();
  }, [id]);

  const finalReason = reason === "Other" ? customReason : reason;

  const updateBalance = async () => {
    try {

      if (!balance || isNaN(balance) || parseFloat(balance) <= 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter a valid number greater than zero for the balance.",
        });
        return;
      }

      if (!finalReason) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter a valid Reason",
        });
        return;
      }

      // Show confirmation popup
      const confirmation = await Swal.fire({
        title: "Confirm Update",
        text: `Are you sure you want to update the balance to ${balance}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
      });

      // Proceed only if user confirms
      if (confirmation.isConfirmed) {
        const response = await Addbalance({
          id: ids,
          Balance: balance,
          parent_Id: user_id,
          Type: type,
          reason: finalReason
        });

        // Handle API response
        if (response.status) {
          Swal.fire({
            icon: "success",
            title: "Balance Updated",
            text:
              response.message || "The balance has been updated successfully.",
          });


          setModal(false);
          setBalance("");
          setReason("")
          setCustomReason("")
          getuserallhistory()

        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              response.message ||
              "An error occurred while updating the balance.",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "An unexpected error occurred.",
      });
    }
  };



  const columns = [
    { Header: "FullName", accessor: "FullName" },
    { Header: "UserName", accessor: "UserName" },
    { Header: "Password", accessor: "Otp" },
    {
      Header: "pin",
      accessor: "pin",
      Cell: ({ cell }) => <span>{cell.value ? cell.value : "-"}</span>,
    },
    {
      Header: "Balance",
      accessor: "Balance",
      Cell: ({ cell }) => (
        <div
          style={{
            backgroundColor: "#E1FFED",
            color: "#33B469",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "500",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>

            <span style={{ fontWeight: "bold" }}>
              {parseFloat(cell.value).toFixed(2)}
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <CirclePlus
              size={20}
              style={{
                color: "#22c55e",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onClick={() => {
                setModal(true);
                setID(cell.row._id);
                setType("CREDIT");
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <CircleMinus
              size={20}
              style={{
                color: "#ef4444",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onClick={() => {
                setModal(true);
                setID(cell.row._id);
                setType("DEBIT");
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>
      ),
    },
    {
      Header: "ActiveStatus",
      accessor: "ActiveStatus",
      Cell: ({ cell }) => (
        <span
          style={{
            height: "15px",
            width: "15px",
            backgroundColor: cell.value == 1 ? "green" : "red",
            borderRadius: "50%",
            display: "inline-block",
          }}
        ></span>
      ),
    },
    { Header: "PhoneNo", accessor: "PhoneNo" },
    {
      Header: "createdAt",
      accessor: "createdAt",
      Cell: ({ cell }) => {
        return fDateTime(cell.value);
      },
    },
  ];


  const getuserallhistory = async () => {
    try {
      const data = { userid: id };
      const response = await getadminuserdetail(data);
      const filteruser =
        response.data &&
        response.data.filter((item) => {
          return item.Role === "USER";
        });
      setData(filteruser);
    } catch (error) {
      return error;
    }
  };


  useEffect(() => {
    if (searchTerm === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => {
        return (
          item?.FullName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          item?.UserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item?.PhoneNo?.toString().includes(searchTerm)
        );
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);


  return (
    <>
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card transaction-table">
                <div className="card-header border-0 flex-wrap pb-0">
                  <div className="mb-4">
                    <h4 className="card-title">Admin User</h4>
                  </div>
                  <Link
                    to="/superadmin/admin"
                    className="float-end mb-4 btn btn-primary"
                  >
                    <i className="fa-solid fa-arrow-left"></i> Back
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
                          defaultValue=""
                          style={{ width: "20%" }}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Table columns={columns} data={filteredData} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modal && (
        <div className="modal custom-modal d-block" id="add_vendor" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0"> {type == "CREDIT" ? "Credit Fund" : "Debit Fund"}</h4>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setModal(false);
                    setReason("");
                    setCustomReason("");
                    setBalance("");
                  }}
                ></button>
              </div>
              <div>
                <div className="modal-body">
                  <div className="row">
                    {/* Fund Input */}
                    <div className="col-lg-12 col-sm-12">
                      <div className="input-block mb-3">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter Fund"
                          onChange={(e) => {
                            let value = e.target.value;
                            if (Number(value) > 10000) {
                              value = "10000";
                            }
                            setBalance(value);
                          }}
                          value={balance}
                        />
                      </div>
                    </div>

                    {/* Reason Dropdown */}
                    <div className="col-lg-12 col-sm-12">
                      <div className="input-block mb-3">
                        <select
                          className="form-select"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        >
                          <option value="">Select Reason</option>
                          <option value="Profit Share">Profit Share</option>
                          <option value="Referral Bonus">Referral Bonus</option>
                          <option value="Manual Credit">Manual Credit</option>
                          <option value="Manual Debit">Manual Debit</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Show custom input if "Other" is selected */}
                    {reason === "Other" && (
                      <div className="col-lg-12 col-sm-12">
                        <div className="input-block mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Custom Reason"
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-back cancel-btn me-2"
                    onClick={() => {
                      setModal(false);
                      setReason("");
                      setCustomReason("");
                      setBalance("");
                    }}
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

export default AdminUser;
