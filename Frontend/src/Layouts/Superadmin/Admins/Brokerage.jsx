import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { getbrokerageData, GetBonus } from "../../../Services/Admin/Addmin";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddProfitMarginApi,
  GetAdminUsername,
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
    const [selectedAdmin, setSelectedAdmin] = useState("All");
    const [selectedAdminId, setSelectedAdminId] = useState("");
  const [adminUsername, setAdminUsername] = useState([]);
  

  const columns = [
    { Header: "UserName", accessor: "UserName" },
    { Header: "Symbol", accessor: "symbol" },
    { Header: "Amount", accessor: "Amount" },
    { Header: "Brokerage", accessor: "brokerage" },
    { Header: "Created At", accessor: "createdAt" ,  Cell: ({ cell }) => {
      return fDateTimesec(cell.value);
    }},
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
  }, [refresh, search, selectedAdmin]); // Include search if you want it to refilter
  
  const handleAdminFilterChange = (event) => {
     setSelectedAdmin(event.target.value);
     const selectedAdminObj = adminUsername.find(
       (admin) => admin.UserName === event.target.value
     );
     setSelectedAdminId(selectedAdminObj ? selectedAdminObj._id : "");
 
   };
 
   const fetchAllData = async () => {
     try {
       const [brokerageRes, bonusRes] = await Promise.all([
         getbrokerageData({ admin_id: selectedAdminId }),
         GetBonus({ admin_id: selectedAdminId }),
       ]);
   
       // ---- Handle Brokerage Data ----
       const structuredData = brokerageRes.data?.map((item) => ({
         UserName: item.UserName,
         ...item.balance_data,
       })) || [];
   
       const filteredData = structuredData
         .filter(
           (item) =>
             (!search || item.symbol?.toLowerCase().includes(search.toLowerCase())) &&
             (selectedAdmin === "All" || item.UserName === selectedAdmin)
         )
         .map((item) => ({
           UserName: item.UserName,
           symbol: item.symbol,
           Amount: item.Amount,
           brokerage: item.brokerage,
           createdAt: item.createdAt,
         }));
   
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
   
   const fetchAdminUsername = async () => {
     try {
       const res = await GetAdminUsername();
       setAdminUsername(res?.data);
     }
     catch (err) {
       console.error("Error fetching admin username", err);
     }
   };
 
   useEffect(() => {
     fetchAdminUsername(); 
   }, [])
  


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

    try {
    
      // ADD CONFIRM BOX HERE SWaL
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to clear ${amountToClear} brokerage. Do you want to proceed?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, clear it!",
        cancelButtonText: "No, cancel!",
      });
      if (!result.isConfirmed) {
        return; // User clicked "No", exit the function
      }


      const res = await AddProfitMarginApi({
        adminid: selectedAdminId,
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

        <div className="d-flex w-50 justify-content-between mb-3">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search by symbol"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              
              <select
                className="form-select"
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
           
                <Table
                  columns={columns}
                  data={data}
                  rowsPerPage={rowsPerPage}
                />
       
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

