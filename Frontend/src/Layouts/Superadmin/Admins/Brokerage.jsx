import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { getbrokerageData, GetBonus } from "../../../Services/Admin/Addmin";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddProfitMarginApi,
  getAllClient,
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
  const [adminData, setAdminData] = useState({});
  const [MarginLogs, setMarginLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [OpenModal, setOpenModal] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refresh, setRefresh] = useState(false);
  const [totalBrokerage, setTotalBrokerage] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [ProfitBalance, setProfitBalance] = useState(0);

  const columns = [
    { Header: "UserName", accessor: "UserName" },
    { Header: "Symbol", accessor: "symbol" },
    { Header: "Amount", accessor: "Amount" },
    { Header: "Brokerage", accessor: "brokerage" },
  ];

  const columnsForBonus = [
    { Header: "UserName", accessor: "username" },
    { Header: "Bonus", accessor: "Bonus" },
    { Header: "Type", accessor: "Type" },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ cell }) => fDateTimesec(cell.value),
    },
  ];

  useEffect(() => {
    fetchAllData();
  }, [refresh, search]); // Include search if you want it to refilter
  
  const fetchAllData = async () => {
    try {
      const [brokerageRes, bonusRes] = await Promise.all([
        getbrokerageData({ admin_id: id }),
        GetBonus({ admin_id: id }),
      ]);
  
      // ---- Handle Brokerage Data ----
      const structuredData = brokerageRes.data?.map((item) => ({
        UserName: item.UserName,
        ...item.balance_data,
      })) || [];
  
      const filteredData = structuredData
        .map((item) => ({
          UserName: item.UserName,
          symbol: item.symbol,
          Amount: item.Amount,
          brokerage: item.brokerage,
        }))
        .filter(
          (item) =>
            !search || item.symbol?.toLowerCase().includes(search.toLowerCase())
        );
  
      const brokerageTotal = structuredData.reduce(
        (acc, item) => acc + Number(item.brokerage || 0),
        0
      );
  
      setData(filteredData);
  
      // ---- Handle Bonus Data ----
      const bonusList = bonusRes.data || [];
      const bonusTotal = bonusList.reduce(
        (acc, item) => acc + Number(item.Bonus || 0),
        0
      );
  
      setBonusData(bonusList);
      setProfitBalance(Number(bonusRes.CompletedBrokrageandBonus || 0));
  
      // ---- Set Total Brokerage Once ----
      setTotalBrokerage(brokerageTotal + bonusTotal);
  
    } catch (err) {
      Swal.fire("Error", "Failed to fetch data. Please try again.", "error");
    }
  };
  


  const fetchMarginLogs = async () => {
    try {
      const res = await getProfitMarginApi({ admin_id: id });
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

    try {
      Swal.fire({
        title: "Clearing Brokerage...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await AddProfitMarginApi({
        adminid: id,
        balance: amountToClear,
      });

      if (res.status) {
        Swal.fire(
          "Success",
          `${amountToClear} Brokerage Cleared Successfully`,
          "success"
        );
        setRefresh(!refresh);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to clear brokerage.", "error");
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Brokerage</h4>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <span className="fw-bold">Total Brokerage: {totalBrokerage}</span>
            <span className="fw-bold">
              Our Brokerage: {totalBrokerage - ProfitBalance}
            </span>
            <span className="fw-bold">Completed: {ProfitBalance}</span>
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

          <Tabs defaultActiveKey="Brokerage" className="my-4" justify>
            <Tab eventKey="Brokerage" title="Brokerage">
              {data.length > 0 ? (
                <Table
                  columns={columns}
                  data={data}
                  rowsPerPage={rowsPerPage}
                />
              ) : (
                <p className="text-muted mt-3">No data available.</p>
              )}
            </Tab>
            <Tab eventKey="Bonus" title="Bonus">
              {bonusData.length > 0 ? (
                <Table
                  columns={columnsForBonus}
                  data={bonusData}
                  rowsPerPage={rowsPerPage}
                />
              ) : (
                <p className="text-muted mt-3">No data available.</p>
              )}
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
