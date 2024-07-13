import React, { useState, useEffect } from "react";
import Form from "../../../Utils/Form/Formik"
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Addnewadmin } from "../../../Services/Superadmin/Superadmin";

const AddAdmin = () => {

  const navigate = useNavigate();

  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const Role = userDetails?.Role;
  const user_id = userDetails?.user_id




  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      phone: "",
      Balance: "",
      password: "",
      parent_id: "",
      parent_role: "",
      Role: "",

      // prefix_key:''
    },
    validate: (values) => {
      let errors = {};
      if (!values.fullName) {
        errors.fullName = "Please Enter Full Name";
      }
      if (!values.username) {
        errors.username = "Please Enter Username";
      }
      if (!values.email) {
        errors.email = "Please Enter Email Address";
      } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = "Please enter a valid email address.";
      }

      if (!values.phone) {
        errors.phone = "Please Enter Phone Number";
      } else if (!/^\d{10}$/.test(values.phone)) {
        errors.phone = "Please enter a valid 10-digit phone number.";
      }
      if (!values.Balance) {
        errors.Balance = "Please Enter Balance";
      }
      if (!values.password) {
        errors.password = "Please Enter Password";
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        FullName: values.fullName,
        UserName: values.username,
        Email: values.email,
        PhoneNo: values.phone,
        Balance: values.Balance,
        password: values.password,
        parent_role: Role || "SUPERADMIN",
        parent_id: user_id,
        Role: "ADMIN",

      };


      setSubmitting(false);

      await Addnewadmin(data)
        .then(async (response) => {
          console.log(response)
          if (response.status) {

            Swal.fire({
              title: "Subadmin Added!",
              text: "subadmin added successfully",
              icon: "success",
              timer: 1000,
              timerProgressBar: true,
            });
            setTimeout(() => {
              navigate("/admin/allsubadmin");
            }, 1000);
          }
          else {
            Swal.fire({
              title: "Error !",
              text: response.message || "subadmin add error",
              icon: "error",
              timer: 1000,
              timerProgressBar: true,
            });
          }
        })
        .catch((error) => {
          console.log("Error :", error)

        });
    },
  });

  const fields = [

    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      label_size: 6,
      col_size: 6,
      disable: false,
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text3",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "Balance",
      label: "Balance",
      type: "text3",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      label_size: 12,
      col_size: 6,
      disable: false,
    },

  ];




  return (
    // <>
    //   <Form
    //     fields={fields.filter(
    //       (field) => !field.showWhen || field.showWhen(formik.values)
    //     )}

    //     page_title="Add Admin"
    //     btn_name="Add Subadmin"
    //     btn_name1="Cancel"
    //     formik={formik}
    //     btn_name1_route={"/superadmin/admin"}
    //   />

    // </>
    <div>
      <div className="container-fluid">
        {/* row */}
        <div className="row">

          <div className="col-xl-12 col-lg-12">
            <div className="card profile-card card-bx m-b30">
              <div className="card-header">
                <h4 className="card-title">Add Admin</h4>
              </div>
              <form className="profile-form">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="Name">
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="John"
                          id="Name"
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="Surname">
                          Surname
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="osib"
                          id="Surname"
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="Specialty">
                          Specialty
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Developer"
                          id="Specialty"
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="Skills">
                          Skills
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="HTML,  JavaScript,  PHP"
                          id="Skills"
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <label className="form-label">Gender</label>
                        <select className=" form-control" id="validationCustom05">
                          <option data-display="Select">Please select</option>
                          <option value="html">Male</option>
                          <option value="css">Female</option>
                          <option value="javascript">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="datepicker">
                          DOB
                        </label>
                        <div className="input-hasicon mb-xl-0 mb-3">
                          <input
                            className="form-control mb-xl-0 mb-3 bt-datepicker"
                            type="text"
                            id="datepicker"
                          />
                          <div className="icon">
                            <i className="far fa-calendar" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={12345}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="Email">
                          Email address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="demo@gmail.com"
                          id="Email"
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <label className="form-label">Country</label>
                        <select
                          className="default-select form-control"
                          id="validationCustom01"
                        >
                          <option data-display="Select">Please select</option>
                          <option value="russia">Russia</option>
                          <option value="canada">Canada</option>
                          <option value="china">China</option>
                          <option value="india">India</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-6 m-b30">
                      <div className="mb-3">
                        <label className="form-label">City</label>
                        <select
                          className="form-control default-select"
                          id="validationCustom02"
                        >
                          <option data-display="Select">Please select</option>
                          <option>Krasnodar</option>
                          <option>Tyumen</option>
                          <option>Chelyabinsk</option>
                          <option>Moscow</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary btn-sm">UPDATE</button>
                  <a
                    href="page-forgot-password.html"
                    className="text-hover float-end"
                  >
                    Forgot your password?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>



    </div>
  );
};

export default AddAdmin;
