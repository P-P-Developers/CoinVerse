import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table";
import { fDateTime } from "../../../Utils/Date_format/datefromat";
import { gethistory } from "../../../Services/Superadmin/Superadmin";
import { getEmployeeUserHistory } from "../../../Services/Employee/Employee";
import { getUserFromToken } from "../../../Utils/TokenVerify";

const Transaction = () => {
  const TokenData = getUserFromToken();
  const user_id = TokenData?.user_id;
  const [data, setData] = useState([]);
  const [getparentid, setGetparentid] = useState([]);

  useEffect(() => {
    getallhistory();
    getEmployeeUser();
  }, []);

  const columns = [
    { Header: "UserName", accessor: "UserName" },

    { Header: "Balance", accessor: "Balance" },
    { Header: "Status", accessor: "Type" },
    {
      Header: "Create Date",
      accessor: "createdAt",
      Cell: ({ cell }) => {
        return fDateTime(cell.value);
      },
    },
  ];

  const getEmployeeUser = async () => {
    try {
      const data = { employee_id: user_id };
      const response = await getEmployeeUserHistory(data);
      const parentIds =
        response.data && response.data.map((item) => item.parent_id);

      setGetparentid(parentIds);
    } catch (error) {}
  };

  const getallhistory = async () => {
    try {
      const response = await gethistory({});
      const result =
        response.data &&
        response.data.filter((item) => {
          return item.parent_Id === getparentid;
        });
      setData(result);
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
                      <div className="mb-3 ms-4">
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

export default Transaction;
