{user_role && user_role === "ADMIN" && (
    <div>
      <div
        className="header-banner"
        style={{ backgroundImage: "url(/assets/images/bg-1.png)" }}
      ></div>

      <div className="nav-header">
        <a href="index.html" className="brand-logo">
          {/* <img className="logo-abbr" src=" /assets/images/pn.png" alt="" /> */}
          <div className="brand-title">
            {/* <img
              src="/assets/images/download1.png"
              style={{ height: "57px" }}
              alt=""
            /> */}
          </div>
        </a>
        <div className="nav-control">
          <div
            className={`hamburger ${isActive ? "is-active" : ""}`}
            onClick={toggleHamburger}
          >
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </div>
        </div>
      </div>

      <div className="header home">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left"></div>
              <ul className="navbar-nav header-right">
                <li className="nav-item dropdown notification_dropdown">
                  <a className="nav-link bell dz-theme-mode">
                    {/* Light Mode Icon */}
                    <i
                      id="icon-light"
                      className="fas fa-sun"
                      style={{ color: "#ffff" }}
                    ></i>
                    {/* Dark Mode Icon */}
                    <i
                      id="icon-dark"
                      className="fas fa-moon"
                      style={{ color: "#ffff" }}
                    ></i>
                  </a>
                </li>

                <li className="nav-item dropdown notification_dropdown">
                  <a
                    className="nav-link"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i
                      className="fa fa-bell"
                      style={{ fontSize: "32px", color: "white" }}
                    ></i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end of-visible">
                    <div
                      id="DZ_W_Notification3"
                      className="widget-media dlab-scroll p-3"
                      style={{ height: 380 }}
                    >
                      <ul className="timeline">
                        {notification &&
                          notification.map((item) => (
                            <li key={item.id}>
                              <div className="timeline-panel">
                                <div className="media me-2">
                                  <img
                                    alt="image"
                                    width={40}
                                    src="/assets/images/avatar/1.png"
                                  />
                                </div>

                                <div className="media-body">
                                  <h6 className="mb-1">{item.message}</h6>
                                  <small className="d-block">
                                    {fDateTime(item.createdAt)}
                                  </small>
                                </div>
                                <h6 className="mb-4">{item.UserName}</h6>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <a className="all-notification">
                      See all notifications <i className="ti-arrow-end" />
                    </a>
                  </div>
                </li>

                <li>
                  <div className="dropdown header-profile2">
                    <a
                      className="nav-link"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="header-info2 d-flex align-items-center">
                        <div className="d-flex align-items-center sidebar-info"></div>
                        <img src="/assets/images/avatar/1.png" alt="" />
                      </div>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                      <Link
                        to="/admin/profile"
                        className="dropdown-item ai-icon"
                      >
                        <i
                          className="fas fa-user"
                          style={{ fontSize: "24px", color: "#000000" }}
                        ></i>
                        <span className="ms-2">Profile</span>
                      </Link>

                      <Link
                        to="/admin/changedpassword"
                        className="dropdown-item ai-icon"
                      >
                        <i
                          className="fas fa-cogs"
                          style={{ fontSize: "24px", color: "#000000" }}
                        ></i>
                        <span className="ms-2">Settings</span>
                      </Link>

                      <Link to="/login" className="dropdown-item ai-icon">
                        <i
                          className="fas fa-sign-out-alt"
                          style={{ fontSize: "18px", color: "#fd5353" }}
                        ></i>
                        <span
                          className="ms-2 text-danger"
                          onClick={logoutuser}
                        >
                          Logout
                        </span>
                      </Link>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="page-titles">
          <div className="sub-dz-head">
            <div className="d-flex align-items-center dz-head-title">
              <h2 className="text-white m-0">
                {formattedSegment && formattedSegment}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
  {user_role && user_role === "EMPLOYE" && (
    <div>
      <div
        className="header-banner"
        style={{ backgroundImage: "url(/assets/images/bg-1.png)" }}
      ></div>

      <div className="nav-header">
        <a href="index.html" className="brand-logo">
          {/* <img className="logo-abbr" src=" /assets/images/pn.png" alt="" /> */}
          <div className="brand-title">
            {/* <img
              src="/assets/images/download1.png"
              style={{ height: "57px" }}
              alt=""
            /> */}
          </div>
        </a>
        <div className="nav-control">
          <div
            className={`hamburger ${isActive ? "is-active" : ""}`}
            onClick={toggleHamburger}
          >
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </div>
        </div>
      </div>

      <div className="header home">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left"></div>
              <ul className="navbar-nav header-right">
                <li className="nav-item dropdown notification_dropdown">
                  <a className="nav-link bell dz-theme-mode">
                    {/* Light Mode Icon */}
                    <i
                      id="icon-light"
                      className="fas fa-sun"
                      style={{ color: "#ffff" }}
                    ></i>
                    {/* Dark Mode Icon */}
                    <i
                      id="icon-dark"
                      className="fas fa-moon"
                      style={{ color: "#ffff" }}
                    ></i>
                  </a>
                </li>

                <li className="nav-item dropdown notification_dropdown">
                  <a className="nav-link" role="button">
                    <i
                      className="fa fa-bell"
                      style={{ fontSize: "32px", color: "white" }}
                    ></i>
                  </a>
                </li>

                <li>
                  <div className="dropdown header-profile2">
                    <a
                      className="nav-link"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="header-info2 d-flex align-items-center">
                        <div className="d-flex align-items-center sidebar-info"></div>
                        <img src="/assets/images/avatar/1.png" alt="" />
                      </div>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                      <Link
                        to="/employee/profile"
                        className="dropdown-item ai-icon"
                      >
                        <i
                          className="fas fa-user"
                          style={{ fontSize: "24px", color: "#000000" }}
                        ></i>
                        <span className="ms-2">Profile</span>
                      </Link>

                      <Link
                        to="/employee/changedpassword"
                        className="dropdown-item ai-icon"
                      >
                        <i
                          className="fas fa-cogs"
                          style={{ fontSize: "24px", color: "#000000" }}
                        ></i>
                        <span className="ms-2">Settings</span>
                      </Link>

                      <Link to="/login" className="dropdown-item ai-icon">
                        <i
                          className="fas fa-sign-out-alt"
                          style={{ fontSize: "18px", color: "#fd5353" }}
                        ></i>
                        <span
                          className="ms-2 text-danger"
                          onClick={logoutuser}
                        >
                          Logout
                        </span>
                      </Link>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="page-titles">
          <div className="sub-dz-head">
            <div className="d-flex align-items-center dz-head-title">
              <h2 className="text-white m-0">
                {formattedSegment && formattedSegment}
              </h2>
              {/* <p className="ms-2 text-warning">Welcome Back Neha Sharma!</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )}