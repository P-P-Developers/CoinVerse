import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { getpositionhistory } from "../../Services/Admin/Addmin";
import { fDateTime ,fDateTimesec} from "../../Utils/Date_format/datefromat";
import {getEmployeeUserposition } from "../../Services/Employee/Employee";




const Position = () => {


  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;
  const Role = userDetails?.Role;


  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  


  const columns = [
    { Header: "symbol", accessor: "symbol" },
    {
      Header: "Buy qty",
      accessor: "buy_qty",
      Cell: ({ cell }) => {
        const buy_qty = cell.row.buy_qty; 
        return buy_qty ? buy_qty : "-"; 
      }
    },
    {
      Header: "Sell qty",
      accessor: "sell_qty",
      Cell: ({ cell }) => {
        const sell_qty = cell.row.sell_qty; 
        return sell_qty ? sell_qty : "-"; 
      }
    },
    {
      Header: "Position Avg",
      accessor: "Position Avg",
      Cell: ({ cell }) => {
        const { sell_qty, buy_qty } = cell.row; 
        const availablePosition = buy_qty - sell_qty;
        return (
          <span>{availablePosition}</span>
        );
      },
    },

  ];




  // getting data
  const getuserallhistory = async () => {
    try {
      const data = { userid: user_id };
      const response = await getEmployeeUserposition(data);
      const filterdata = response.data && response.data.filter((item) => {
        return item.buy_qty !== item.sell_qty;
      });
      const searchfilter = filterdata?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.symbol && item.symbol.toLowerCase().includes(search.toLowerCase()));
  
        return searchInputMatch;
      });
      setData(search ? searchfilter : filterdata);
    } catch (error) {
   
    }
  };
  

  useEffect(() => {
      getuserallhistory();
  }, [search]);
  



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
                      <Table columns={columns} data={data && data} />
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
