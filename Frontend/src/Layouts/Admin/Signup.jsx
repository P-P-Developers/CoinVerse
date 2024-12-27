import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { fDateTime } from "../../Utils/Date_format/datefromat";
import { getSignIn } from "../../Services/Admin/Addmin";
import { Pencil } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

const Signup = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;
  const referralCode = userDetails?.ReferralCode;
  const referralLink = `${window.location.origin}/#/register?ref=${referralCode}`;
  
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentClient, setCurrentClient] = useState(null);
  const [search, setSearch] = useState("");

  const columns = [
    { Header: "FullName", accessor: "FullName" },
    { Header: "UserName", accessor: "UserName" },
    { Header: "Password", accessor: "password" },
    {
      Header: "Create Date",
      accessor: "createdAt",
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
              onClick={() => EditClient(cell.row._id)}
            />
          </div>
        );
      },
    },
  ];

  const EditClient = (rowId) => {
    const clientData = data.find((item) => item._id === rowId);
    navigate("/admin/adduser", { state: { clientData } });
  };

  const getsignupuser = async () => {
    try {
      const admin_id = userDetails?.user_id;
      const response = await getSignIn({admin_id});
      const searchfilter = response.data?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.UserName && item.UserName.toLowerCase().includes(search.toLowerCase()));
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
                    <h4 className="card-title">SingUp Request</h4>
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
                            style={{ width: "70%" }}
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
                              style={{ width: "300px" }}
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

export default Signup;
