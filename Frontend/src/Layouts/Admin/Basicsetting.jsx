import React, { useState, useEffect } from "react";
import { getAllClient } from '../../Services/Superadmin/Superadmin';


const Changedpassword = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;
  const [getClient, setClient] = useState({});


const getallclient=async()=>{
      try {
        const data = {userid:user_id}
        const response = await getAllClient(data)
        if(response.status){
            setClient(response.data)
        }

      } catch (error) {
        console.log("error")
      }
   }

    useEffect(()=>{
       getallclient()
      },[])

console.log("getClient",getClient)

  return (
    <div className="container-fluid" style={{ minHeight: 723 }}>
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card profile-card card-bx">
            <div className="profile-form mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <h1>Refer And Earn</h1>
                    {/* CREATE INPUT ALBELE AND UPDATE BTN FOR REFERPOIT PRICE */}

                    <div className="mb-3">
                        <label className="form-label">Refer Point Price</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Refer Point Price"
                        />

                        <button className="btn btn-primary mt-2">Update</button>
                        <br />
                        <span className="text-danger">*This is the price for each refer point.</span>
                        </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Changedpassword;
