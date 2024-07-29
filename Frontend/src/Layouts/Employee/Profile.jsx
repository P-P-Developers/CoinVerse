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
                                                <h6 className="title">Employee</h6>
                                                {/* <span>Developer</span> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="info-list">
                                        <ul>
                                            <li>
                                                <a href="/vite/demo/app-profile">Employee Name  </a>
                                                <span> Vikas Patel </span>
                                            </li>
                                            <li>
                                                <a href="/vite/demo/uc-lightgallery">Company Name</a>
                                                <span>PNP</span>
                                            </li>
                                            <li>
                                                <a href="/vite/demo/app-profile">Email</a>
                                                <span>info@pnpinfotech.com</span>
                                            </li>
                                            <li>
                                                <a href="/vite/demo/app-profile">Mobile </a>
                                                <span>1234567890</span>
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

