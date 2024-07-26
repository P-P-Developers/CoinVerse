import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Form from "../../../Utils/Form/Formik";
import { AddUser } from "../../../Services/Admin/Addmin";

const AddUsers = () => {
  const navigate = useNavigate();

  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const Role = userDetails?.Role;
  const user_id = userDetails?.user_id;

  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      phone: "",
      Balance: "",
      password: "",
      confirmPassword: "",
      Licence: "",
      limit:"",
      selectedOption: "", 
      inputValue: "", 
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
      } else if (isNaN(values.Balance)) {
        errors.Balance = "Balance must be a number";
      }
      if (!values.password) {
        errors.password = "Please Enter Password";
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = "Please Confirm Password";
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
      if (!values.Licence) {
        errors.Licence = "Please Enter Licence";
      }
      if (!values.selectedOption) {
        errors.selectedOption = "Please select an option";
      }
      if (!values.inputValue) {
        errors.inputValue = "Please enter a value for the selected option";
      }
      if (!values.limit) {
        errors.limit = "Please enter a value for Limit";
      }

      return errors;
    },

    onSubmit: async (values, { setSubmitting }) => {
      const selectedOption = values.selectedOption;

      const data = {
        FullName: values.fullName,
        UserName: values.username,
        Email: values.email,
        PhoneNo: values.phone,
        Balance: values.Balance,
        password: values.password,
        parent_role: Role || "ADMIN",
        parent_id: user_id,
        Role: "USER",
        limit:values.limit,
        Licence: values.Licence,
        [selectedOption]: values.inputValue,
      };

      setSubmitting(false);

      try {
        const response = await AddUser(data);
        if (response.status) {
          Swal.fire({
            title: "User Added!",
            text: "User added successfully",
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            navigate("/admin/users");
          }, 1000);
        } else {
          Swal.fire({
            title: "Error!",
            text: response.message || "User add error",
            icon: "error",
            timer: 1000,
            timerProgressBar: true,
          });
        }
      } catch (error) {
        console.log("Error:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to add user. Please try again later.",
          icon: "error",
          timer: 3000,
          timerProgressBar: true,
        });
      }
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
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "Licence",
      label: "Licence",
      type: "text3",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "limit",
      label: "limit",
      type: "text3",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "selectedOption",
      label: "Brokerage",
      type: "select",
      options: [
        { value: "pertrade", label: "Per Trade" },
        { value: "perlot", label: "Per Lot" },
      
      ],
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "inputValue",
      label: formik.values.selectedOption
        ? formik.values.selectedOption === "pertrade"
          ? "Per Trade"
          : "Per Lot"
        : "Input Value",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
      showWhen: (values) => !!values.selectedOption,
    },

  ];

  return (
    <Form
      fields={fields}
      page_title="Add User"
      btn_name="Add User"
      btn_name1="Cancel"
      formik={formik}
      btn_name1_route={"/admin/users"}
    />
  );
};

export default AddUsers;
