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
      parent_role:"" ,
      Role:"",
     
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
        parent_id:user_id,
        Role:"ADMIN",

      };


      setSubmitting(false);

      await Addnewadmin(data)
        .then(async (response) => {
            console.log(response)
          if (response.status) {
           
            Swal.fire({
              title: "Subadmin Added!",
              text:"subadmin added successfully",
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
    <>
      <Form
        fields={fields.filter(
          (field) => !field.showWhen || field.showWhen(formik.values)
        )}
    
        page_title="Add Admin"
        btn_name="Add Subadmin"
        btn_name1="Cancel"
        formik={formik}
        btn_name1_route={"/superadmin/admin"}
      />
      
    </>
  );
};

export default AddAdmin;
