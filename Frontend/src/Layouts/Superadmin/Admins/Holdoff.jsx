import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import {
  symbolholdoff,
  updatesymbolstatus,
} from "../../../Services/Admin/Addmin";

import Swal from "sweetalert2";

const Holdoff = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);


  const columns = [
    { Header: "Symbol name", accessor: "symbol" },
    { Header: "Segtment", accessor: "exch_seg" },
    { Header: "lot Size", accessor: "lotsize" },
    {
      Header: "Active Status",
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
            className="checktoggle checkbox-bg"></label>
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
        const response = await updatesymbolstatus({
          symbol,
          user_active_status,
        });
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
        Swal.fire(
          "Error",
          "There was an error processing your request.",
          "error"
        );
      }
    } else {
      event.target.checked = !event.target.checked;
    }
  };

  // Fetching data
  const Symbolholdoff = async () => {
    try {
      const response = await symbolholdoff({});

      const searchfilter = response.data?.filter((item) => {
        const searchInputMatch =
          search === "" ||
          (item.symbol &&
            item.symbol.toLowerCase().includes(search.toLowerCase()));

        return searchInputMatch;
      });
      setData(search ? searchfilter : response.data);
    } catch (error) {}
  };

  useEffect(() => {
    Symbolholdoff();
  }, [refresh, search]);

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
                      aria-labelledby="Week-tab">
                      <div className="mb-3 ms-4">
                       🔍 Search :{" "}
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
                        data={data}
                        rowsPerPage={rowsPerPage}
                      />
                      <div
                        className="d-flex align-items-center"
                        style={{
                          marginBottom: "20px",
                          marginLeft: "20px",
                          marginTop: "-48px",
                        }}>
                        Rows per page:{" "}
                        <select
                          className="form-select ml-2"
                          value={rowsPerPage}
                          onChange={(e) =>
                            setRowsPerPage(Number(e.target.value))
                          }
                          style={{ width: "auto", marginLeft: "10px" }}>
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

export default Holdoff;
