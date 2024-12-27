// import React, { useEffect, useState } from "react";
// import Table from "../../Utils/Table/Table";
// import { getbrokerageData, symbolholdoff, updatesymbolstatus } from "../../Services/Admin/Addmin";
// import Swal from "sweetalert2";

// const Holdoff = () => {
//   const userDetails = JSON.parse(localStorage.getItem("user_details"));
//   const user_id = userDetails?.user_id;

//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");

//   const columns = [
//     { Header: "UserName", accessor: "UserName" },
//     { Header: "symbol", accessor: "symbol" },
//     { Header: "Amount", accessor: "Amount" },
//     { Header: "Brokerage", accessor: "brokerage" },
//   ];


//   const Symbolholdoff = async () => {
//     try {
//       const data = { admin_id: user_id };
//       const apiResponce = await getbrokerageData(data);  

//       let CreateDaynamicData = apiResponce.data && apiResponce.data.map((data)=>{
//         return {
//           UserName:data.UserName,
//           ...data.balance_data
//         }
//       })



//       const searchfilter = CreateDaynamicData?.map((item) => ({
//         UserName: item.UserName,
//         symbol: item.symbol,
//         exch_seg: item.symbol_id ? item.symbol_id : 'N/A',  
//         lotsize: item.parent_Id ? item.parent_Id : 'N/A', 
//         Amount: item.Amount,
//         brokerage: item.brokerage,
//         // brokerage: item.brokerage ? Number(item.brokerage).toFixed(5) : '0.00000', // Format brokerage to 5 decimal places
//         // brokerage: Number(item.brokerage).toFixed(5),
//         ActiveStatus: item.Amount > 0 ? 1 : 0, 
//       })).filter((item) => {

//         return search === "" || item.symbol?.toLowerCase().includes(search.toLowerCase());
//       });


//       setData(search ? searchfilter : CreateDaynamicData);

//     } catch (error) {
//       console.log("error", error);
//     }
//   };


//   useEffect(() => {
//     Symbolholdoff();


//   }, []);

//   return (
//     <>
//       <div>
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="card transaction-table">
//                 <div className="card-header border-0 flex-wrap pb-0">
//                   <div className="mb-4">
//                     <h4 className="card-title">Brokerage</h4>
//                   </div>
//                 </div>
//                 <div className="card-body p-0">
//                   <div className="tab-content" id="myTabContent1">
//                     <div
//                       className="tab-pane fade show active"
//                       id="Week"
//                       role="tabpanel"
//                       aria-labelledby="Week-tab"
//                     >
//                       <div className="mb-3 ms-4">
//                         Search :{" "}
//                         <input
//                           className="ml-2 input-search form-control"
//                           style={{ width: "20%" }}
//                           type="text"
//                           placeholder="Search..."
//                           value={search}
//                           onChange={(e) => setSearch(e.target.value)}
//                         />
//                       </div>

//                       {/* show total brokerage here  */}

//                       <div className="">Total Brokerage</div>
//                      {data && <Table columns={columns} data={data} />}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Holdoff;





// ____________Prev/safe code above  and below for work ____________

import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { getbrokerageData } from "../../Services/Admin/Addmin"; // Removed unused imports
import Swal from "sweetalert2";

const Holdoff = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;


  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const columns = [
    { Header: "UserName", accessor: "UserName" },
    { Header: "Symbol", accessor: "symbol" },
    { Header: "Amount", accessor: "Amount" },
    { Header: "Brokerage", accessor: "brokerage" },
  ];

  const Symbolholdoff = async () => {
    try {
      const requestData = { admin_id: user_id }; // Renamed for clarity
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
      })).filter((item) =>
        search === "" ||
        item.symbol?.toLowerCase().includes(search.toLowerCase())
      );
      console.log("LoggedIn AdminId is : ", user_id)

      setData(search ? searchfilter : CreateDaynamicData);
    } catch (error) {
      console.error("Error fetching brokerage data:", error);
      Swal.fire("Error", "Failed to fetch data. Please try again.", "error"); // Display error message
    }
  };

  useEffect(() => {
    Symbolholdoff();

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
                      <div className="mb-3 ms-4">
                        Search:{" "}
                        <input
                          className="ml-2 input-search form-control"
                          style={{ width: "20%" }}
                          type="text"
                          placeholder="Search..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3 ms-4">
                        {/* Total Brokerage */}
                        <div>
                          <span className="fw-bold">
                            Total Brokerage:{" "}
                            {data
                              .reduce((acc, item) => acc + Number(item.brokerage || 0), 0)
                              .toFixed(5)}
                          </span>
                        </div>

                        {/* Remaining */}
                        <div>
                          <span className="fw-bold">
                            Remaining: <input className="form-control d-inline w-auto ms-2" disabled />
                          </span>
                        </div>

                        {/* Completed */}
                        <div className="me-4">
                          <span className="fw-bold">
                            Completed: <input className="form-control d-inline w-auto ms-2" disabled />
                          </span>
                        </div>

                        {/* Clear All Button */}
                        {/* <div>
                          <button className="btn btn-primary me-3">Clear All</button>
                        </div> */}
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
