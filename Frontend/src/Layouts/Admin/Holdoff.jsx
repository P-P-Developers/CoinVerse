import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { symbolholdoff ,updatesymbolstatus } from "../../Services/Admin/Addmin";
import Swal from "sweetalert2";





const Holdoff = () => {


  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;



  const [data, setData] = useState([]);



  const columns = [
    { Header: "Symbol name", accessor: "symbol" },
    { Header: "exch_seg", accessor: "exch_seg" },
    { Header: "lotsize", accessor: "lotsize" },
    { Header: "Action", accessor: "Action" ,
        Cell: ({ cell }) => (
            <label className="form-check form-switch">
              <input
                id={`rating_${cell.row.symbol}`}
                className="form-check-input"
                type="checkbox"
                role="switch"
                onChange={(event) => updatestatus(event, cell.row.symbol)}
                defaultChecked={cell.row.status === 1}
              />
              <label
                htmlFor={`rating_${cell.row.status}`}
                className="checktoggle checkbox-bg"
              ></label>
            </label>
          ),

   },
  ];



  // update symbol status

  const updatestatus = async (event, symbol) => {
    try {
    
      const user_active_status = event.target.checked ? 1 : 0;
      const data = { symbol: symbol, status: user_active_status };

      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to ${user_active_status ? 'activate' : 'deactivate'} this symbol?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!',
        allowOutsideClick: false,
      });
  
      if (result.isConfirmed) {

        const response = await updatesymbolstatus(data);
        if (response && response.status) {
          Swal.fire(
            'Success!',
            `Symbol has been ${user_active_status ? 'activated' : 'deactivated'}.`,
            'success'
          );
        } else {
          throw new Error('Failed to update status.');
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire(
        'Error!',
        'There was a problem updating the status.',
        'error'
      );
    }
  };
  ;




  // getting data
  const Symbolholdoff = async () => {
    try {
      const response = await symbolholdoff({});

      setData(response.data);
    } catch (error) {
      console.log("error", error);
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
                    <h4 className="card-title">Hold off</h4>
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

export default Holdoff;
