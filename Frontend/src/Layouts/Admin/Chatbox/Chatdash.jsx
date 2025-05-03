import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import ChatModal from "./../ChatModal";
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
  MessageCircle,
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

  const [refresh, setrefresh] = useState(false);

  const [loading, setLoading] = useState(false);

  const [checkprice, setCheckprice] = useState("");

  const [employeename, setEmployeename] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    {
      Header: "FullName",
      accessor: "FullName",
      Cell: ({ cell }) => (
        <>
          <strong>{`${cell.row.FullName}(${cell.row.UserName})`}</strong>
        </>
      ),
    },
  ];

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

      const filterusername =
        response.data &&
        response.data.filter((item) => {
          return item._id;
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

      setEmployeename(filterusername);
      setData(search ? searchfilter : result);
      setFilteredData(result);
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getAlluserdata();
  }, [search, refresh]);

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
    </>
  );
};

export default Users;
