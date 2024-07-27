
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { SignIn } from "../../Services/Auth/Auth";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      FullName: "",
      UserName: "",
      password: "",
      agree: false,
    },
    validationSchema: Yup.object({
      FullName: Yup.string().required("Full name is required"),
      UserName: Yup.string().required("Username is required"),
      Email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      agree: Yup.bool().oneOf(
        [true],
        "You must accept the terms and conditions"
      ),
    }),

    onSubmit: async (values) => {
      try {
        await SignIn(values);
        Swal.fire({
          icon: "success",
          title: "Registration successful",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/login");
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Registration failed",
          text: error.message,
        });
      }
    },
  });

  return (
    <div>
      <div className="vh-100">
        <div className="fix-wrapper">
          <div className="container ">
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-6">
                <div className="card mb-0 h-auto">
                  <div className="card-body">
                    <div className="text-center mb-2">
                      <a href="/vite/demo/login">
                        <img
                          src="data:image/png;base64,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"
                          alt=""
                        />
                      </a>
                    </div>
                    <h4 className="text-center mb-4 ">Sign up your account</h4>
                    <form onSubmit={formik.handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="FullName">
                          Full Name
                        </label>
                        <input
                          id="FullName"
                          type="text"
                          className={`form-control ${
                            formik.touched.FullName && formik.errors.FullName
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("FullName")}
                        />
                        {formik.touched.FullName && formik.errors.FullName ? (
                          <div className="invalid-feedback">
                            {formik.errors.FullName}
                          </div>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <label className="form-label" htmlFor="UserName">
                          UserName
                        </label>
                        <input
                          id="UserName"
                          type="text"
                          className={`form-control ${
                            formik.touched.UserName && formik.errors.UserName
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("UserName")}
                        />
                        {formik.touched.UserName && formik.errors.UserName ? (
                          <div className="invalid-feedback">
                            {formik.errors.UserName}
                          </div>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <label className="form-label" htmlFor="Email">
                          Email
                        </label>
                        <input
                          id="Email"
                          type="email"
                          className={`form-control ${
                            formik.touched.Email && formik.errors.Email
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("Email")}
                        />
                        {formik.touched.Email && formik.errors.Email ? (
                          <div className="invalid-feedback">
                            {formik.errors.Email}
                          </div>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                        <input
                          id="password"
                          type="password"
                          className={`form-control ${
                            formik.touched.password && formik.errors.password
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("password")}
                        />
                        {formik.touched.password && formik.errors.password ? (
                          <div className="invalid-feedback">
                            {formik.errors.password}
                          </div>
                        ) : null}
                      </div>

                      <div className="mb-3 form-check">
                        <input
                          id="agree"
                          type="checkbox"
                          className={`form-check-input ${
                            formik.touched.agree && formik.errors.agree
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("agree")}
                        />
                        <label className="form-check-label" htmlFor="agree">
                          I agree to the Terms and Conditions
                        </label>
                        {formik.touched.agree && formik.errors.agree ? (
                          <div className="invalid-feedback">
                            {formik.errors.agree}
                          </div>
                        ) : null}
                      </div>

                      <div className="mb-3 d-grid">
                        <button
                          className="btn btn-primary"
                          type="submit"
                          disabled={!formik.isValid || formik.isSubmitting}
                        >
                          Register
                        </button>
                      </div>

                       <div className="new-account mt-3 text-center">
                    <p className="font-w500">
                    Already have an account?{" "}
                      <Link
                        className="text-primary"
                        to="/login"
                        data-toggle="tab"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                    </form>
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

export default Register;
