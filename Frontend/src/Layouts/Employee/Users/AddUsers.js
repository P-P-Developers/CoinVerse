import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Form from "../../../Utils/Form/Formik";
import {
  AddUser,
  adminWalletBalance,
  TotalcountLicence,
} from "../../../Services/Admin/Addmin";
import { getAllClient } from "../../../Services/Superadmin/Superadmin";
import { getUserFromToken } from "../../../Utils/TokenVerify";

const AddUsers = () => {
  const navigate = useNavigate();
  const TokenData = getUserFromToken();

  const [dollarPrice, setDollarPrice] = useState(0);
  const [checkdolarprice, setCheckdolarprice] = useState(0);
  const [checkLicence, setCheckLicence] = useState([]);
  const [getid, setGetid] = useState([]);

  const Role = TokenData?.Role;
  const user_id = TokenData?.user_id;

  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      phone: "",
      employee_id: "",
      Balance: "",
      password: "",
      confirmPassword: "",
      Licence: "",
      limit: "",
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
      } else if (values.Licence > checkLicence) {
        errors.Licence = "You Don't have Enough Licence";
      } else if (
        isNaN(values.Licence) ||
        values.Licence < 1 ||
        values.Licence > 12
      ) {
        errors.Licence = "Licence should be a number between 1 and 12";
      }

      if (!values.selectedOption) {
        errors.selectedOption = "Please select an option";
      }
      if (!values.inputValue) {
        errors.inputValue = "Please enter a value for the selected option";
      }

      if (!values.limit) {
        errors.limit = "Please enter a value for Limit";
      } else if (
        isNaN(values.limit) ||
        values.limit < 0 ||
        values.limit > 100
      ) {
        errors.limit = "Limit should be a number between 0 and 100";
      }

      return errors;
    },

    onSubmit: async (values, { setSubmitting }) => {
      if (!values.Licence || values.Licence === "") {
        Swal.fire({
          title: "Error",
          text: "Licence is required",
          icon: "error",
          timer: 1000,
          timerProgressBar: true,
        });
      }

      const selectedOption = values.selectedOption;

      const data = {
        FullName: values.fullName,
        UserName: values.username.toString().toLowerCase(),
        Email: values.email.toString().toLowerCase(),
        PhoneNo: values.phone,
        employee_id: user_id,
        Balance: values.Balance,
        password: values.password,
        parent_role: Role || "EMPLOYE",
        parent_id: getid,
        Role: "USER",
        limit: values.limit,
        Licence: values.Licence,
        [selectedOption]: values.inputValue,
      };

      setSubmitting(false);

      if (
        dollarPrice == 0 ||
        dollarPrice == null ||
        dollarPrice === Infinity ||
        isNaN(dollarPrice)
      ) {
        Swal.fire({
          title: "Alert",
          text: "Please updated Dollarprice",
          icon: "warning",
          timer: 1000,
          timerProgressBar: true,
        });
        setSubmitting(false);
        return;
      }
      setSubmitting(false);

      if (parseInt(checkLicence.CountLicence) < parseInt(values.Licence)) {
        Swal.fire({
          title: "Alert",
          text: "Licence is required",
          icon: "warning",
          timer: 1000,
          timerProgressBar: true,
        });
        setSubmitting(false);
        return;
      }
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
            navigate("/employee/users");
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
    const data = { userid: getid };
    try {
      const response = await adminWalletBalance(data);

      setCheckdolarprice(response.dollarPriceDoc.dollarprice);
    } catch (error) {}
  };

  const getadminLicence = async () => {
    const data = { userid: getid };
    try {
      const response = await TotalcountLicence(data);
      setCheckLicence(response.data);
    } catch (error) {}
  };

  const getallclient = async () => {
    try {
      const data = { userid: user_id };
      const response = await getAllClient(data);
      if (response.status) {
        setGetid(response.data.parent_id);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getadminbalance();
    getadminLicence();
    getallclient();
  }, [getid]);

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
    ...(formik.values.selectedOption
      ? [
          {
            name: "inputValue",
            label:
              formik.values.selectedOption === "pertrade"
                ? "Per Trade"
                : "Per Lot",
            type: "text",
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
        btn_name1_route={"/employee/users"}
      />
      {formik.values.Balance && (
        <div>
          <p>Dollar Price: ${dollarPrice}</p>
        </div>
      )}
      ,
    </div>
  );
};

export default AddUsers;
