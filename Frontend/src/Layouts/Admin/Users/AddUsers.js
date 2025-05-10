import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Form from "../../../Utils/Form/Formik";
import {
  AddUser,
  adminWalletBalance,
  marginUpdateOnUserCreate,
  TotalcountLicence,
  updateuserLicence,
} from "../../../Services/Admin/Addmin";
import { getUserdata } from "../../../Services/Superadmin/Superadmin";


const AddUsers = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const clientData = location.state?.clientData || {};

  const [checkprice, setCheckprice] = useState("");
  const [dollarPrice, setDollarPrice] = useState(0);
  const [checkdolarprice, setCheckdolarprice] = useState(0);
  const [checkLicence, setCheckLicence] = useState([]);


  const [data, setData] = useState([]);

  const userDetails = JSON.parse(localStorage.getItem("user_details"));
  const Role = userDetails?.Role;
  const user_id = userDetails?.user_id;

  const formik = useFormik({
    initialValues: {
      fullName: clientData.FullName || "",
      username: clientData.UserName || "",
      email: "",
      phone: clientData.PhoneNo || "",
      employee_id: "",
      Balance: "",
      password: clientData.password || "",
      confirmPassword: "",
      Licence: "",
      limit: "",
      selectedOption: "",
      inputValue: "",
    },

    validate: (values) => {
      let errors = {};

      // Full name validation
      if (!values.fullName) {
        errors.fullName = "Please Enter Full Name";
      }

      // Username validation
      if (!values.username) {
        errors.username = "Please Enter Username";
      }

      // Email validation
      if (!values.email) {
        errors.email = "Please Enter Email Address";
      } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = "Please enter a valid email address.";
      }

      // Phone validation
      if (!values.phone) {
        errors.phone = "Please Enter Phone Number";
      } else if (!/^\d{10}$/.test(values.phone)) {
        errors.phone = "Please enter a valid 10-digit phone number.";
      }

      // Balance validation
      if (!values.Balance) {
        errors.Balance = "Please Enter Balance";
      } else if (isNaN(values.Balance)) {
        errors.Balance = "Balance must be a number";
      }

      // Password validation
      if (!values.password) {
        errors.password = "Please Enter Password";
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }

      // Confirm password validation
      if (!values.confirmPassword) {
        errors.confirmPassword = "Please Confirm Password";
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      // Licence validation (should be between 0 and 12)
      if (!values.Licence) {
        errors.Licence = "Please Enter Licence";
      }
      else if (values.Licence > checkLicence) {
        errors.Licence = "You Don't have Enough Licence"
      } else if (isNaN(values.Licence) || values.Licence < 1 || values.Licence > 12) {
        errors.Licence = "Licence should be a number between 1 and 12";
      }

      // Limit validation (should be between 0 and 100 and in percentage format)
      if (!values.limit) {
        errors.limit = "Please enter a value for Limit";
      } else if (isNaN(values.limit) || values.limit < 0 || values.limit > 100) {
        errors.limit = "Limit should be a number between 0 and 100";
      }

      // Option validation
      if (!values.selectedOption) {
        errors.selectedOption = "Please select an option";
      }

      // Input value validation based on selected option
      if (!values.inputValue) {
        errors.inputValue = "Please enter a value for the selected option";
      }

      // Employee validation
      // if (!values.employee_id) {
      //   errors.employee_id = "Please select an Employee";
      // }

      return errors;
    },

    onSubmit: async (values, { setSubmitting }) => {
      const selectedOption = values.selectedOption;

      const data = {
        FullName: values.fullName,
        UserName: values.username,
        Email: values.email,
        PhoneNo: values.phone,
        employee_id: values.employee_id,
        Balance: values.Balance,
        password: values.password,
        parent_role: Role || "ADMIN",
        parent_id: user_id,
        Role: "USER",
        limit: values.limit,
        Licence: values.Licence,
        [selectedOption]: values.inputValue,
        referred_by: location?.state?.clientData?.referred_by || null,
      };

      setSubmitting(false);

      // if (dollarPrice == 0 || dollarPrice == null || dollarPrice === Infinity || isNaN(dollarPrice)) {
      //   Swal.fire({
      //     title: "Alert",
      //     text: "Please update Dollar price",
      //     icon: "warning",
      //     timer: 1000,
      //     timerProgressBar: true,
      //   });
      //   setSubmitting(false);
      //   return;
      // }

      if (parseInt(checkLicence.CountLicence) < parseInt(values.Licence)) {
        Swal.fire({
          title: "Insufficient License",
          text: "You don't have enough licenses to proceed.",
          icon: "warning",
          timer: 2500,
          timerProgressBar: true,
        });

        setSubmitting(false);
        return;
      }

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



  const getadminbalance = async () => {
    const data = { userid: user_id };
    try {
      const response = await adminWalletBalance(data);
      setCheckprice(response.Balance);
      setCheckdolarprice(response.dollarPriceDoc.dollarprice);
    } catch (error) {

    }
  };

  const getadminLicence = async () => {
    const data = { userid: user_id };
    try {
      const response = await TotalcountLicence(data);
      setCheckLicence(response.data);
    } catch (error) {

    }
  };

  const getAlluserdata = async () => {
    const data = { id: user_id };
    try {
      const response = await getUserdata(data);

      const result =
        response.data &&
        response.data.filter((item) => {
          return item.Role === "EMPLOYE";
        });
      setData(result);
    } catch (error) {

    }
  };


  useEffect(() => {
    getadminbalance();
    getadminLicence();
    getAlluserdata();
  }, []);

  useEffect(() => {
    const exchangeRate = Number(checkdolarprice);
    setDollarPrice(
      formik.values.Balance
        ? parseFloat(formik.values.Balance) / exchangeRate
        : 0
    );
  }, [formik.values.Balance]);




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
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "employee_id",
      label: "Employee",
      type: "select",
      options: [

        ...(data
          ? data.map((item) => ({

            label: item.UserName,
            value: item._id,
          }))
          : []),
      ],
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
      label: "Licence(1-12)",
      type: "text3",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "limit",
      label: "Margin(0-100%)",
      type: "text3",
      label_size: 12,
      col_size: 6,
      disable: false,
      min: 0,
      max: 12,
    },
    {
      name: "selectedOption",
      label: "Brokerage",
      type: "select",
      options: [
        { value: "pertrade", label: "Per Trade" },
        { value: "perlot", label: "Per Lot" },
        { value: "transactionwise", label: "Transaction-Wise" },
      ],
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    ...(formik.values.selectedOption ? [
      {
        name: "inputValue",
        label:
          formik.values.selectedOption === "pertrade"
            ? "Per Trade"
            : formik.values.selectedOption === "transactionwise"
            ? "Transaction-Wise %" 
            : "Per Lot",      
        type: "text",
        label_size: 12,
        col_size: 6,
        disable: false,
      },
    ] : []),

  ];

  return (
    <div>
      <Form
        fields={fields}
        page_title="Add User"
        btn_name="Add User"
        btn_name1="Cancel"
        formik={formik}
        btn_name1_route={"/admin/users"}
      />
      {/* {formik.values.Balance && (
        <div>
          <p>Dollar Price: ${dollarPrice}</p>
        </div>
      )} */}
      ,
    </div>
  );
};

export default AddUsers;

