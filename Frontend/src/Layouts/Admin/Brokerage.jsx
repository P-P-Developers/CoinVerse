import React, { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { fDateTimesec } from "../../Utils/Date_format/datefromat";

import Table from "../../Utils/Table/Table";
import { GetBonus, getbrokerageData } from "../../Services/Admin/Addmin";
import {
  getProfitMarginApi,
} from "../../Services/Superadmin/Superadmin";

const Holdoff = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [completed, setCompleted] = useState(0);
  const [profitBalance, setProfitBalance] = useState(0);
  const [bonusData, setBonusData] = useState([]);

  const [totalBrokerage, setTotalBrokerage] = useState(0);

  const columns =  [
      { Header: "UserName", accessor: "UserName" },
      { Header: "Symbol", accessor: "symbol" },
      { Header: "Amount", accessor: "Amount" },
      { Header: "Brokerage", accessor: "brokerage" },
      { Header: "Created At", accessor: "createdAt" ,  Cell: ({ cell }) => {
        return fDateTimesec(cell.value);
      }},
    ]
    

  const columnsForBonus =  [
      { Header: "UserName", accessor: "username" },
      { Header: "Bonus", accessor: "Bonus" },
      {
        Header: "Type",
        accessor: "Type",
        Cell: ({ cell }) => {
          const typeMap = {
            Fund_Add: "Deposit Bonus",
            Fixed_PerClient: "Per Client Bonus",
            Every_Transaction: "Per Transaction Bonus"
          };
          return typeMap[cell.value] || cell.value; // fallback to original if not found
        }
      },      
      { Header: "Created At", accessor: "createdAt" ,  Cell: ({ cell }) => {
        return fDateTimesec(cell.value);
      }},
    ]


  useEffect(() => {
    fetchAllData();
  }, [search]); // Include search if you want it to refilter
  
  const fetchAllData = async () => {
    try {
      const [brokerageRes, bonusRes] = await Promise.all([
        getbrokerageData({ admin_id: user_id }),
        GetBonus({ admin_id: user_id }),
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
          createdAt: item.createdAt,
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
  



  const fetchMarginData = async () => {
    try {
      const res = await getProfitMarginApi({ admin_id: user_id });
      const total = res?.data?.reduce(
        (acc, item) => acc + Number(item.balance || 0),
        0
      );
  
      setProfitBalance(Number(res.ProfitBalanceTotal || 0));

    } catch (error) {
      console.error("Error fetching margin data:", error);
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchMarginData();
    }
  }, [user_id, search]);



  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <div className="card shadow-sm">
            <div className="card-header border-0 d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Brokerage & Bonus</h4>
            </div>

            <div className="card-body">
              {/* Search Input */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Search by Symbol:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ maxWidth: "300px" }}
                />
              </div>

              {/* Summary Cards */}
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body">
                      <h6 className="card-title fw-bold mb-2">Total Brokerage</h6>
                      <input
                        type="text"
                        className="form-control"
                        value={totalBrokerage}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body">
                      <h6 className="card-title fw-bold mb-2">Remaining</h6>
                      <input
                        type="text"
                        className="form-control"
                        value={(totalBrokerage - completed)}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body">
                      <h6 className="card-title fw-bold mb-2">Completed</h6>
                      <input
                        type="text"
                        className="form-control"
                        value={completed}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <Tabs defaultActiveKey="Brokerage" className="my-4" justify>
                <Tab eventKey="Brokerage" title="Brokerage">
                  {data.length > 0 ? (
                    <Table columns={columns} data={data} rowsPerPage={rowsPerPage} />
                  ) : (
                    <p className="text-muted mt-3">No data available.</p>
                  )}
                </Tab>

                <Tab eventKey="Bonus" title="Bonus">
                  {bonusData.length > 0 ? (
                    <Table columns={columnsForBonus} data={bonusData} rowsPerPage={rowsPerPage} />
                  ) : (
                    <p className="text-muted mt-3">No data available.</p>
                  )}
                </Tab>
              </Tabs>

              {/* Rows Per Page Selector */}
              <div className="d-flex align-items-center mt-3">
                <span className="me-2 fw-medium">Rows per page:</span>
                <select
                  className="form-select"
                  style={{ width: "120px" }}
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                >
                  {[5, 10, 20, 50, 100].map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Holdoff;
