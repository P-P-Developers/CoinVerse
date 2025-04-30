import React, { useState, useEffect } from "react";
import { getAllClient } from "../../Services/Superadmin/Superadmin";
import { UpdateRefferPrice } from "../../Services/Admin/Addmin";
import Swal from "sweetalert2";

const Changedpassword = () => {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

  const [getClient, setClient] = useState({});
  const [referPrice, setReferPrice] = useState("");

  const getallclient = async () => {
    try {
      const data = { userid: user_id };
      const response = await getAllClient(data);
      if (response.status) {
        setClient(response.data);
        setReferPrice(response?.data?.Refer_Price);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getallclient();
  }, []);

  const Update_RefferPrice = async () => {
    try {
      const data = { userId: user_id, referPrice: referPrice };
      const response = await UpdateRefferPrice(data);
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.message,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

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
                    <div className="mb-3">
                      <label className="form-label">Refer Price </label>
                      <div className="row">
                        <div className="col-lg-6 mb-2">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Refer Point Price"
                            value={referPrice}
                            onChange={(e) => setReferPrice(e.target.value)}
                          />
                        </div>
                        <div className="col-lg-4 mb-2">
                          <button
                            className="btn btn-primary w-100"
                            onClick={Update_RefferPrice}
                          >
                            Update
                          </button>
                        </div>
                      </div>
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
