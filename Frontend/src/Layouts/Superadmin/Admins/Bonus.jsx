import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { getbrokerageData, GetBonus } from "../../../Services/Admin/Addmin";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddProfitMarginApi,
  GetAdminUsername,
  getProfitMarginApi,
  GetAdminBalanceWithPosition,
} from "../../../Services/Superadmin/Superadmin";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";

const Brokerage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [bonusData, setBonusData] = useState([]);
  const [MarginLogs, setMarginLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [OpenModal, setOpenModal] = useState(false);
  const [rowsPerPage] = useState(10);
  const [refresh, setRefresh] = useState(false);
  const [totalBrokerage, setTotalBrokerage] = useState(0);
  const [ProfitBalance, setProfitBalance] = useState(0);
  const [selectedAdminId, setSelectedAdminId] = useState({});
  const [adminUsername, setAdminUsername] = useState([]);
  const [activeTab, setActiveTab] = useState("Brokerage");

  const [BalanceData, setBalanceData] = useState({
    totalBalance: 0,
    totalOpenPosition: 0,
    totalUsersOpen: 0,
  });

  useEffect(() => {
    fetchAdminUsername();
  }, []);

  const fetchAdminUsername = async () => {
    try {
      const res = await GetAdminUsername();

      setAdminUsername(res?.data || []);
    } catch (err) {}
  };

  useEffect(() => {
    if (selectedAdminId && selectedAdminId._id) {
      fetchAllData();
    }
  }, [refresh, search, selectedAdminId]);

  useEffect(() => {
    if (selectedAdminId && selectedAdminId._id) {
      GetAdminBalanceWithPositionData();
    }
  }, [selectedAdminId]);

  const GetAdminBalanceWithPositionData = async () => {
    try {
      const res = await GetAdminBalanceWithPosition({
        admin_id: selectedAdminId._id,
      });
      if (res.status) {
        const {
          totalBalance,
          totalPnL,
          userCount,
          fixedBalance,
          remainingBalance,
          TotalAdminProfit,
        } = res.data;
        setBalanceData({
          totalBalance: totalBalance || 0,
          totalOpenPosition: totalPnL || 0,
          totalUsersOpen: userCount || 0,
          TotalAdminProfit: TotalAdminProfit || 0,

          fixedBalance: fixedBalance || 0,
          remainingBalance: remainingBalance || 0,
        });
      }
    } catch (err) {}
  };

  const columns = [
    { Header: "UserName", accessor: "UserName" },
    { Header: "Symbol", accessor: "symbol" },

    {
      Header: "Brokerage",
      accessor: "brokerage",
      Cell: ({ cell }) => {
        const value = parseFloat(cell.value);
        if (isNaN(value)) return "-";

        return Number.isInteger(value)
          ? value.toString()
          : value.toFixed(2).replace(/\.?0+$/, "");
      },
    },

    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ cell }) => (cell.value ? fDateTimesec(cell.value) : "-"),
    },
  ];

  const columnsForBonus = [
    { Header: "UserName", accessor: "username" },
    { Header: "Bonus", accessor: "Bonus" },
    { Header: "Type", accessor: "Type" },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ cell }) => (cell.value ? fDateTimesec(cell.value) : "-"),
    },
  ];

  const fetchAllData = async (adminId = selectedAdminId._id) => {
    if (!adminId) return;
    try {
      const [brokerageRes, bonusRes] = await Promise.all([
        getbrokerageData({ admin_id: adminId }),
        GetBonus({ admin_id: adminId }),
      ]);

      const brokerageData = brokerageRes.data || [];
      const bonusList = bonusRes.data || [];

      const searchLower = search.toLowerCase();

      const filteredBrokerage = brokerageData
        .map((item) => ({
          UserName: item.UserName,
          symbol: item.balance_data?.symbol || "",
          Amount: item.balance_data?.Amount || 0,
          brokerage: item.balance_data?.brokerage || 0,
          createdAt: item.balance_data?.createdAt || null,
        }))
        .filter(
          (item) =>
            item.symbol.toLowerCase().includes(searchLower) ||
            item.UserName.toLowerCase().includes(searchLower)
        );

      const filteredBonus = bonusList.filter(
        (item) =>
          item.username.toLowerCase().includes(searchLower) ||
          item.Type.toLowerCase().includes(searchLower)
      );

      setData(filteredBrokerage);
      setBonusData(filteredBonus);


  
    } catch (err) {
      Swal.fire("Error", "Failed to fetch data. Please try again.", "error");
    }
  };

  const fetchMarginLogs = async () => {
    try {
      const res = await getProfitMarginApi({ admin_id: selectedAdminId._id });
      if (res.status) {
        setMarginLogs(res.data);
      }
    } catch (err) {}
  };

  const clearBrokerage = async () => {
    let amountToClear = BalanceData.remainingBalance;
    if (amountToClear <= 0) {
      Swal.fire("Error", "No brokerage to clear.", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Clear Brokerage",
      text: `Enter amount to clear (max: ${BalanceData.remainingBalance})`,
      input: "number",
      inputAttributes: {
        min: 1,
        max: BalanceData.remainingBalance,
        step: 1,
      },
      showCancelButton: true,
      confirmButtonText: "Clear",
      cancelButtonText: "Cancel",
      preConfirm: (value) => {
        const amount = parseFloat(value);
        if (
          isNaN(amount) ||
          amount <= 0 ||
          amount > BalanceData.remainingBalance
        ) {
          Swal.showValidationMessage(
            `Please enter a valid amount between 1 and ${BalanceData.remainingBalance}`
          );
          return false;
        }
        return amount;
      },
    });

    if (!result.isConfirmed) return;

    amountToClear = result.value;

    try {
      const res = await AddProfitMarginApi({
        adminid: selectedAdminId._id,
        balance: amountToClear,
      });

      if (res.status) {
        Swal.fire(
          "Success",
          `${amountToClear} cleared successfully`,
          "success"
        );
        GetAdminBalanceWithPositionData();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to clear brokerage.", "error");
    }
  };

  const handleAdminFilterChange = (e) => {
    const value = e.target.value;

    const selected = adminUsername.find((admin) => admin.UserName === value);
    setSelectedAdminId(selected || {});
  };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        {/* Header */}
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{padding: "1rem 1.5rem" }}
        >
          <h2 className="mb-0 fw-bold">🎁 Bonus Panel</h2>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left me-2"></i> Back
          </button>
        </div>

        {/* Body */}
        <div className="card-body">
          {/* Filters */}
          <div className="row mb-4 align-items-end">
            {/* Search */}
            <div className="col-md-3 mb-2">
              <label htmlFor="searchInput" className="form-label fw-semibold">
                🔍 Search
              </label>
              <input
                id="searchInput"
                type="text"
                className="form-control"
                placeholder="Search by symbol or user"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Admin Filter */}
            <div className="col-md-3 mb-2">
              <label htmlFor="adminSelect" className="form-label fw-semibold">
                👤 Select Admin
              </label>
              <select
                id="adminSelect"
                className="form-select"
                value={selectedAdminId.UserName || ""}
                onChange={handleAdminFilterChange}
              >
                <option value="">All Admins</option>
                {adminUsername.map((admin, index) => (
                  <option key={index} value={admin.UserName}>
                    {admin.UserName}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="col-md-6 d-flex gap-2">
              <button
                className="btn btn-outline-info"
                onClick={() => {
                  setOpenModal(true);
                  fetchMarginLogs();
                }}
              >
                <i className="fa-solid fa-clock-rotate-left me-1"></i> View Logs
              </button>
              <button
                className="btn btn-outline-success"
                onClick={clearBrokerage}
              >
                <i className="fa-solid fa-broom me-1"></i> Clear All Bonus
              </button>
            </div>
          </div>

          {/* Bonus Summary */}
          <div
            className="d-flex justify-content-between flex-wrap gap-3 p-4  rounded border"
            style={{
              fontSize: "1.15rem",
              fontWeight: "600",
              color: "#212529",
              border: "1px solid #dcdcdc",
            }}
          >
            <div>
              <span style={{ color: "#007bff" }}>
                🎁 Total
                {selectedAdminId.brokerage && " Brokerage"}
                {selectedAdminId.bonus && " Bonus"}:
              </span>{" "}
              <span className="text-dark">{BalanceData.TotalAdminProfit}</span>
            </div>

            <div>
              <span style={{ color: "#fd7e14" }}>
                🏆 Our {selectedAdminId.brokerage && " Brokerage"}
                {selectedAdminId.bonus && " Bonus"}:
              </span>{" "}
              <span className="text-dark">
                {BalanceData.remainingBalance || 0}
              </span>
            </div>

            <div>
              <span style={{ color: "#28a745" }}>✅ Completed:</span>{" "}
              <span className="text-dark">{BalanceData.fixedBalance || 0}</span>
            </div>
          </div>

          {/* Balance Summary */}
          <div
            className="d-flex justify-content-between flex-wrap gap-3 mb-4 p-4  rounded border"
            style={{
              fontSize: "1.15rem",
              fontWeight: "600",
              color: "#212529",
              border: "1px solid #dcdcdc",
            }}
          >
            <div>
              <span style={{ color: "#007bff" }}>💰 Total Balance:</span>{" "}
              <span className="text-dark">{BalanceData.totalBalance}</span>
            </div>

            <div>
              <span style={{ color: "#fd7e14" }}>📈 Total Open Position:</span>{" "}
              <span className="text-dark">{BalanceData.totalOpenPosition}</span>
            </div>

            <div>
              <span style={{ color: "#28a745" }}>👤 Active Users:</span>{" "}
              <span className="text-dark">
                {BalanceData?.totalUsersOpen || 0}
              </span>
            </div>
          </div>

          {/* Tabs and Tables */}
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="my-4"
            justify
            style={{
              fontSize: "1.3rem", // Increased tab text size
              fontWeight: "700", // Bolder tab titles
              color: "#004085", // Professional dark blue
              borderBottom: "2px solid #dee2e6",
              letterSpacing: "0.3px", // Cleaner spacing
            }}
          >
            {selectedAdminId.brokerage && (
              <Tab
                eventKey="Brokerage"
                title={
                  <span style={{ fontSize: "1.3rem", fontWeight: "700" }}>
                    📊 Brokerage
                  </span>
                }
              >
                <div style={{ paddingTop: "1rem" }}>
                  <Table
                    columns={columns}
                    data={data}
                    rowsPerPage={rowsPerPage}
                    search={search}
                  />
                </div>
              </Tab>
            )}

            {selectedAdminId.bonus && (
              <Tab
                eventKey="Bonus"
                title={
                  <span style={{ fontSize: "1.3rem", fontWeight: "700" }}>
                    💸 Bonus
                  </span>
                }
              >
                <div style={{ paddingTop: "1rem" }}>
                  <Table
                    columns={columnsForBonus}
                    data={bonusData}
                    rowsPerPage={rowsPerPage}
                    search={search}
                  />
                </div>
              </Tab>
            )}
          </Tabs>
        </div>
      </div>

      {/* Modal (already well styled) */}
      {OpenModal && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              height: "100vh",
              width: "100vw",
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 1040,
            }}
          ></div>

          <div
            className="modal show fade d-block"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              style={{ maxWidth: "800px" }}
            >
              <div
                className="modal-content"
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                  border: "none",
                }}
              >
                <div
                  className="modal-header"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
                >
                  <h2 className="modal-title fw-bold">📝 Redeem Logs</h2>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {setMarginLogs([]); setOpenModal(false);}}
                  ></button>
                </div>
                <div className="modal-body">
                  <table className="table table-hover table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MarginLogs.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center text-muted">
                            No logs found.
                          </td>
                        </tr>
                      ) : (
                        MarginLogs.map((log, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              {log.balance ? log.balance: "-"}
                            </td>
                            <td>{fDateTimesec(log.createdAt)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Brokerage;
