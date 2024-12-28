import React, { useEffect, useState } from "react";
import Table from "../../../Utils/Table/Table"
import { useParams } from "react-router-dom";
// import { Clienthistory } from "../../Services/Admin/Addmin";
import { DollarSign } from 'lucide-react'
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getadminuserdetail } from "../../../Services/Superadmin/Superadmin";
import { fDateTime } from "../../../Utils/Date_format/datefromat";



const AdminUser = () => {

  const { id } = useParams();
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;
  const Role = userDetails?.Role;

  const [data, setData] = useState([]);

  // Define columns for the table
  const columns = [
    { Header: "FullName", accessor: "FullName" },
    { Header: "UserName", accessor: "UserName" },
    { Header: "Balance", accessor: "Balance" },
    {
        Header: "ActiveStatus",
        accessor: "ActiveStatus",
        Cell: ({ cell }) => (
          <span
            style={{
              height: '15px',
              width: '15px',
              backgroundColor: cell.value == 1 ? 'green' : 'red',
              borderRadius: '50%',
              display: 'inline-block',
            }}
          ></span>
        ),
      }
      ,
      { Header: "PhoneNo", accessor: "PhoneNo" },
      { Header: "Licence", accessor: "Licence" },
    { Header: "createdAt", accessor: "createdAt" ,
        Cell: ({ cell }) => {
            return fDateTime(cell.value)
   
           },
    },
    { Header: "Start_Date", accessor: "Start_Date",
        Cell: ({ cell }) => {
            return fDateTime(cell.value)
   
           },
     },
    { Header: "End_Date", accessor: "End_Date",
        Cell: ({ cell }) => {
            return fDateTime(cell.value)
   
           },
    },
   
  ];

//   Function to get user history
  const getuserallhistory = async () => {
    try {
      const data = { userid: id };
      const response = await getadminuserdetail(data);
      const filteruser = response.data && response.data.filter((item)=>{
        return item.Role ==="USER"
      })
      setData(filteruser);
    } catch (error) {
     return error
    }
  };

  useEffect(() => {
    getuserallhistory();
  }, [id]);


  

  
  return (
    <>
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card transaction-table">
                <div className="card-header border-0 flex-wrap pb-0">
                  <div className="mb-4">
                    <h4 className="card-title">Admin User</h4>
                  </div>
                  <Link
                  to="/superadmin/admin"
                  className="float-end mb-4 btn btn-primary"
                >
                  Back
                </Link>
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

export default AdminUser;
