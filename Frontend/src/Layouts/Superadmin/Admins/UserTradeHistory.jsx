import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";
import { gettradehistory } from "../../../Services/Admin/Addmin";
import { Link } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";
import {
    getAdminName,
    switchOrderType,
} from "../../../Services/Superadmin/Superadmin";
import socket from "../../../Utils/socketClient";


const UserTradeHistory = () => {


    const [data, setData] = useState([]);
    const [userName, setUserName] = useState();
    const [Userid, setUserId] = useState();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [Search, setSearch] = useState("");
    const [userNameList, setUserNameList] = useState([]);
    const [userNamed, setUserNamed] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [livePrices, setLivePrices] = useState({});
    const [prevPrices, setPrevPrices] = useState({});



    useEffect(() => {
        socket.on("receive_data_forex", (data) => {
            const symbol = data.data[1]?.toLowerCase();
            const price = Number(data.data[5]);
            if (symbol && !isNaN(price)) {
                setPrevPrices((prev) => ({
                    ...prev,
                    [symbol]: livePrices[symbol],
                }));
                setLivePrices((prev) => ({
                    ...prev,
                    [symbol]: price.toFixed(3),
                }));
            }
        });
        return () => {
            socket.off("receive_data_forex");
        };
    }, [livePrices]);



    useEffect(() => {
        GetUserName();
    }, []);



    useEffect(() => {
        getuserallhistory();
    }, [Userid, Search, userNamed, toDate, fromDate]);



    const getuserallhistory = async () => {
        try {
            if (Userid === undefined || Userid === null) {
                return;
            }

            const data = { adminid: Userid._id, toDate: toDate, fromDate: fromDate };
            const response = await gettradehistory(data);
            let UserNameListData = response.data.map((item) => {
                return item.userName;
            });

            setUserNameList([...new Set(UserNameListData)]);

            let filteredData = response.data;
            if (Search || userNamed) {
                filteredData = response.data.filter((item) => {
                    const userNameMatch = Search
                        ? item.userName.toLowerCase().includes(Search.toLowerCase())
                        : true;
                    const symbolMatch = Search
                        ? item.symbol.toLowerCase().includes(Search.toLowerCase())
                        : true;
                    const userNameListMatch = userNamed
                        ? item.userName.toLowerCase() === userNamed.toLowerCase()
                        : true;

                    return (userNameMatch || symbolMatch) && userNameListMatch;
                });
            }

            setData(filteredData);
        } catch (error) { }
    };


    const columns = [
        { Header: "UserName", accessor: "userName" },

        { Header: "Symbol", accessor: "symbol" },
        {
            Header: "Entry Price",
            accessor: "buy_price",
            Cell: ({ cell }) => {
                const buy_price = cell.row.buy_price;
                const signal_type = cell.row.signal_type;
                if (signal_type === "buy_sell") {
                    return buy_price ? buy_price.toFixed(4) : "-";
                } else {
                    return cell.row.sell_price ? cell.row.sell_price.toFixed(4) : "-";
                }
            },
        },
        {
            Header: "Exit Price",
            accessor: "sell_price",
            Cell: ({ cell }) => {
                const buy_price = cell.row.buy_price;
                const signal_type = cell.row.signal_type;
                if (signal_type === "sell_buy") {
                    return buy_price ? buy_price.toFixed(4) : livePrices[
                        cell.row.symbol?.toLowerCase()
                    ];
                } else {
                    return cell.row.sell_price ? cell.row.sell_price.toFixed(4) : livePrices[
                        cell.row.symbol?.toLowerCase()
                    ];
                }
            },
        },
        {
            Header: "P/L",
            accessor: "P/L",
            Cell: ({ cell }) => {
                const signal_type = cell.row.signal_type;
                const sellPrice = cell.row.sell_price;
                const buyPrice = cell.row.buy_price;
                const buyQty = cell.row.buy_qty;

                if (sellPrice && buyPrice && buyQty) {

                    const profitLoss = (sellPrice - buyPrice) * buyQty;
                    const formattedProfitLoss = profitLoss.toFixed(4);

                    const color = profitLoss > 0 ? "green" : "red";

                    return (
                        <span style={{ color }}>

                            {formattedProfitLoss}
                        </span>
                    );
                } else if (signal_type === "buy_sell") {
                    const livePrice = livePrices[cell.row.symbol?.toLowerCase()];
                    if (livePrice) {
                        const profitLoss = (livePrice - buyPrice) * cell.row.buy_qty;
                        const formattedProfitLoss = profitLoss.toFixed(4);
                        const color = profitLoss > 0 ? "green" : "red";
                        return <span style={{ color }}>{formattedProfitLoss}</span>;
                    }
                } else if (signal_type === "sell_buy") {
                    const livePrice = livePrices[cell.row.symbol?.toLowerCase()];
                    if (livePrice) {
                        const profitLoss = (cell.row.sell_price - livePrice) * cell.row.sell_lot;
                        const formattedProfitLoss = profitLoss.toFixed(4);
                        const color = profitLoss > 0 ? "green" : "red";
                        return <span style={{ color }}>{formattedProfitLoss}</span>;
                    }
                }

                return "-";
            },
        },
        {
            Header: "Entry lot",
            accessor: "buy_lot",
            Cell: ({ cell }) => {
                const signal_type = cell.row.signal_type;
                if (signal_type === "buy_sell") {
                    return cell.row.buy_lot ? cell.row.buy_lot : "-";
                } else {
                    return cell.row.sell_lot ? cell.row.sell_lot : "-";
                }
            },
        },
        {
            Header: "Exit lot",
            accessor: "sell_lot",
            Cell: ({ cell }) => {
                const signal_type = cell.row.signal_type;
                if (signal_type === "sell_buy") {
                    return cell.row.buy_lot ? cell.row.buy_lot : "-";
                } else {
                    return cell.row.sell_lot ? cell.row.sell_lot : "-";
                }
            },
        },
        {
            Header: "Signal Type",
            accessor: "signal_type",
            Cell: ({ cell }) => {
                const signal_type = cell.row.signal_type;

                // return signal_type ? signal_type == "buy_sell" ? "BUY" :"SELL" : "-";
                return (
                    <>
                        {signal_type === "buy_sell" ? (
                            <span style={{ color: "green" }}> BUY</span>
                        ) : signal_type === "sell_buy" ? (
                            <span style={{ color: "red" }}> SELL</span>
                        ) : (
                            <span style={{ color: "blue" }}> {signal_type}</span>
                        )}
                    </>
                );
            },
        },
        {
            Header: "Entry Time",
            accessor: "buy_time",
            Cell: ({ cell }) => {
                const signal_type = cell.row.signal_type;

                if (signal_type === "buy_sell") {
                    return cell.row.buy_time ? fDateTimesec(cell.row.buy_time) : "-";
                } else {
                    return cell.row.sell_time ? fDateTimesec(cell.row.sell_time) : "-";
                }
            },
        },
        {
            Header: "Exit time",
            accessor: "sell_time",
            Cell: ({ cell }) => {
                const signal_type = cell.row.signal_type;

                if (signal_type === "sell_buy") {
                    return cell.row.buy_time ? fDateTimesec(cell.row.buy_time) : "-";
                } else {
                    return cell.row.sell_time ? fDateTimesec(cell.row.sell_time) : "-";
                }
            },
        },
        {
            Header: "switch",
            accessor: "switch",
            Cell: ({ cell }) => {
                return (
                    <span onClick={(e) => ChangeTradeType(cell.row)}>
                        <ArrowLeftRight />
                    </span>
                );
            },
        },
    ];


    const GetUserName = async () => {
        try {
            const response = await getAdminName();
            if (response.status) {
                setUserName(response.data);
                setUserId(response.data[0]);
            }
        } catch (error) { }
    };


    const calculateTotalProfitLoss = () => {
        return data
            .reduce((total, row) => {
                const sellPrice = row.sell_price;
                const buyPrice = row.buy_price;
                const buyQty = row.buy_qty;
                const signal_type = row.signal_type;
                if (sellPrice && buyPrice && buyQty) {
                    return total + (sellPrice - buyPrice) * buyQty;

                }
                return total;
            }, 0)
            .toFixed(4);
    };


    const totalProfitLoss = calculateTotalProfitLoss();

    const ChangeTradeType = async (row) => {
        const data = { id: row._id };
        const response = await switchOrderType(data);

        if (response.status) {
            getuserallhistory();
        } else {
            alert("Error");
        }
    };

    return (
        <>
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card transaction-table">
                                <div className="card-header border-0 flex-wrap pb-0 d-flex justify-content-between align-items-center">
                                    <h4 className="card-title mb-0">📊 Trade History</h4>
                                    <Link to="/Superadmin/All-users" className="btn btn-primary">
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

                                                <div className="col-md-4 d-flex align-items-end">
                                                    <h3>
                                                        💰 Total Profit/Loss:{" "}
                                                        <span
                                                            style={{
                                                                color: totalProfitLoss > 0 ? "green" : "red",
                                                            }}
                                                        >
                                                            {totalProfitLoss}
                                                        </span>
                                                    </h3>
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
                                                    Rows per page:{" "}
                                                    <select
                                                        className="form-select ml-2"
                                                        value={rowsPerPage}
                                                        onChange={(e) =>
                                                            setRowsPerPage(Number(e.target.value))
                                                        }
                                                        style={{ width: "auto", marginLeft: "10px" }}
                                                    >
                                                        <option value={5}>5</option>
                                                        <option value={10}>10</option>
                                                        <option value={20}>20</option>
                                                        <option value={50}>50</option>
                                                        <option value={50}>100</option>
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
            </div>
        </>
    );
};

export default UserTradeHistory;
