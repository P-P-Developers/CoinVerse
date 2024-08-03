import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { symbolholdoff, updatesymbolstatus } from "../../Services/Admin/Addmin";
import Swal from "sweetalert2";

const Holdoff = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState([]);



  const columns = [
    { Header: "Symbol name", accessor: "symbol" },
    { Header: "exch_seg", accessor: "exch_seg" },
    { Header: "lotsize", accessor: "lotsize" },
    {
      Header: "ActiveStatus",
      accessor: "ActiveStatus",
      Cell: ({ cell }) => (
        <label className="form-check form-switch">
          <input
            id={`rating_${cell.row.status}`}
            className="form-check-input"
            type="checkbox"
            role="switch"
            onChange={(event) => updatestatus(event, cell.row.symbol)}
            defaultChecked={cell.row.status == 1}
          />
          <label
            htmlFor={`rating_${cell.row.status}`}
            className="checktoggle checkbox-bg"
          ></label>
        </label>
      ),
    },
  ];



  // Update symbol status
  const updatestatus = async (event, symbol) => {
    const user_active_status = event.target.checked ? 1 : 0;

    const result = await Swal.fire({
      title: "Do you want to save the changes?",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      try {
        const response = await updatesymbolstatus({ symbol, user_active_status });
        if (response.status) {
          Swal.fire({
            title: "Saved!",
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            Swal.close();
            setRefresh(!refresh); 
          }, 1000);
        }
      } catch (error) {
        Swal.fire("Error", "There was an error processing your request.", "error");
      }
    } else {
      event.target.checked = !event.target.checked; 
    }
  };



  // Fetching data
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
  }, [refresh]);



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
                      <div className="mb-3 ms-4">
                        Search:{" "}
                        <input
                          className="ml-2 input-search form-control"
                          defaultValue=""
                          style={{ width: "20%" }}
                        />
                      </div>
                      <Table columns={columns} data={data} />
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
