import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  LogoutUser,
  getbroadcastmessageforuser,
} from "../../Services/Admin/Addmin";
import { fDateTime } from "../../Utils/Date_format/datefromat";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const location = useLocation();
  const user_role = JSON.parse(localStorage.getItem("user_role"));
  const user_details = JSON.parse(localStorage.getItem("user_details"));
  const user_id = user_details?.user_id;

  const [isActive, setIsActive] = useState(false);
  const [notification, setNotification] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleHamburger = () => setIsActive((prev) => !prev);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    document.body.setAttribute("data-theme-version", newTheme);
    document.body.className = newTheme === "dark" ? "dark-mode" : "light-mode";
    document.querySelector(".dz-theme-mode").classList.toggle("active");

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Save theme preference to localStorage
  };

  const capitalizeFirstLetter = (str) =>
    str?.charAt(0).toUpperCase() + str.slice(1);

  const getLastPathSegment = (path) => {
    const segments = path
      .split("/")
      .filter((segment) => isNaN(segment.charAt(0)));
    return segments[segments.length - 1] || segments[segments.length - 2];
  };

  const formattedSegment = capitalizeFirstLetter(
    getLastPathSegment(location.pathname)
  );

  const logoutuser = async () => {
    try {
      const response = await LogoutUser({ userid: user_id });
      if (response.status) localStorage.clear();
    } catch (error) {
      console.log("Logout error", error);
    }
  };

  const getNotifications = async () => {
    try {
      const response = await getbroadcastmessageforuser({ userid: user_id });
      if (response.status) setNotification(response.data);
    } catch (error) {
      console.log("Error fetching notifications", error);
    }
  };

  const isTokenExpired = () => {
    try {
      const token = user_details?.token;
      if (!token) return true;
      const { exp } = jwtDecode(token);
      return exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  useEffect(() => {
    if (isTokenExpired()) {
      logoutuser();
    }
    const interval = setInterval(() => {
      if (isTokenExpired()) {
        logoutuser();
        clearInterval(interval);
      }
    }, 300000);
    getNotifications();
    return () => clearInterval(interval);
  }, [user_id]);

  useEffect(() => {
    // Apply the theme on page load
    document.body.setAttribute("data-theme-version", theme);
    document.body.className = theme === "dark" ? "dark-mode" : "light-mode";
  }, [theme]); 


  return (
    <div>
      <div
        className="header-banner"
        style={{ backgroundImage: "url(/assets/images/bg-1.png)" }}
      ></div>

      <div className="nav-header">
        <a href="index.html" className="brand-logo">
          <div className="brand-title"></div>
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
                  <a className="nav-link dz-theme-mode" onClick={toggleTheme}>
                    {/* {theme.includes("light") ? ( */}
                    <i
                      id="icon-light"
                      className="fas fa-sun"
                      style={{ color: "#ffff" }}
                    />
                    {/* // ) : ( */}
                    <i
                      id="icon-dark"
                      className="fas fa-moon"
                      style={{ color: "#ffff" }}
                    />
                    {/* // )} */}
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
                    />
                  </a>
                  <div className="dropdown-menu dropdown-menu-end of-visible">
                    <div
                      id="DZ_W_Notification3"
                      className="widget-media dlab-scroll p-3"
                      style={{ height: 380 }}
                    >
                      {user_role === "ADMIN" && (
                        <ul className="timeline">
                          {notification.map((item) => (
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
                      )}
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
                        <img src="/assets/images/avatar/1.png" alt="" />
                      </div>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                      {user_role === "ADMIN" && (
                        <Link
                          to="/admin/profile"
                          className="dropdown-item ai-icon"
                        >
                          <i
                            className="fas fa-user"
                            style={{ fontSize: "24px", color: "#000" }}
                          />
                          <span className="ms-2">Profile</span>
                        </Link>
                      )}
                      {user_role === "SUPERADMIN" && (
                        <Link
                          to="/superadmin/system"
                          className="dropdown-item ai-icon"
                        >
                          <i
                            className="fa-solid fa-gear"
                            style={{ color: "#0c0808" }}
                          />
                          <span className="ms-2">System</span>
                        </Link>
                      )}
                      {(user_role === "ADMIN" || user_role === "EMPLOYE") && (
                        <Link
                          to={`/${
                            user_role === "ADMIN" ? "admin" : "employee"
                          }/changedpassword`}
                          className="dropdown-item ai-icon"
                        >
                          <i
                            className="fas fa-cogs"
                            style={{ fontSize: "24px", color: "#000" }}
                          />
                          <span className="ms-2">Settings</span>
                        </Link>
                      )}
                      <Link
                        to="/login"
                        className="dropdown-item ai-icon"
                        onClick={logoutuser}
                      >
                        <i
                          className="fas fa-sign-out-alt"
                          style={{ fontSize: "18px", color: "#fd5353" }}
                        />
                        <span className="ms-2 text-danger">Logout</span>
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
              <h2 className="text-white m-0">{formattedSegment}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
