import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import {
  getbrokerageData,
  GetBonus,
} from "../../../Services/Admin/Addmin";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddProfitMarginApi,
  GetAdminUsername,
  getProfitMarginApi,
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
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [adminUsername, setAdminUsername] = useState([]);
  const [activeTab, setActiveTab] = useState("Brokerage");

  useEffect(() => {
    fetchAdminUsername();
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [refresh, search, selectedAdmin]);

  const columns = [
    { Header: "UserName", accessor: "UserName" },
    { Header: "Symbol", accessor: "symbol" },
    { Header: "Amount", accessor: "Amount" },
    { Header: "Brokerage", accessor: "brokerage" },
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

  const fetchAllData = async () => {
    try {
      const [brokerageRes, bonusRes] = await Promise.all([
        getbrokerageData({ admin_id: selectedAdminId }),
        GetBonus({ admin_id: selectedAdminId }),
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

      const brokerageTotal = filteredBrokerage.reduce(
        (acc, item) => acc + Number(item.brokerage || 0),
        0
      );
      const bonusTotal = filteredBonus.reduce(
        (acc, item) => acc + Number(item.Bonus || 0),
        0
      );

      setProfitBalance(Number(bonusRes.CompletedBrokrageandBonus || 0));
      setTotalBrokerage(brokerageTotal + bonusTotal);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch data. Please try again.", "error");
    }
  };

  const fetchAdminUsername = async () => {
    try {
      const res = await GetAdminUsername();
      setAdminUsername(res?.data || []);
    } catch (err) {
      console.error("Error fetching admin username", err);
    }
  };

  const fetchMarginLogs = async () => {
    try {
      const res = await getProfitMarginApi({ admin_id: selectedAdminId });
      if (res.status) {
        setMarginLogs(res.data);
      }
    } catch (err) {
      console.error("Error fetching margin logs", err);
    }
  };

  const clearBrokerage = async () => {
    const amountToClear = totalBrokerage - ProfitBalance;
    if (amountToClear <= 0) {
      Swal.fire("Error", "No brokerage to clear.", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to clear ${amountToClear} brokerage.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await AddProfitMarginApi({
        adminid: selectedAdminId,
        balance: amountToClear,
      });

      if (res.status) {
        Swal.fire("Success", `${amountToClear} cleared successfully`, "success");
        setRefresh((prev) => !prev);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to clear brokerage.", "error");
    }
  };

  const handleAdminFilterChange = (e) => {
    const value = e.target.value;
    setSelectedAdmin(value);
    const selected = adminUsername.find((admin) => admin.UserName === value);
    setSelectedAdminId(selected?._id || "");
  };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Brokerage</h4>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
         <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>

        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search by symbol or user"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="form-select w-25"
              value={selectedAdmin}
              onChange={handleAdminFilterChange}
            >
              <option value="">Select Admin</option>
              {adminUsername.map((admin, index) => (
                <option key={index} value={admin.UserName}>
                  {admin.UserName}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <span className="fw-bold">Total Brokerage: {totalBrokerage}</span>
            <span className="fw-bold">
              Our Brokerage: {totalBrokerage - ProfitBalance}
            </span>
            <span className="fw-bold">Completed: {ProfitBalance}</span>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setOpenModal(true);
                  fetchMarginLogs();
                }}
              >
                Logs
              </button>
              <button className="btn btn-success" onClick={clearBrokerage}>
                Clear All Brokerage
              </button>
            </div>
          </div>

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="my-4"
            justify
          >
            <Tab eventKey="Brokerage" title="Brokerage">
              <Table columns={columns} data={data} rowsPerPage={rowsPerPage} />
            </Tab>
            <Tab eventKey="Bonus" title="Bonus">
              <Table
                columns={columnsForBonus}
                data={bonusData}
                rowsPerPage={rowsPerPage}
              />
            </Tab>
          </Tabs>
        </div>
      </div>

      {OpenModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Redeem Logs</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setOpenModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MarginLogs.map((log, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{log.balance}</td>
                        <td>{fDateTimesec(log.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brokerage;
