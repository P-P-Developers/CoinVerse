import React, { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import Table from "../../Utils/Table/Table";
import { getbrokerageData } from "../../Services/Admin/Addmin";
import {
  getAllClient,
  getProfitMarginApi,
} from "../../Services/Superadmin/Superadmin";

const Holdoff = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [adminData, setAdminData] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [completed, setCompleted] = useState(0);
  const [profitBalance, setProfitBalance] = useState(0);

  const columns = useMemo(
    () => [
      { Header: "UserName", accessor: "UserName" },
      { Header: "Symbol", accessor: "symbol" },
      { Header: "Amount", accessor: "Amount" },
      { Header: "Brokerage", accessor: "brokerage" },
    ],
    []
  );

  const fetchBrokerageData = async () => {
    try {
      const res = await getbrokerageData({ admin_id: user_id });

      const rawData =
        res?.data?.map((entry) => ({
          UserName: entry.UserName,
          ...entry.balance_data,
        })) || [];

      const filtered = rawData
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

      setData(filtered);
    } catch (error) {
      console.error("Error fetching brokerage data:", error);
      Swal.fire("Error", "Failed to fetch brokerage data.", "error");
    }
  };

  const fetchAdminDetails = async () => {
    try {
      const res = await getAllClient({ userid: user_id });
      if (res?.status) {
        setAdminData(res.data);
        setProfitBalance(Number(res.data.ProfitBalance || 0));
      }
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  const fetchMarginData = async () => {
    try {
      const res = await getProfitMarginApi({ admin_id: user_id });
      const total = res?.data?.reduce(
        (acc, item) => acc + Number(item.balance || 0),
        0
      );
      setCompleted(total);
    } catch (error) {
      console.error("Error fetching margin data:", error);
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchBrokerageData();
      fetchAdminDetails();
      fetchMarginData();
    }
  }, [user_id, search]);

  const totalBrokerage = useMemo(
    () => data.reduce((acc, item) => acc + Number(item.brokerage || 0), 0),
    [data]
  );

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
              {/* Total Brokerage Card */}
              <div className="col-md-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h6 className="card-title fw-bold mb-2">Total Brokerage</h6>
                    <input
                      type="text"
                      className="form-control"
                      value={totalBrokerage.toFixed(5)}
                      disabled
                    />
                  </div>
                </div>
              </div>
  
              {/* Remaining Card */}
              <div className="col-md-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h6 className="card-title fw-bold mb-2">Remaining</h6>
                    <input
                      type="text"
                      className="form-control"
                      value={(completed - profitBalance).toFixed(2)}
                      disabled
                    />
                  </div>
                </div>
              </div>
  
              {/* Completed Card */}
              <div className="col-md-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h6 className="card-title fw-bold mb-2">Completed</h6>
                    <input
                      type="text"
                      className="form-control"
                      value={completed.toFixed(2)}
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
                <p className="mt-3">Bonus content will go here.</p>
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
