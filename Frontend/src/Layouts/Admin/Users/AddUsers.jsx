import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Form from "../../../Utils/Form/Formik";
import { AddUser } from "../../../Services/Admin/Addmin";
import { getUserdata } from "../../../Services/Superadmin/Superadmin";
import { getUserFromToken } from "../../../Utils/TokenVerify";

const AddUsers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const TokenData = getUserFromToken();
  const clientData = location.state?.clientData || {};
  const [data, setData] = useState([]);
  const Role = TokenData?.Role;
  const user_id = TokenData?.user_id;

  useEffect(() => {
    getAlluserdata();
  }, []);

  const formik = useFormik({
    initialValues: {
      fullName: clientData.FullName || "",
      username: clientData.UserName?.toString().toLowerCase() || "",
      email: "",
      phone: clientData.PhoneNo || "",
      employee_id: "",
      Balance: "",
      password: clientData.password || "",
      confirmPassword: "",

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
      // if (!values.Balance) {
      //   errors.Balance = "Please Enter Balance";
      // } else if (isNaN(values.Balance)) {
      //   errors.Balance = "Balance must be a number";
      // }

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

      if (!values.limit) {
        errors.limit = "Please enter a value for Limit";
      } else if (
        isNaN(values.limit) ||
        values.limit < 0 ||
        values.limit > 10000
      ) {
        errors.limit = "Limit should be a number between 0 and 10000";
      }

      // Option validation
      if (!values.selectedOption) {
        errors.selectedOption = "Please select an option";
      }

      // Input value validation based on selected option
      if (!values.inputValue) {
        errors.inputValue = "Please enter a value for the selected option";
      }

      return errors;
    },

    onSubmit: async (values, { setSubmitting }) => {
      const selectedOption = values.selectedOption;

      const data = {
        FullName: values.fullName,
        UserName: values.username.toString().toLowerCase(),
        Email: values.email.toString().toLowerCase(),
        PhoneNo: values.phone,
        employee_id: values.employee_id,
        Balance: values.Balance,
        password: values.password,
        parent_role: Role || "ADMIN",
        parent_id: user_id,
        Role: "USER",
        limit: values.limit,
        [selectedOption]: values.inputValue,
        referred_by: location?.state?.clientData?.referred_by || null,
        referral_price: location?.state?.clientData?.referral_price || 0,
        singleUserId: location?.state?.clientData?._id || null,
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
    } catch (error) { }
  };

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
    //   name: "Balance",
    //   label: "Balance",
    //   type: "text",
    //   label_size: 12,
    //   col_size: 6,
    //   disable: false,
    // },
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
      name: "limit",
      label: "Margin",
      type: "percentage",
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
    ...(formik.values.selectedOption
      ? [
        {
          name: "inputValue",
          label:
            formik.values.selectedOption === "pertrade"
              ? "Per Trade"
              : formik.values.selectedOption === "transactionwise"
                ? "Transaction-Wise %"
                : "Per Lot",
          type: "percentage",
          label_size: 12,
          col_size: 6,
          disable: false,
        },
      ]
      : []),
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
    </div>
  );
};

export default AddUsers;
