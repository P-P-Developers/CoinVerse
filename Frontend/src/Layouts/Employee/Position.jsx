import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { getEmployeeUserposition } from "../../Services/Employee/Employee";
import { getUserFromToken } from "../../Utils/TokenVerify";

const Position = () => {
  const TokenData = getUserFromToken();

  const user_id = TokenData?.user_id;


  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);


 useEffect(() => {
    getuserallhistory();
  }, [search]);

  const columns = [
    { Header: "symbol", accessor: "symbol" },
    {
      Header: "Buy qty",
      accessor: "buy_qty",
      Cell: ({ cell }) => {
        const buy_qty = cell.row.buy_qty;
        return buy_qty ? buy_qty : "-";
      },
    },
    {
      Header: "Sell qty",
      accessor: "sell_qty",
      Cell: ({ cell }) => {
        const sell_qty = cell.row.sell_qty;
        return sell_qty ? sell_qty : "-";
      },
    },
    {
      Header: "Position Avg",
      accessor: "Position Avg",
      Cell: ({ cell }) => {
        const { sell_qty, buy_qty } = cell.row;
        const availablePosition = buy_qty - sell_qty;
        return <span>{availablePosition}</span>;
      },
    },
  ];

  // getting data
  const getuserallhistory = async () => {
    try {
      const data = { userid: user_id };
      const response = await getEmployeeUserposition(data);
      const filterdata =
        response.data &&
        response.data.filter((item) => {
          return item.buy_qty !== item.sell_qty;
        });
      const searchfilter = filterdata?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.symbol &&
            item.symbol.toLowerCase().includes(search.toLowerCase()));

        return searchInputMatch;
      });
      setData(search ? searchfilter : filterdata);
    } catch (error) {}
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
                    <h4 className="card-title">Position</h4>
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
                      <div className="mb-3 ms-4">
                        Search :{" "}
                        <input
                          className="ml-2 input-search form-control"
                          style={{ width: "20%" }}
                          type="text"
                          placeholder="Search..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <Table
                        columns={columns}
                        data={data && data}
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
                          <option value={100}>100</option>
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
    </>
  );
};

export default Position;
