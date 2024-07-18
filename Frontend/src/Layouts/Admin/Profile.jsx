import React from 'react';

const Profile = () => {
    return (
        <div>
            <div className="container-fluid" style={{ minHeight: 723 }}>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="profile card card-body px-3 pt-3 pb-0">
                            <div className="profile-head">
                                <div className="photo-content ">
                                    <div className="cover-photo rounded" />
                                </div>
                                <div className="profile-info">
                                    <div className="profile-photo">
                                        <img
                                            src="https://jiade.scriptlelo.com/vite/demo/assets/profile-B9SRNMn2.png"
                                            className="img-fluid rounded-circle"
                                            alt="profile"
                                        />
                                    </div>
                                    <div className="profile-details">
                                        <div className="profile-name px-3 pt-2">
                                            <h4 className="text-primary mb-0">Mitchell C. Shay</h4>
                                            <p>UX / UI Designer</p>
                                        </div>
                                        <div className="profile-email px-2 pt-2">
                                            <h4 className="text-muted mb-0">hello@email.com</h4>
                                            <p>Email</p>
                                        </div>
                                        <div className="dropdown ms-auto dropdown">
                                            <button
                                                type="button"
                                                id="react-aria2055717917-:r2n:"
                                                aria-expanded="true"
                                                data-toggle="dropdown"
                                                className="btn btn-primary light sharp i-false dropdown-toggle btn btn-primary"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="18px"
                                                    height="18px"
                                                    viewBox="0 0 24 24"
                                                    version="1.1"
                                                >
                                                    <g
                                                        stroke="none"
                                                        strokeWidth={1}
                                                        fill="none"
                                                        fillRule="evenodd"
                                                    >
                                                        <rect x={0} y={0} width={24} height={24} />
                                                        <circle fill="#000000" cx={12} cy={5} r={2} />
                                                        <circle fill="#000000" cx={12} cy={12} r={2} />
                                                        <circle fill="#000000" cx={12} cy={19} r={2} />
                                                    </g>
                                                </svg>
                                            </button>
                                            <div
                                                x-placement="top-start"
                                                aria-labelledby="react-aria2055717917-:r2n:"
                                                className="dropdown-menu dropdown-menu-right dropdown-menu"
                                                data-popper-reference-hidden="true"
                                                data-popper-escaped="true"
                                                data-popper-placement="top-start"
                                                style={{
                                                    position: "absolute",
                                                    inset: "auto auto 0px 0px",
                                                    transform: "translate(1261px, 86px)"
                                                }}
                                            >
                                                <a
                                                    data-rr-ui-dropdown-item=""
                                                    className="dropdown-item"
                                                    role="button"
                                                    tabIndex={0}
                                                    href="#"
                                                >
                                                    <i className="fa fa-user-circle text-primary me-2" />
                                                    View profile
                                                </a>
                                                <a
                                                    data-rr-ui-dropdown-item=""
                                                    className="dropdown-item"
                                                    role="button"
                                                    tabIndex={0}
                                                    href="#"
                                                >
                                                    <i className="fa fa-users text-primary me-2" />
                                                    Add to close friends
                                                </a>
                                                <a
                                                    data-rr-ui-dropdown-item=""
                                                    className="dropdown-item"
                                                    role="button"
                                                    tabIndex={0}
                                                    href="#"
                                                >
                                                    <i className="fa fa-plus text-primary me-2" />
                                                    Create group
                                                </a>
                                                <a
                                                    data-rr-ui-dropdown-item=""
                                                    className="text-danger dropdown-item"
                                                    role="button"
                                                    tabIndex={0}
                                                    href="#"
                                                >
                                                    <i className="fa fa-ban text-danger me-2" />
                                                    Block
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-4">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="profile-statistics">
                                            <div className="text-center">
                                                <div className="row">
                                                    <div className="col">
                                                        <h3 className="m-b-0">150</h3>
                                                        <span>Follower</span>
                                                    </div>
                                                    <div className="col">
                                                        <h3 className="m-b-0">140</h3> <span>Place Stay</span>
                                                    </div>
                                                    <div className="col">
                                                        <h3 className="m-b-0">45</h3> <span>Reviews</span>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <a
                                                        className="btn btn-primary mb-1 me-1"
                                                        href="/assets/vite/demo/post-details"
                                                    >
                                                        Follow
                                                    </a>
                                                    <a
                                                        className="btn btn-primary mb-1 ms-1"
                                                        href="/assets/vite/demo/app-profile"
                                                    >
                                                        Send Message
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header border-0 pb-0">
                                        <h5 className="text-primary">Today Highlights</h5>
                                    </div>
                                    <div className="card-body pt-3">
                                        <div className="profile-blog ">
                                            <img
                                                src="/assets/vite/demo/assets/1-Cq4soiQ7.jpg"
                                                alt="profile"
                                                className="img-fluid  mb-4 w-100 "
                                            />
                                            <a href="/assets/vite/demo/post-details">
                                                {" "}
                                                <h4>Darwin Creative Agency Theme</h4>{" "}
                                            </a>
                                            <p className="mb-0">
                                                A small river named Duden flows by their place and supplies it
                                                with the necessary regelialia. It is a paradisematic country,
                                                in which roasted parts of sentences fly into your mouth.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header border-0 pb-0">
                                        <h5 className="text-primary ">Interest</h5>
                                    </div>
                                    <div className="card-body pt-3">
                                        <div className="profile-interest ">
                                            <div className="lg-react-element row sp4">
                                                <div
                                                    data-src="/vite/demo/assets/3-BmwFTwJL.jpg"
                                                    className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1"
                                                    data-lg-id="fc4f3553-e71e-4114-9cd4-4ae8500cc8f8"
                                                >
                                                    <img
                                                        src="/vite/demo/assets/3-BmwFTwJL.jpg"
                                                        alt="gallery"
                                                        style={{ width: "100%" }}
                                                    />
                                                </div>
                                                <div
                                                    data-src="/vite/demo/assets/4-CQ0-Q1zK.jpg"
                                                    className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1"
                                                    data-lg-id="e0f1546a-91b0-43f6-9661-777eece22ec7"
                                                >
                                                    <img
                                                        src="/vite/demo/assets/4-CQ0-Q1zK.jpg"
                                                        alt="gallery"
                                                        style={{ width: "100%" }}
                                                    />
                                                </div>
                                                <div
                                                    data-src="/vite/demo/assets/2-rrkGLtzm.jpg"
                                                    className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1"
                                                    data-lg-id="7a9da7a7-a562-4ace-b412-de83f37ec849"
                                                >
                                                    <img
                                                        src="/vite/demo/assets/2-rrkGLtzm.jpg"
                                                        alt="gallery"
                                                        style={{ width: "100%" }}
                                                    />
                                                </div>
                                                <div
                                                    data-src="/vite/demo/assets/4-CQ0-Q1zK.jpg"
                                                    className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1"
                                                    data-lg-id="70fe97ab-94b4-4d04-ba62-f3c5875e3a47"
                                                >
                                                    <img
                                                        src="/vite/demo/assets/4-CQ0-Q1zK.jpg"
                                                        alt="gallery"
                                                        style={{ width: "100%" }}
                                                    />
                                                </div>
                                                <div
                                                    data-src="/vite/demo/assets/3-BmwFTwJL.jpg"
                                                    className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1"
                                                    data-lg-id="0bf884f6-78d6-410c-a1dd-f5748439d264"
                                                >
                                                    <img
                                                        src="/vite/demo/assets/3-BmwFTwJL.jpg"
                                                        alt="gallery"
                                                        style={{ width: "100%" }}
                                                    />
                                                </div>
                                                <div
                                                    data-src="/vite/demo/assets/2-rrkGLtzm.jpg"
                                                    className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1"
                                                    data-lg-id="bd70c162-dbfc-4f70-899d-58e3b187a146"
                                                >
                                                    <img
                                                        src="/vite/demo/assets/2-rrkGLtzm.jpg"
                                                        alt="gallery"
                                                        style={{ width: "100%" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header border-0 pb-0">
                                        <h5 className="text-primary">Our Latest News</h5>
                                    </div>
                                    <div className="card-body pt-3">
                                        <div className="profile-news">
                                            <div className="media pt-3 pb-3">
                                                <img
                                                    src="/vite/demo/assets/5-B5DXGN9E.jpg"
                                                    alt=""
                                                    className="me-3 rounded"
                                                    width={75}
                                                />
                                                <div className="media-body">
                                                    <h5 className="m-b-5">
                                                        <a href="/vite/demo/post-details">
                                                            Check crypto news websites regularly.
                                                        </a>
                                                    </h5>
                                                    <p className="mb-0">
                                                        I shared this on my fb wall a few months back, and I
                                                        thought.{" "}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="media pt-3 pb-3">
                                                <img
                                                    src="/vite/demo/assets/6-1U_FjGGb.jpg"
                                                    alt=""
                                                    className="me-3 rounded"
                                                    width={75}
                                                />
                                                <div className="media-body">
                                                    <h5 className="m-b-5">
                                                        <a href="/vite/demo/post-details">
                                                            Use crypto news sources daily.
                                                        </a>
                                                    </h5>
                                                    <p className="mb-0">
                                                        I shared this on my fb wall a few months back, and I
                                                        thought.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="media pt-3 ">
                                                <img
                                                    src="/vite/demo/assets/7-D8H_aPge.jpg"
                                                    alt=""
                                                    className="me-3 rounded"
                                                    width={75}
                                                />
                                                <div className="media-body">
                                                    <h5 className="m-b-5">
                                                        <a href="/vite/demo/post-details">
                                                            Collection of textile samples
                                                        </a>
                                                    </h5>
                                                    <p className="mb-0">
                                                        I shared this on my fb wall a few months back, and I
                                                        thought.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-8">
                        <div className="card">
                            <div className="card-body">
                                <div className="profile-tab">
                                    <div className="custom-tab-1">
                                        <ul className="nav nav-tabs nav" role="tablist">
                                            <li className="nav-item nav-item">
                                                <a
                                                    to="#my-posts"
                                                    role="tab"
                                                    data-rr-ui-event-key="Posts"
                                                    id="react-aria2055717917-:r2o:-tab-Posts"
                                                    aria-controls="react-aria2055717917-:r2o:-tabpane-Posts"
                                                    aria-selected="true"
                                                    className="nav-link active"
                                                    tabIndex={0}
                                                    href="#"
                                                >
                                                    Posts
                                                </a>
                                            </li>
                                            <li className="nav-item nav-item">
                                                <a
                                                    to="#about-me"
                                                    role="tab"
                                                    data-rr-ui-event-key="About"
                                                    id="react-aria2055717917-:r2o:-tab-About"
                                                    aria-controls="react-aria2055717917-:r2o:-tabpane-About"
                                                    aria-selected="false"
                                                    tabIndex={-1}
                                                    className="nav-link"
                                                    href="#"
                                                >
                                                    About Me
                                                </a>
                                            </li>
                                            <li className="nav-item nav-item">
                                                <a
                                                    to="#profile-settings"
                                                    role="tab"
                                                    data-rr-ui-event-key="Setting"
                                                    id="react-aria2055717917-:r2o:-tab-Setting"
                                                    aria-controls="react-aria2055717917-:r2o:-tabpane-Setting"
                                                    aria-selected="false"
                                                    tabIndex={-1}
                                                    className="nav-link"
                                                    href="#"
                                                >
                                                    Setting
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="tab-content">
                                            <div
                                                id="react-aria2055717917-:r2o:-tabpane-Posts"
                                                role="tabpanel"
                                                aria-labelledby="react-aria2055717917-:r2o:-tab-Posts"
                                                className="fade tab-pane active show"
                                            >
                                                <div className="my-post-content pt-3">
                                                    <div className="post-input">
                                                        <textarea
                                                            name="textarea"
                                                            id="textarea"
                                                            cols={30}
                                                            rows={5}
                                                            className="form-control bg-transparent"
                                                            placeholder="Please type what you want...."
                                                            defaultValue={""}
                                                        />
                                                        <a
                                                            className="btn btn-primary light px-3 me-1"
                                                            href="/vite/demo/app-profile"
                                                        >
                                                            <i className="fa fa-link m-0" />
                                                        </a>
                                                        <a
                                                            className="btn btn-primary light px-3 ms-1 me-1"
                                                            href="/vite/demo/app-profile"
                                                        >
                                                            <i className="fa fa-camera m-0" />
                                                        </a>
                                                        <a
                                                            className="btn btn-primary ms-1"
                                                            href="/vite/demo/app-profile"
                                                        >
                                                            Post
                                                        </a>
                                                    </div>
                                                    <div className="profile-uoloaded-post border-bottom-1 pb-5">
                                                        <img
                                                            src="/vite/demo/assets/8-Fy0DFfK2.jpg"
                                                            alt=""
                                                            className="img-fluid w-100 rounded"
                                                        />
                                                        <a className="post-title" href="/vite/demo/post-details">
                                                            <h3>Use crypto news sources daily.</h3>
                                                        </a>
                                                        <p>
                                                            A wonderful serenity has take possession of my entire
                                                            soul like these sweet morning of spare which enjoy whole
                                                            heart.A wonderful serenity has take possession of my
                                                            entire soul like these sweet morning of spare which
                                                            enjoy whole heart.
                                                        </p>
                                                        <button className="btn btn-primary me-2">
                                                            <span className="me-2">
                                                                {" "}
                                                                <i className="fa fa-heart" />{" "}
                                                            </span>
                                                            Like
                                                        </button>
                                                        <button className="btn btn-secondary">
                                                            <span className="me-2">
                                                                {" "}
                                                                <i className="fa fa-reply" />
                                                            </span>
                                                            Reply
                                                        </button>
                                                    </div>
                                                    <div className="profile-uoloaded-post border-bottom-1 pb-5">
                                                        <img
                                                            src="/vite/demo/assets/9-7gTCTQdZ.jpg"
                                                            alt=""
                                                            className="img-fluid w-100 rounded"
                                                        />
                                                        <a className="post-title" href="/vite/demo/post-details">
                                                            <h3>
                                                                How To Win Clients And Influence Markets with
                                                                EDUCATION
                                                            </h3>
                                                        </a>
                                                        <p>
                                                            A wonderful serenity has take possession of my entire
                                                            soul like these sweet morning of spare which enjoy whole
                                                            heart.A wonderful serenity has take possession of my
                                                            entire soul like these sweet morning of spare which
                                                            enjoy whole heart.
                                                        </p>
                                                        <button className="btn btn-primary me-2">
                                                            <span className="me-2">
                                                                {" "}
                                                                <i className="fa fa-heart" />{" "}
                                                            </span>
                                                            Like
                                                        </button>
                                                        <button className="btn btn-secondary">
                                                            <span className="me-2">
                                                                {" "}
                                                                <i className="fa fa-reply" />
                                                            </span>
                                                            Reply
                                                        </button>
                                                    </div>
                                                    <div className="profile-uoloaded-post pb-3">
                                                        <img
                                                            src="/vite/demo/assets/8-Fy0DFfK2.jpg"
                                                            alt=""
                                                            className="img-fluid  w-100 rounded"
                                                        />
                                                        <a className="post-title" href="/vite/demo/post-details">
                                                            <h3>Stay updated on crypto developments.</h3>
                                                        </a>
                                                        <p>
                                                            A wonderful serenity has take possession of my entire
                                                            soul like these sweet morning of spare which enjoy whole
                                                            heart.A wonderful serenity has take possession of my
                                                            entire soul like these sweet morning of spare which
                                                            enjoy whole heart.
                                                        </p>
                                                        <button className="btn btn-primary me-2">
                                                            <span className="me-2">
                                                                <i className="fa fa-heart" />
                                                            </span>
                                                            Like
                                                        </button>
                                                        <button className="btn btn-secondary">
                                                            <span className="me-2">
                                                                {" "}
                                                                <i className="fa fa-reply" />
                                                            </span>
                                                            Reply
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                id="react-aria2055717917-:r2o:-tabpane-About"
                                                role="tabpanel"
                                                aria-labelledby="react-aria2055717917-:r2o:-tab-About"
                                                className="fade tab-pane"
                                            >
                                                <div className="profile-about-me">
                                                    <div className="pt-4 border-bottom-1 pb-3">
                                                        <h4 className="text-primary">About Me</h4>
                                                        <p className="mb-2">
                                                            A wonderful serenity has taken possession of my entire
                                                            soul, like these sweet mornings of spring which I enjoy
                                                            with my whole heart. I am alone, and feel the charm of
                                                            existence was created for the bliss of souls like mine.I
                                                            am so happy, my dear friend, so absorbed in the
                                                            exquisite sense of mere tranquil existence, that I
                                                            neglect my talents.
                                                        </p>
                                                        <p>
                                                            A collection of textile samples lay spread out on the
                                                            table - Samsa was a travelling salesman - and above it
                                                            there hung a picture that he had recently cut out of an
                                                            illustrated magazine and housed in a nice, gilded frame.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="profile-skills mb-5">
                                                    <h4 className="text-primary mb-2">Skills</h4>
                                                    <a
                                                        className="btn btn-primary light btn-xs mb-1 me-1"
                                                        href="/vite/demo/app-profile"
                                                    >
                                                        {" "}
                                                        Admin
                                                    </a>
                                                    <a
                                                        className="btn btn-primary light btn-xs mb-1 me-1"
                                                        href="/vite/demo/app-profile"
                                                    >
                                                        {" "}
                                                        Dashboard
                                                    </a>
                                                    <a
                                                        className="btn btn-primary light btn-xs mb-1 me-1"
                                                        href="/vite/demo/app-profile"
                                                    >
                                                        Photoshop
                                                    </a>
                                                    <a
                                                        className="btn btn-primary light btn-xs mb-1 me-1"
                                                        href="/vite/demo/app-profile"
                                                    >
                                                        Bootstrap
                                                    </a>
                                                    <a
                                                        className="btn btn-primary light btn-xs mb-1 me-1"
                                                        href="/vite/demo/app-profile"
                                                    >
                                                        Responsive
                                                    </a>
                                                    <a
                                                        className="btn btn-primary light btn-xs mb-1 me-1"
                                                        href="/vite/demo/app-profile"
                                                    >
                                                        Crypto
                                                    </a>
                                                </div>
                                                <div className="profile-lang  mb-5">
                                                    <h4 className="text-primary mb-2">Language</h4>
                                                    <a
                                                        className="badge badge-primary light badge-sm me-1"
                                                        href="/vite/demo/app-profile"
                                                    >
                                                        <i className="flag-icon flag-icon-us" />
                                                        English
                                                    </a>
                                                    <a
                                                        className="badge badge-secondary light badge-sm me-1"
                                                        href="/vite/demo/app-profile"
                                                    >
                                                        <i className="flag-icon flag-icon-fr" />
                                                        French
                                                    </a>
                                                    <a
                                                        className="badge badge-warning light badge-sm"
                                                        href="/vite/demo/app-profile"
                                                    >
                                                        <i className="flag-icon flag-icon-bd" />
                                                        Bangla
                                                    </a>
                                                </div>
                                                <div className="profile-personal-info">
                                                    <h4 className="text-primary mb-4">Personal Information</h4>
                                                    <div className="row mb-2">
                                                        <div className="col-3">
                                                            <h5 className="f-w-500">
                                                                {" "}
                                                                Name<span className="pull-right">:</span>
                                                            </h5>
                                                        </div>
                                                        <div className="col-9">
                                                            <span>Mitchell C.Shay</span>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-2">
                                                        <div className="col-3">
                                                            <h5 className="f-w-500">
                                                                Email<span className="pull-right">:</span>
                                                            </h5>
                                                        </div>
                                                        <div className="col-9">
                                                            <span>example@examplel.com</span>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-2">
                                                        <div className="col-3">
                                                            <h5 className="f-w-500">
                                                                {" "}
                                                                Availability<span className="pull-right">:</span>
                                                            </h5>
                                                        </div>
                                                        <div className="col-9">
                                                            <span>Full Time (Free Lancer)</span>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-2">
                                                        <div className="col-3">
                                                            <h5 className="f-w-500">
                                                                Age<span className="pull-right">:</span>
                                                            </h5>
                                                        </div>
                                                        <div className="col-9">
                                                            <span>27</span>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-2">
                                                        <div className="col-3">
                                                            <h5 className="f-w-500">
                                                                {" "}
                                                                Location<span className="pull-right">:</span>
                                                            </h5>
                                                        </div>
                                                        <div className="col-9">
                                                            <span>Rosemont Avenue Melbourne, Florida</span>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-2">
                                                        <div className="col-3">
                                                            <h5 className="f-w-500">
                                                                Year Experience<span className="pull-right">:</span>
                                                            </h5>
                                                        </div>
                                                        <div className="col-9">
                                                            <span>07 Year Experiences</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                id="react-aria2055717917-:r2o:-tabpane-Setting"
                                                role="tabpanel"
                                                aria-labelledby="react-aria2055717917-:r2o:-tab-Setting"
                                                className="fade tab-pane"
                                            >
                                                <div className="pt-3">
                                                    <div className="settings-form">
                                                        <h4 className="text-primary">Account Setting</h4>
                                                        <form>
                                                            <div className="row">
                                                                <div className="form-group mb-3 col-md-6">
                                                                    <label className="form-label">Email</label>
                                                                    <input
                                                                        type="email"
                                                                        placeholder="Email"
                                                                        className="form-control"
                                                                    />
                                                                </div>
                                                                <div className="form-group mb-3 col-md-6">
                                                                    <label className="form-label">Password</label>
                                                                    <input
                                                                        type="password"
                                                                        placeholder="Password"
                                                                        className="form-control"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="form-group mb-3">
                                                                <label className="form-label">Address</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="1234 Main St"
                                                                    className="form-control"
                                                                />
                                                            </div>
                                                            <div className="form-group mb-3">
                                                                <label className="form-label">Address 2</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Apartment, studio, or floor"
                                                                    className="form-control"
                                                                />
                                                            </div>
                                                            <div className="row">
                                                                <div className="form-group mb-3 col-md-6">
                                                                    <label className="form-label">City</label>
                                                                    <input type="text" className="form-control" />
                                                                </div>
                                                                <div className="form-group mb-3 col-md-4">
                                                                    <label className="form-label">State</label>
                                                                    <select className="form-control" id="inputState">
                                                                        <option value="option-1" selected="">
                                                                            Choose...
                                                                        </option>
                                                                        <option value="option-2">Option 1</option>
                                                                        <option value="option-3">Option 2</option>
                                                                        <option value="option-4">Option 3</option>
                                                                    </select>
                                                                </div>
                                                                <div className="form-group mb-3 col-md-2">
                                                                    <label className="form-label">Zip</label>
                                                                    <input type="text" className="form-control" />
                                                                </div>
                                                            </div>
                                                            <div className="form-group mb-3">
                                                                <div className="form-check custom-checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        id="gridCheck"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="gridCheck"
                                                                    >
                                                                        Check me out
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <button className="btn btn-primary" type="submit">
                                                                Sign in
                                                            </button>
                                                        </form>
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


        </div>
    );
}

export default Profile;

