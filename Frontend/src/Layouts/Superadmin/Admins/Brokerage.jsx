import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { getbrokerageData } from "../../../Services/Admin/Addmin"; // Removed unused imports
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import {
  AddProfitMarginApi,
  getAllClient,
} from "../../../Services/Superadmin/Superadmin";

const Holdoff = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;
  let { id } = useParams();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [adminData, setAdminData] = useState({});
  const [refresh, setRefresh] = useState(false);

  let Profit_Margin = adminData?.ProfitMargin;
  let ProfitBalance = adminData?.ProfitBalance;

  useEffect(() => {
    Symbolholdoff();
    GetAdminDetails();
  }, [refresh]);

  let GetAdminDetails = async () => {
    let data = {
      userid: id,
    };
    await getAllClient(data)
      .then((res) => {
        if (res.status) {
          setAdminData(res.data);
        }
      })
      .catch((err) => {
        console.log("Error in getting admin details", err);
      });
  };

  const columns = [
    { Header: "UserName", accessor: "UserName" },
    { Header: "Symbol", accessor: "symbol" },
    { Header: "Amount", accessor: "Amount" },
    { Header: "Brokerage", accessor: "brokerage" },
  ];

  const Symbolholdoff = async () => {
    try {
      const requestData = { admin_id: id }; // Renamed for clarity
      const apiResponse = await getbrokerageData(requestData);

      const CreateDaynamicData =
        apiResponse.data?.map((data) => ({
          UserName: data.UserName,
          ...data.balance_data,
        })) || []; // Ensure default value if no data is returned

      const searchfilter = CreateDaynamicData.map((item) => ({
        UserName: item.UserName,
        symbol: item.symbol,
        exch_seg: item.symbol_id || "N/A", // Simplified ternary operator
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
      Swal.fire("Error", "Failed to fetch data. Please try again.", "error"); // Display error message
    }
  };

  const ReedeemBrokerage = async () => {
    const totalBrokerage = data.reduce(
      (acc, item) => acc + Number(item.brokerage || 0),
      0
    );

    const result = (totalBrokerage / Profit_Margin - ProfitBalance).toFixed(5);

    if (result < 0) {
      Swal.fire("Error", "Brokerage is less than the profit margin", "error");
      return;
    }

    let data1 = {
      adminid: id,
      balance: result,
    };
    await AddProfitMarginApi(data1)
      .then((res) => {
        if (res.status) {
          Swal.fire("Success", "Brokerage Cleared Successfully", "success");
          setRefresh(!refresh);
        }
      })
      .catch((err) => {
        Swal.fire(
          "Error",
          "Failed to clear brokerage. Please try again.",
          "error"
        );
      });
  };

  return (
    <>
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card transaction-table">
                <div className="card-header border-0 flex-wrap pb-0">
                  <div className="mb-4">
                    <h4 className="card-title">Brokerage</h4>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="tab-content" id="myTabContent1">
                    <div
                      className="tab-pane fade show active"
                      id="Week"
                      role="tabpanel"
                      aria-labelledby="Week-tab"
                    >
                      {/* <div className="mb-3 ms-4">
                        Search:{" "}
                        <input
                          className="ml-2 input-search form-control"
                          style={{ width: "20%" }}
                          type="text"
                          placeholder="Search..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div> */}

                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3 ms-4">
                        {/* Total Brokerage */}
                        <div>
                          <span className="fw-bold">
                            Total Brokerage:{" "}
                            {data
                              .reduce(
                                (acc, item) =>
                                  acc + Number(item.brokerage || 0),
                                0
                              )
                              .toFixed(5)}
                          </span>
                        </div>
                        {/* Total  Our Brokerage */}
                        <div>
                          <span className="fw-bold">
                            Total Our Brokerage:{" "}
                            {(
                              data.reduce(
                                (acc, item) =>
                                  acc + Number(item.brokerage || 0),
                                0
                              ) /
                                Profit_Margin -
                              ProfitBalance
                            ).toFixed(5)}
                          </span>
                        </div>
                        {/* Completed */}
                        <div>
                          <span className="fw-bold">
                            Completed: {ProfitBalance}
                          </span>
                        </div>
                        Clear All Brokerage
                        <div>
                          <button
                            className="btn btn-primary me-3"
                            onClick={(e) => ReedeemBrokerage()}
                          >
                            Clear All
                          </button>
                        </div>
                      </div>

                      {data && <Table columns={columns} data={data} />}
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

export default Holdoff;
