import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { fDateTimesec } from "../../../Utils/Date_format/datefromat";
import Table from "../../../Utils/Table/Table";
import { GetBonus, getbrokerageData } from "../../../Services/Admin/Addmin";
import { getProfitMarginApi } from "../../../Services/Superadmin/Superadmin";
import { getUserFromToken } from "../../../Utils/TokenVerify";

const BonusAndBrokerage = () => {
  const TokenData = getUserFromToken();
  const user_id = TokenData?.user_id;

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [completed, setCompleted] = useState(0);
  const [bonusData, setBonusData] = useState([]);
  const [totalBrokerage, setTotalBrokerage] = useState(0);

  const columns = [
    { Header: "UserName", accessor: "UserName" },
    { Header: "Symbol", accessor: "symbol" },
    {
      Header: "Amount",
      accessor: "Amount",
      Cell: ({ cell }) => cell.value?.toFixed(3) || "-",
    },
    { Header: "Brokerage", accessor: "brokerage" },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ cell }) => fDateTimesec(cell.value),
    },
  ];

  const columnsForBonus = [
    { Header: "UserName", accessor: "username" },
    {
      Header: "Bonus",
      accessor: "Bonus",
      Cell: ({ cell }) => cell.value?.toFixed(3) || "-",
    },
    {
      Header: "Type",
      accessor: "Type",
      Cell: ({ cell }) => {
        const typeMap = {
          Fund_Add: "Deposit Bonus",
          Fixed_PerClient: "Per Client Bonus",
          Every_Transaction: "Per Transaction Bonus",
        };
        return typeMap[cell.value] || cell.value;
      },
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ cell }) => fDateTimesec(cell.value),
    },
  ];

  useEffect(() => {
    fetchAllData();
  }, [search]);

  useEffect(() => {
    if (user_id) fetchMarginData();
  }, [user_id]);

  const fetchAllData = async () => {
    try {
      const [brokerageRes, bonusRes] = await Promise.all([
        getbrokerageData({ admin_id: user_id }),
        GetBonus({ admin_id: user_id }),
      ]);

      setCompleted(bonusRes?.CompletedBrokrageandBonus || 0);

      const structuredData =
        brokerageRes.data?.map((item) => ({
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

      setData(filteredData);

      const bonusList = bonusRes.data || [];
      setBonusData(bonusList);

      const totalBrokerageVal =
        structuredData.reduce(
          (acc, item) => acc + Number(item.brokerage || 0),
          0
        ) + bonusList.reduce((acc, item) => acc + Number(item.Bonus || 0), 0);

      setTotalBrokerage(totalBrokerageVal);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch data. Please try again.", "error");
    }
  };

  const fetchMarginData = async () => {
    try {
      const res = await getProfitMarginApi({ admin_id: user_id });
      // Not used in UI, can be added later
    } catch (error) {}
  };

  return (
    <div className="container-fluid py-3">
      <div className="card shadow-sm">
        <div className="card-body">
          {/* Search Input */}
          <div className="mb-3">
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
          <div className="row mb-3">
            {[
              { label: "Total Brokerage", value: totalBrokerage },
              { label: "Remaining", value: totalBrokerage - completed },
              { label: "Completed", value: completed },
            ].map((item, idx) => (
              <div key={idx} className="col-md-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body py-3">
                    <h6 className="mb-1 fw-bold">{item.label}</h6>
                    <div className="form-control-plaintext fw-semibold">
                      {item.value.toFixed(3)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs Section */}
          <Tabs defaultActiveKey="Brokerage" className="mb-3" justify>
            <Tab eventKey="Brokerage" title="Brokerage">
              <Table columns={columns} data={data} rowsPerPage={rowsPerPage} />
              <div className="d-flex align-items-center gap-2 mt-2">
                <span className="fw-semibold">Rows per page:</span>
                <select
                  className="form-select"
                  style={{ width: "100px" }}
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
            </Tab>

            <Tab eventKey="Bonus" title="Bonus">
              <Table
                columns={columnsForBonus}
                data={bonusData}
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
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  style={{ width: "auto", marginLeft: "10px" }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={50}>100</option>
                </select>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BonusAndBrokerage;
