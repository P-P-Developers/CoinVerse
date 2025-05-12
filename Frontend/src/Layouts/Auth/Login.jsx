import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { LOGIN_API } from "../../Services/Auth/Auth";
import { Link } from "react-router-dom";
import { getCompanyApi } from "../../Services/Superadmin/Superadmin";



const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [logo, setLogo] = useState('');

  const navigate = useNavigate();

  const handleUsernameChange = (e) => setUsername(e.target.value.toString().toLowerCase() );
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }
  const validate = () => {
    let inputErrors = {};
    if (!username) inputErrors.username = "Username is required";
    if (!password) inputErrors.password = "Password is required";
    return inputErrors;
  };

  const changeFavicon = (iconPath) => {
    const link = document.querySelector("favicon") || document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "icon";
    link.href = iconPath;
    document.getElementsByTagName("head")[0].appendChild(link);
  };


  useEffect(() => {
    fetchLogo();
  }, [])

  const fetchLogo = async () => {
    const res = await getCompanyApi()
    const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "icon";
    link.href = res.data.favicon;
    document.getElementsByTagName("head")[0].appendChild(link);

    document.title = res.data.panelName;

    setLogo(res.data.logo);
    changeFavicon(res.data.favicon);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputErrors = validate();
    if (Object.keys(inputErrors).length > 0) {
      setErrors(inputErrors);
      return;
    }
    

    try {
      const response = await LOGIN_API({ UserName: username, password: password });

      const { Role } = response.data;

      if (response.status) {
        if (response.data.Role === "USER") {
          Swal.fire({
            icon: "error",
            title: "Login failed",
            text: "User Can't Login On WebPage!",
          });
          return;
        }
        localStorage.setItem("user_details", JSON.stringify(response.data));
        localStorage.setItem("user_role", JSON.stringify(response.data.Role));
        localStorage.setItem("UserName", JSON.stringify(response.data.UserName));
        localStorage.setItem("ReferralCode", JSON.stringify(response.data?.ReferralCode))


        Swal.fire({
          icon: "success",
          title: "Login successful",
          text: "You have successfully logged in!",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {


          if (Role === "SUPERADMIN") {
            navigate("/superadmin/dashboard");
          } else if (Role === "ADMIN") {
            navigate("/admin/dashboard");
          }
          else if (Role === "EMPLOYE") {
            navigate("/employee/dashboard");
          }
        });
      } else {
        if (response.message === "Password Not Match") {

          Swal.fire({
            icon: "error",
            title: "Login failed",
            text: response.message,
          });

        } else {
          Swal.fire({
            icon: "error",
            title: "Login failed",
            text: response.message,
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: error.msg || "An unexpected error occurred",
      });

    }
  };

  return (
    <div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
      <div className="login-aside text-center d-flex flex-column flex-row-auto">
        <div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
          <div className="text-center mb-lg-4 mb-2 pt-5 logo">
            <img src={logo} style={{ height: "100px" }} alt="Logo" />
          </div>
          <h3 className="mb-2 text-white">Welcome back!</h3>
          {/* <p className="mb-4">
            User Experience &amp; Interface Design <br />
            Strategy SaaS Solutions
          </p> */}
        </div>

        <div
          className="aside-image position-relative"
          style={{
            backgroundImage: "url(/assets/images/background/pic-2.png)",
          }}
        >
          <img
            className="img1 move-1"
            src="assets/images/background/pic3.png"
            alt=""
          />
          <img
            className="img2 move-2"
            src="assets/images/background/pic4.png"
            alt=""
          />
          <img
            className="img3 move-3"
            src="assets/images/background/pic5.png"
            alt=""
          />
        </div>
      </div>
      <div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
        <div className="d-flex justify-content-center h-100 align-items-center">
          <div className="authincation-content style-2">
            <div className="row no-gutters">
              <div className="col-xl-12 tab-content">
                <div
                  id="sign-up"
                  className="auth-form tab-pane fade show active form-validation"
                >
                  <form onSubmit={handleSubmit}>
                    <div className="text-center mb-4">
                      <h2 className="text-center mb-2 text-dark">Sign In</h2>
                     
                    </div>

                   
                    <div className="mb-3">
                      <label
                        htmlFor="exampleFormControlInput1"
                        className="form-label required"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleFormControlInput1"
                        value={username.toString().toLowerCase()}
                        onChange={handleUsernameChange}
                      />
                      {errors.username && (
                        <div className="text-danger">{errors.username}</div>
                      )}
                    </div>
                    <div className="mb-3 position-relative">
                      <label className="form-label required">Password</label>
                      <input

                        type={isPasswordVisible ? "text" : "password"}
                        id="dlab-password"
                        className="form-control"
                        value={password}
                        onChange={handlePasswordChange}
                      />

                      <span className="show-pass eye" onClick={togglePasswordVisibility}>
                        <i className={isPasswordVisible ? "fa fa-eye" : "fa fa-eye-slash"} />
                      </span>
                      {errors.password && (
                        <div className="text-danger">{errors.password}</div>
                      )}
                    </div>

                    <button className="btn btn-block btn-primary">
                      Sign In
                    </button>
                  </form>
                  <div className="new-account mt-3 text-center">
                    <p className="font-w500">
                      Don't have an account?{" "}
                      <Link
                        className="text-primary"
                        to="/register"
                        data-toggle="tab"
                      >
                        Sign up
                      </Link>
                    </p>
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

export default Login;
