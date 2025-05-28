import React, { useState, useEffect } from "react";
import { getAllClient } from "../../../Services/Superadmin/Superadmin";
import { UpdateRefferPrice } from "../../../Services/Admin/Addmin";
import Swal from "sweetalert2";
import { getReferClients } from "../../../Services/Admin/Addmin";
import Table from "../../../Utils/Table/Table";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";
import { useFormik } from "formik"; // Ensure Formik is imported
import { getUserFromToken } from "../../../Utils/TokenVerify";

const Basicsetting = () => {
  const TokenData = getUserFromToken();

  const user_id = TokenData?.user_id;

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ranges, setRanges] = useState({
    range1: "",
    range2: "",
    range3: "",
    range4: "",
  });

  const columns = [
    // { Header: "FullName", accessor: "FullName" },
    { Header: "UserName", accessor: "UserName" },
    { Header: "Password", accessor: "password" },
    {
      Header: "Referred By",
      accessor: "referred_by",
      Cell: ({ cell }) => {
        return cell.value
          ? cell.value === TokenData.user_id
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
        setRanges({
          range1: response?.data?.Range1 || "",
          range2: response?.data?.Range2 || "",
          range3: response?.data?.Range3 || "",
          range4: response?.data?.Range4 || "",
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    getallclient();
  }, []);

  const Update_RefferPrice = async (Range1, Range2, Range3, Range4) => {
    try {
      const data = { userId: user_id, Range1, Range2, Range3, Range4 };
      const response = await UpdateRefferPrice(data);
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.message,
        });

        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message,
        });
      }
    } catch (error) {}
  };

  const getsignupuser = async () => {
    try {
      const admin_id = TokenData?.user_id;
      const response = await getReferClients({ admin_id });
      const searchfilter = response.data?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.UserName &&
            item.UserName.toLowerCase().includes(search.toLowerCase()));
        return searchInputMatch;
      });
      setData(search ? searchfilter : response.data);
    } catch (error) {}
  };

  useEffect(() => {
    getsignupuser();
  }, [search]);

  const formik = useFormik({
    initialValues: {
      range1: ranges.range1, // Prefill with API data
      range2: ranges.range2,
      range3: ranges.range3,
      range4: ranges.range4,
    },
    enableReinitialize: true, // Allow reinitialization when state changes
    onSubmit: (values) => {
      Update_RefferPrice(
        values.range1,
        values.range2,
        values.range3,
        values.range4
      );
    },
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card transaction-table">
            <div className="card-header border-0 flex-wrap pb-0">
              <h4 className="card-title d-flex align-items-center gap-2">
                Refer And Earn
                <span
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    const tooltip = document.createElement("div");
                
                    tooltip.className = "custom-tooltip";
                    tooltip.innerText =
                      "We have a functionality to set referral bonuses. For example: if the referred user's balance is between $50–$100 and you set it to $10, then you will earn $10 as a referral bonus. Similarly, you can set bonuses for balances between $100–$500, $500–$1000, and above $1000.";
                    tooltip.style.position = "absolute";
                    tooltip.style.backgroundColor = "#001f3f"; // Dark/Navy Blue
                    tooltip.style.color = "#fff"; // White text
                    tooltip.style.border = "1px solid #ccc";
                    tooltip.style.padding = "10px";
                    tooltip.style.borderRadius = "5px";
                    tooltip.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                    tooltip.style.zIndex = "1000";
                    tooltip.style.top = `${
                      e.target.getBoundingClientRect().top + window.scrollY + 20
                    }px`;
                    tooltip.style.left = `${
                      e.target.getBoundingClientRect().left + window.scrollX
                    }px`;
                    document.body.appendChild(tooltip);
                    e.target.tooltipElement = tooltip;
                  }}
                  onMouseLeave={(e) => {
                    if (e.target.tooltipElement) {
                      document.body.removeChild(e.target.tooltipElement);
                      e.target.tooltipElement = null;
                    }
                  }}
                >
                  ℹ️
                </span>
              </h4>
            </div>
            <div className="card profile-card card-bx">
              <div className="profile-form">
                <div className="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label className="form-label fw-bold" htmlFor="range1">
      Earn ($) when user deposits between 50 and 99
    </label>
                        <input
                          id="range1"
                          type="number"
                          className="form-control"
                          placeholder="Enter value for 50 < 100"
                          {...formik.getFieldProps("range1")}
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label fw-bold" htmlFor="range2">
                          Earn ($) when user deposits between 100 and 499
                        </label>
                        <input
                          id="range2"
                          type="number"
                          className="form-control"
                          placeholder="Enter value for 100 < 500"
                          {...formik.getFieldProps("range2")}
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label fw-bold" htmlFor="range3">
                            Earn ($) when user deposits between 500 and 999
                        </label>
                        <input
                          id="range3"
                          type="number"
                          className="form-control"
                          placeholder="Enter value for 500 < 1000"
                          {...formik.getFieldProps("range3")}
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label fw-bold" htmlFor="range4">
                           Earn ($) when user deposits 1000 or more
                        </label>
                        <input
                          id="range4"
                          type="number"
                          className="form-control"
                          placeholder="Enter value for > 1000"
                          {...formik.getFieldProps("range4")}
                        />
                      </div>
                      <div className="col-lg-12">
                        <button className="btn btn-primary w-25" type="submit">
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="row">
                    <div className="col-lg-12">
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
