import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Form from "../../../Utils/Form/Formik";
import { Update_admin } from "../../../Services/Superadmin/Superadmin";


const UpdateAdmin = () => {

  const navigate = useNavigate();


  const location = useLocation();
  const { rowData } = location.state;

  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const Role = userDetails?.Role;
  const user_id = userDetails?.user_id;

  const formik = useFormik({
    initialValues: {
      fullName: rowData?.FullName || "",
      username: rowData?.UserName || "",
      email: rowData?.Email || "",
      phone: rowData?.PhoneNo || "",
      Licence: rowData?.Licence || "",
      password: "",
      confirmPassword: ""
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
      if (!values.Licence) {
        errors.Balance = "Please Enter Balance";
      }
      // Add password validation if necessary
      // if (!values.password) {
      //   errors.password = "Please Enter Password";
      // } else if (values.password !== values.confirmPassword) {
      //   errors.confirmPassword = "Passwords do not match";
      // }

      return errors;
    },
    
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        id: rowData?._id,
        FullName: values.fullName,
        UserName: values.username,
        Email: values.email,
        PhoneNo: values.phone,
        Licence: values.Licence,
        // Password: values.password,
      };

      setSubmitting(false);

      try {
        const response = await Update_admin(data);
        if (response.status) {
          Swal.fire({
            title: "Admin Updated!",
            text: "Admin updated successfully",
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            navigate("/superadmin/admin");
          }, 1500);
        } else {
          Swal.fire({
            title: "Error!",
            text: response.message || "Admin update error",
            icon: "error",
            timer: 1500,
            timerProgressBar: true,
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to Update Admin",
          icon: "error",
          timer: 1500,
          timerProgressBar: true,
        });
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      fullName: rowData?.FullName || "",
      username: rowData?.UserName || "",
      email: rowData?.Email || "",
      phone: rowData?.PhoneNo || "",
      Licence: rowData?.Licence || "",
      ProfitMargin: rowData?.ProfitMargin || "",
      password: "",
      confirmPassword: ""
    });
  }, [rowData]);

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
    // {
    //   name: "Licence",
    //   label: "Licence",
    //   type: "text3",
    //   label_size: 12,
    //   col_size: 6,
    //   disable: false,
    // },
    {
      name: "ProfitMargin",
      label: "Profit Margin",
      type: "text4",
      label_size: 12,
      col_size: 6,
      disable: true,
    },

    // {
    //   name: "password",
    //   label: "Password",
    //   type: "password",
    //   label_size: 12,
    //   col_size: 6,
    //   disable: false,
    // },
    // {
    //   name: "confirmPassword",
    //   label: "Confirm Password",
    //   type: "password",
    //   label_size: 12,
    //   col_size: 6,
    //   disable: false,
    // },
  ];

  return (
    <Form
      fields={fields}
      page_title="Update Admin"
      btn_name="Update Admin"
      btn_name1="Cancel"
      formik={formik}
      btn_name1_route={"/superadmin/admin"}
    />
  );
};

export default UpdateAdmin;
