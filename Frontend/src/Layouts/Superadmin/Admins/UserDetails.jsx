import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";
import { Getuserlistdata } from "../../../Services/Admin/Addmin";
import { Link } from "react-router-dom";
import { ArrowLeftRight, Eye, RotateCcw } from "lucide-react";
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
    const [status, setStatus] = useState("")
    const [input, setInput] = useState("")


    const handlerefresh = () => {
        setInput("")
        setStatus("")
        setUserNamed("")
        setUserId("")
    }


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
    }, [Userid, userNamed, input, status])


    const fetchUserList = async (Userid) => {
        try {
            const data = { adminid: Userid, userId: userNamed || "", status: Number(status), input: Number(input) || "" }
            const response = await Getuserlistdata(data);
            if (response?.status) {
                setUserNameList(response.data);
                setData(response.data);
            } else {
                setUserNameList([]);
                setData([]);
            }
        } catch (error) {
            console.error("User list fetch error:", error);
        }
    };



    // Table columns
    const columns = [
        { Header: "UserName", accessor: "UserName" },
        {
            Header: "Total Credit", accessor: "totalCredit",
            Cell: ({ cell }) => Number(cell.value)?.toFixed(2),
        },
        {
            Header: "Total Debit", accessor: "totalDebit",
            Cell: ({ cell }) => Number(cell.value)?.toFixed(2),
        },
        {
            Header: "Remaining Balance",
            accessor: "Balance",
            Cell: ({ cell }) => Number(cell.value)?.toFixed(2),
        },
        { Header: "Total Brokerage", accessor: "totalBrokerage" },
        {
            Header: "Realized P&L",
            accessor: "realizedPL",
            Cell: ({ cell }) => {
                const value = Number(cell?.value);
                return (
                    <span style={{ color: value < 0 ? 'red' : 'green' }}>
                        {!isNaN(value) ? value.toFixed(2) : "0.00"}
                    </span>
                );
            }
        },
        {
            Header: "Unrealized P&L",
            accessor: "unrealizedPL",
            Cell: ({ cell }) => {
                const value = Number(cell?.value);
                return (
                    <span style={{ color: value < 0 ? 'red' : 'green' }}>
                        {!isNaN(value) ? value.toFixed(2) : "0.00"}
                    </span>
                );
            }
        },

        {
            Header: "Trade History",
            accessor: "Trade History",
            Cell: ({ cell }) => {
                return (
                    <Link
                        to={`/superadmin/user-Trade-history/${cell.row._id}`}

                    >
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

                                        <div className="col-md-3">
                                            <label className="fw-bold mb-1">🛡️ Admin</label>
                                            <select
                                                className="form-select"
                                                onChange={(e) => { setUserId(e.target.value); setUserNamed("") }}
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


                                        <div className="col-md-3">
                                            <label className="fw-bold mb-1">👤 User</label>
                                            <select
                                                className="form-select"
                                                onChange={(e) => {
                                                    setUserNamed(e.target.value);


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
                                        <div className="col-md-2">
                                            <label className="fw-bold mb-1">🛡️ Select</label>
                                            <select
                                                className="form-select"
                                                onChange={(e) => setStatus(e.target.value)}
                                                value={status}
                                            >
                                                <option value="">Select</option>
                                                <option value="0">Less Than</option>
                                                <option value="1">Greater Than</option>
                                            </select>

                                        </div>
                                        <div className="col-md-2">
                                            <label className="fw-bold mb-1">Enter Value</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Enter number"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                            />

                                        </div>
                                        <div className="col-md-2  mt-5 ">
                                            <RotateCcw onClick={handlerefresh} />
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
