import React, { useEffect, useState } from 'react';
import { getAllClient } from '../../Services/Superadmin/Superadmin';
import { TotalcountLicence } from '../../Services/Admin/Addmin';

const Profile = () => {

    const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const user_id = userDetails?.user_id;

    const [client,setClient] = useState([])
  const [checkLicence, setCheckLicence] = useState([]);


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

   const gettotallicence=async()=>{
    try {
      const data = {userid:user_id}
      const response = await TotalcountLicence(data)
      if(response.status){
          setCheckLicence(response.data)
      }

    } catch (error) {
      console.log("error")
    }
 }


   useEffect(()=>{
    getallclient()
    gettotallicence()
   },[])

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
                                                <img src="/assets/images/jd.jpg" alt="" />
                                                <div
                                                    className="upload-link"
                                                    title=""
                                                    data-toggle="tooltip"
                                                    data-placement="right"
                                                    data-original-title="update"
                                                >
                                                    <input type="file" className="update-flie" />
                                                    <i className="fa fa-camera" />
                                                </div>
                                            </div>
                                            <div className="author-info">
                                                <h6 className="title">{client.UserName && client.UserName}</h6>
                                                {/* <span>Developer</span> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="info-list">
                                        <ul>
                                            <li>
                                                <a href="/vite/demo/app-profile">Name  </a>
                                                <span>{client.UserName && client.UserName}</span>
                                            </li>
                                            <li>
                                                <a href="/vite/demo/uc-lightgallery">phone Number</a>
                                                <span>{client.PhoneNo && client.PhoneNo}</span>
                                            </li>
                                            
                                            <li>
                                                <a href="/vite/demo/app-profile">Total Licence </a>
                                                <span>{checkLicence.userLicence && checkLicence.userLicence}</span>
                                            </li>
                                            <li>
                                                <a href="/vite/demo/app-profile">Remaining Licence</a>
                                                <span>{checkLicence.CountLicence && checkLicence.CountLicence}</span>
                                            </li>
                                            <li>
                                                <a href="/vite/demo/app-profile">Total Used Licence</a>
                                                <span>{checkLicence.totalLicenses && checkLicence.totalLicenses}</span>
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
}

export default Profile;

