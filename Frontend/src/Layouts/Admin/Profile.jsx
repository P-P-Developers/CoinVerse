import React from 'react';

const Profile = () => {
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
                                                <h6 className="title">Neha Sharma</h6>
                                                <span>Developer</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="info-list">
                                        <ul>
                                            <li>
                                                <a href="/vite/demo/app-profile">Client Key  </a>
                                                <span> ADM788766240323 </span>
                                            </li>
                                            <li>
                                                <a href="/vite/demo/uc-lightgallery">Company Name</a>
                                                <span>PNP</span>
                                            </li>
                                            <li>
                                                <a href="/vite/demo/app-profile">DOB</a>
                                                <span>15 January 1997</span>
                                            </li>
                                            <li>
                                                <a href="/vite/demo/app-profile">Address </a>
                                                <span>777, Bhawarkua</span>
                                            </li>
                                            <li>
                                                <a href="/vite/demo/app-profile">Location  </a>
                                                <span>Indore</span>
                                            </li>
                                            <li>
                                                <a href="/vite/demo/app-profile">State</a>
                                                <span>MadhyaPradesh</span>
                                            </li>
                                            <li>
                                                <a href="/vite/demo/app-profile">Country   </a>
                                                <span>India</span>
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

