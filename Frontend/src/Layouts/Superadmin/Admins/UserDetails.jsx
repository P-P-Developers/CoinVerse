import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";
import { AllUserDetails, Getuserlistdata } from "../../../Services/Admin/Addmin";
import { Link } from "react-router-dom";
import { ArrowLeftRight, Eye } from "lucide-react";
import {
    getAdminName,
    switchOrderType,
} from "../../../Services/Superadmin/Superadmin";
import socket from "../../../Utils/socketClient";


const UserDetails = () => {
    const [data, setData] = useState([]);
    const [userName, setUserName] = useState([]);
    const [Userid, setUserId] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [userNameList, setUserNameList] = useState([]);
    const [userNamed, setUserNamed] = useState("");





    useEffect(() => {
        fetchAdminList();
    }, []);



    const fetchAdminList = async () => {
        try {
            const response = await getAdminName();
            if (response.status) {
                setUserName(response.data);

            }
        } catch (error) {
            console.error("Admin list fetch error:", error);
        }
    };

    useEffect(() => {
        fetchUserList(Userid)
    }, [Userid])



    const fetchUserList = async (Userid) => {
        try {
            const response = await Getuserlistdata({ adminid: Userid });
            if (response?.status) {
                setUserNameList(response.data);
            } else {
                setUserNameList([]);
            }
        } catch (error) {
            console.error("User list fetch error:", error);
        }
    };



    const AllusersDetails = async (id) => {
        try {
            const data = { userIds: id }
            const response = await AllUserDetails(data);
            if (response.status) {
                setData(response.data);


            }
        } catch (error) {
            console.error("Admin list fetch error:", error);
        }
    };





    // Table columns
    const columns = [
        { Header: "UserName", accessor: "UserName" },
        { Header: "Total Credit", accessor: "totalCredit" },
        { Header: "Total Debit", accessor: "totalDebit" },
        { Header: "Remaining Balance", accessor: "remainingBalance" },
        {
            Header: "Trade History",
            accessor: "Trade History",
            Cell: ({ row }) => {
                return (
                    // <Link to={`/superadmin/user-Trade-history/${row.original._id}`}>
                    //     <Eye style={{ cursor: "pointer", color: "#33B469" }} />
                    // </Link>
                    <Link to="/superadmin/user-Trade-history">
                        <Eye style={{ cursor: "pointer", color: "#33B469" }} />
                    </Link>
                );
            },
        }

    ];

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card transaction-table">
                        <div className="card-header border-0 flex-wrap pb-0 d-flex justify-content-between align-items-center">
                            <h4 className="card-title mb-0">All Users</h4>
                            <Link to="/admin/users" className="btn btn-primary">
                                <i className="fa-solid fa-arrow-left me-2"></i>Back
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
                                    <div className="row gx-3 gy-2 p-3">

                                        <div className="col-md-4">
                                            <label className="fw-bold mb-1">🛡️ Admin</label>
                                            <select
                                                className="form-select"
                                                onChange={(e) => setUserId(e.target.value)}
                                                value={Userid || ""}
                                            >
                                                <option value="">Select an admin</option>
                                                {userName.map((admin) => (
                                                    <option key={admin._id} value={admin._id}>
                                                        {admin.UserName}
                                                    </option>
                                                ))}
                                            </select>

                                        </div>

                                        {/* User Select */}
                                        <div className="col-md-4">
                                            <label className="fw-bold mb-1">👤 User</label>
                                            <select
                                                className="form-select"
                                                onChange={(e) => {
                                                    setUserNamed(e.target.value);
                                                    AllusersDetails(e.target.value);
                                                }}
                                                value={userNamed}
                                            >
                                                <option value="">Select a user</option>
                                                {userNameList?.map((user, index) => (
                                                    <option key={index} value={user._id}>
                                                        {user.UserName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="px-3">
                                        <Table
                                            columns={columns}
                                            data={data}
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
                                            Rows per page:
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
        </div>
    );
};

export default UserDetails;
