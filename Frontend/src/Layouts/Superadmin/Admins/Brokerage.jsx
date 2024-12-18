import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { getbrokerageData } from "../../../Services/Admin/Addmin";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddProfitMarginApi,
  getAllClient,
  getProfitMarginApi,
} from "../../../Services/Superadmin/Superadmin";

const Brokerage = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;
  let { id } = useParams();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [adminData, setAdminData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [MarginLogs, setMarginLogs] = useState([]);
  const [OpenModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const Profit_Margin = adminData?.ProfitMargin || 1; // Avoid division by zero
  const ProfitBalance = adminData?.ProfitBalance || 0;

  useEffect(() => {
    Symbolholdoff();
    GetAdminDetails();
    GetAllMarginData();
  }, [refresh]);

  const columns = [
    { Header: "UserName", accessor: "UserName" },
    { Header: "Symbol", accessor: "symbol" },
    { Header: "Amount", accessor: "Amount" },
    { Header: "Brokerage", accessor: "brokerage" },
  ];

  const GetAdminDetails = async () => {
    try {
      const data = { userid: id };
      const res = await getAllClient(data);
      if (res.status) {
        setAdminData(res.data);
      }
    } catch (err) {
      console.error("Error in getting admin details", err);
    }
  };

  const GetAllMarginData = async () => {
    try {
      const res = await getProfitMarginApi({ admin_id: id });
      if (res.status) {
        setMarginLogs(res.data);
      }
    } catch (err) {
      console.error("Error in getting margin data", err);
    }
  };

  const Symbolholdoff = async () => {
    try {
      const requestData = { admin_id: id };
      const apiResponse = await getbrokerageData(requestData);

      const CreateDaynamicData =
        apiResponse.data?.map((data) => ({
          UserName: data.UserName,
          ...data.balance_data,
        })) || [];

      const searchfilter = CreateDaynamicData.map((item) => ({
        UserName: item.UserName,
        symbol: item.symbol,
        exch_seg: item.symbol_id || "N/A",
        lotsize: item.parent_Id || "N/A",
        Amount: item.Amount,
        brokerage: item.brokerage,
        ActiveStatus: item.Amount > 0 ? 1 : 0,
      })).filter(
        (item) =>
          search === "" ||
          item.symbol?.toLowerCase().includes(search.toLowerCase())
      );

      setData(search ? searchfilter : CreateDaynamicData);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch data. Please try again.", "error");
    }
  };

  const ReedeemBrokerage = async () => {
    const totalBrokerage = data.reduce(
      (acc, item) => acc + Number(item.brokerage || 0),
      0
    );

    // const result = (totalBrokerage / Profit_Margin - ProfitBalance).toFixed(5);

    let result = (
      data.reduce(
        (acc, item) => acc + Number(item.brokerage || 0),
        0
      ) / (Profit_Margin / 100)  // Convert percentage to decimal
    ).toFixed(5);

    result = result - ProfitBalance;
    console.log(result);



    if (result < 0) {
      Swal.fire("Error", "Brokerage is less than the profit margin", "error");
      return;
    }

    const data1 = { adminid: id, balance: result };
    try {
      const res = await AddProfitMarginApi(data1);
      if (res.status) {
        Swal.fire("Success", "Brokerage Cleared Successfully", "success");
        setRefresh(!refresh);
      }
    } catch (err) {
      Swal.fire(
        "Error",
        "Failed to clear brokerage. Please try again.",
        "error"
      );
    }
  };

  const result = (
    data.reduce(
      (acc, item) => acc + Number(item.brokerage || 0),
      0
    ) / (Profit_Margin / 100)  // Convert percentage to decimal
  ).toFixed(5);

  console.log(result);


  return (
    <>
      <div className="container-fluid py-4">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Brokerage</h4>
            {/* <input
              type="text"
              placeholder="Search..."
              className="form-control w-25"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            /> */}


            {/*Serach is removed and back btn added */}
            <button
              className="btn btn-secondary"
              style={{ backgroundColor: "#3736AF", borderColor: "#3736AF" }} // Apply the color
              onClick={() => navigate(-1)} // Navigate to the previous page
            >
              Back
            </button>


          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-bold">
                Total Brokerage:{" "}
                {data.reduce(
                  (acc, item) => acc + Number(item.brokerage || 0),
                  0
                ).toFixed(5)}
              </span>
              <span className="fw-bold">
                Total Our Brokerage:{" "}
                {(result - ProfitBalance
                ).toFixed(5)}
              </span>
              <span className="fw-bold">Completed: {ProfitBalance}</span>
              <button
                className="btn btn-primary"
                onClick={() => setOpenModal(!OpenModal)}
              >
                Logs
              </button>
              <button className="btn btn-success" onClick={ReedeemBrokerage}>
                Clear All Brokerage
              </button>
            </div>
            <Table columns={columns} data={data} />
          </div>
        </div>
        {OpenModal && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reedeem Logs</h5>
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
                          <td>{log.createdAt}</td>
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
    </>
  );
};

export default Brokerage;
