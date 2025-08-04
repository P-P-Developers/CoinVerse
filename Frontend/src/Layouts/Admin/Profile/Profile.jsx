import React, { useEffect, useState } from "react";
import { getAllClient } from "../../../Services/Superadmin/Superadmin";
import { TotalcountLicence } from "../../../Services/Admin/Addmin";
import { getUserFromToken } from "../../../Utils/TokenVerify";

const Profile = () => {
  
  const TokenData = getUserFromToken();

  const user_id = TokenData?.user_id;

  const [client, setClient] = useState([]);
  const [checkLicence, setCheckLicence] = useState([]);

  const getallclient = async () => {
    try {
      const data = { userid: user_id };
      const response = await getAllClient(data);
      if (response.status) {
        setClient(response.data);
      }
    } catch (error) { }
  };

  const gettotallicence = async () => {
    try {
      const data = { userid: user_id };
      const response = await TotalcountLicence(data);
      if (response.status) {
        setCheckLicence(response.data);
      }
    } catch (error) { }
  };

  useEffect(() => {
    getallclient();
    gettotallicence();
  }, []);

  return (
    <div>
      <div className="container-fluid" style={{ minHeight: 723 }}>
        <div className="row">
          <div className="col-xl-12 col-lg-12">
            <div className="clearfix">
              <div className="card card-bx profile-card author-profile mb-3">
                <div className="card-body">
                  <div className="p-5">
                    <div className="author-profile">
                      <div className="author-media">
                        <img src="/assets/images/man.png" alt="" />
                      </div>
                      <div className="author-info">
                        <h6 className="title">
                          {client.UserName && client.UserName}
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="info-list">
                    <ul>
                      <li>
                        <a href="/vite/demo/app-profile">Name </a>
                        <span>{client.UserName && client.UserName}</span>
                      </li>
                      <li>
                        <a href="/vite/demo/uc-lightgallery">phone Number</a>
                        <span>{client.PhoneNo && client.PhoneNo}</span>
                      </li>
                    </ul>
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

export default Profile;
