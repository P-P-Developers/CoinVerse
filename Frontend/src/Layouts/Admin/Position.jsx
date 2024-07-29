import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { getpositionhistory } from "../../Services/Admin/Addmin";
import { fDateTime ,fDateTimesec} from "../../Utils/Date_format/datefromat";




const Position = () => {


  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;
  const Role = userDetails?.Role;


  const [data, setData] = useState([]);

  const columns = [
    { Header: "symbol", accessor: "symbol" },

    {
        Header: "Buy Time",
        accessor: "buy_time",
        Cell: ({ cell }) => {
          const buyTime = cell.row.buy_time; 
          return buyTime ? fDateTime(buyTime) : "-"; 
        }
      },
    { Header: "sell_time", accessor: "sell_time",
        Cell: ({ cell }) => {
            const sell_time = cell.row.sell_time; 
            return sell_time ? fDateTime(sell_time) : "-"; 
          }
    },
    {
      Header: "Create Date",
      accessor: "createdAt",
      Cell: ({ cell }) => {
        return fDateTimesec((cell.value))

      },
    },

  ];



  // getting data
  const getuserallhistory = async () => {
    try {
       const data = {userid:user_id,Role:Role}
      const response = await getpositionhistory(data);
      setData(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getuserallhistory();
  }, []);



  return (
    <>
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card transaction-table">
                <div className="card-header border-0 flex-wrap pb-0">
                  <div className="mb-4">
                    <h4 className="card-title">transaction History</h4>
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
                      <div className='mb-3 ms-4'>
                        Search :{" "}
                        <input
                          className="ml-2 input-search form-control"
                          defaultValue=""
                          style={{ width: "20%" }}
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
