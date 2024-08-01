import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table/Table";
import { fDateTime } from "../../Utils/Date_format/datefromat";
import { getSignIn } from "../../Services/Admin/Addmin";
import {Pencil} from "lucide-react";
import { Navigate, useNavigate  } from "react-router-dom";


const Signup = () => {


  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;
  
  const navigate = useNavigate();
 



  const [data, setData] = useState([]);
  const [currentClient, setCurrentClient] = useState(null);

  const columns = [
    { Header: "FullName", accessor: "FullName" },

    { Header: "UserName", accessor: "UserName" },
    {Header: "password", accessor: "password"},
    {
      Header: "Create Date",
      accessor: "createdAt",
      Cell: ({ cell }) => {
        return fDateTime(cell.value)

      },
    },
    {
      Header: "Action",
      accessor: "Action",
      Cell: ({ cell }) => {
        return (
          <div>
            <Pencil
              style={{ cursor: "pointer", color: "#33B469" }}
              onClick={() => EditClient(cell.row._id)}
            />
          </div>
        );
      },
    },
  ];

  
 
  const EditClient = (rowId) => {
    const clientData = data.find((item) => item._id === rowId);
   

    navigate("/admin/adduser", { state: { clientData } });
  };



  // getting data
  const getsignupuser = async () => {
    try {
      const response = await getSignIn({});
      setData(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getsignupuser();
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
                    <h4 className="card-title">SingUp Request</h4>
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

export default Signup;
