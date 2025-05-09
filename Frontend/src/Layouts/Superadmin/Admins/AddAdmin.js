import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Form from "../../../Utils/Form/Formik";
import { AddnewUsers } from "../../../Services/Superadmin/Superadmin";
import { marginUpdateOnUserCreate } from "../../../Services/Admin/Addmin";

const AddAdmin = () => {

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
      password: "",
      confirmPassword: "",
      parent_id: "",
      parent_role: "",
      Role: "",
      Licence: "",
      ProfitMargin: "",
      FixedPerClient: false,
      FundAdd: false,
      EveryTransaction: false,
      AddClientBonus: "",
      FundLessThan100: "",
      FundLessThan500: "",
      FundLessThan1000: "",
      FundGreaterThan1000: "",
      FixedTransactionPercent: "",
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
      if (!values.password) {
        errors.password = "Please Enter Password";
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = "Please Confirm Password";
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
      if (!values.Licence) {
        errors.Licence = "Please Enter Licence"
      } 
   
      if (!values.ProfitMargin) {
        errors.ProfitMargin = "Please Enter Profit Margin";
      }
      if (values.FixedPerClient && !values.AddClientBonus) {
        errors.AddClientBonus = "Please Enter Add Client Bonus";
      }
      if (values.FundAdd) {
        if (!values.FundLessThan100) {
          errors.FundLessThan100 = "Please Enter Fund < 100";
        }
        if (!values.FundLessThan500) {
          errors.FundLessThan500 = "Please Enter Fund < 500";
        }
        if (!values.FundLessThan1000) {
          errors.FundLessThan1000 = "Please Enter Fund < 1000";
        }
        if (!values.FundGreaterThan1000) {
          errors.FundGreaterThan1000 = "Please Enter Fund > 1000";
        }
      }
      if (values.EveryTransaction && !values.FixedTransactionPercent) {
        errors.FixedTransactionPercent = "Please Enter Fixed Transaction %";
      }
      return errors;
    },

    onSubmit: async (values, { setSubmitting }) => {
      // Generate Referral Code
      const referralCode = `REF-${values.username}-${Math.random().toString(36).substr(2, 8)}`;

      const data = {
        FullName: values.fullName,
        UserName: values.username,
        Email: values.email,
        PhoneNo: values.phone,
        password: values.password,
        Licence: values.Licence,
        parent_role: Role || "SUPERADMIN",
        parent_id: user_id,
        Role: "ADMIN",
        ProfitMargin: values.ProfitMargin,
        ReferralCode: referralCode, // Add Referral Code to data
        FixedPerClient: values.FixedPerClient,
        FundAdd: values.FundAdd,
        EveryTransaction: values.EveryTransaction,
        AddClientBonus: values.AddClientBonus,
        FundLessThan100: values.FundLessThan100,
        FundLessThan500: values.FundLessThan500,
        FundLessThan1000: values.FundLessThan1000,
        FundGreaterThan1000: values.FundGreaterThan1000,
        FixedTransactionPercent: values.FixedTransactionPercent,
      };

      setSubmitting(false);

      await AddnewUsers(data)
        .then(async (response) => {
          if (response.status) {
            const data = {
              adminid: response.data._id,
              crypto: "100",
              dollarprice: "85",
              forex: "100",
            }
            const res = await marginUpdateOnUserCreate(data)
           


            Swal.fire({
              title: "Admin Added!",
              text: "Admin added successfully",
              icon: "success",
              timer: 1000,
              timerProgressBar: true,
            });
            setTimeout(() => {
              navigate("/superadmin/admin");
            }, 1000);
          } else {
            Swal.fire({
              title: "Error!",
              text: response.message || "Subadmin add error",
              icon: "error",
              timer: 1000,
              timerProgressBar: true,
            });
          }
        })
        .catch((error) => {
          return error
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
      name: "Licence",
      label: "Licence",
      type: "text3",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "ProfitMargin",
      label: "Brokerage Sharing (0-100%)",
      type: "text4",
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
      name: "FixedPerClient",
      label: "Fixed (Per Client)",
      type: "checkbox",
      label_size: 12,
      col_size: 12,
      disable: false,
    },
    {
      name: "AddClientBonus",
      label: "Add Client Bonus",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
      showWhen: (values) => values.FixedPerClient,
    },
    {
      name: "FundAdd",
      label: "First-Time Funding Reward",
      type: "checkbox",
      label_size: 12,
      col_size:  12,
      disable: false,
    },
    {
      name: "FundLessThan100",
      label: "Fund < 100",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
      showWhen: (values) => values.FundAdd,
    },
    {
      name: "FundLessThan500",
      label: "Fund < 500",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
      showWhen: (values) => values.FundAdd,
    },
    {
      name: "FundLessThan1000",
      label: "Fund < 1000",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
      showWhen: (values) => values.FundAdd,
    },
    {
      name: "FundGreaterThan1000",
      label: "Fund > 1000",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
      showWhen: (values) => values.FundAdd,
    },
    {
      name: "EveryTransaction",
      label: "Every Transaction %",
      type: "checkbox",
      label_size: 12,
      col_size: 12,
      disable: false,
    },
    {
      name: "FixedTransactionPercent",
      label: "Fixed Transaction %",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
      showWhen: (values) => values.EveryTransaction,
    },
  ];

  useEffect(() => {
    formik.setFieldValue("FundLessThan100", 0);
    formik.setFieldValue("FundLessThan500", 0);
    formik.setFieldValue("FundLessThan1000", 0);
    formik.setFieldValue("FundGreaterThan1000", 0);

  }, [formik.values.FundAdd]);

  useEffect(() => {
    formik.setFieldValue("AddClientBonus", 0);
  }, [formik.values.FixedPerClient]);

  useEffect(() => {
    formik.setFieldValue("FixedTransactionPercent", 0);
  }
, [formik.values.EveryTransaction]);

  return (
    <Form
      fields={fields.filter(
        (field) => !field.showWhen || field.showWhen(formik.values)
      )}
      page_title="Add Admin"
      btn_name="Submit"
      btn_name1="Cancel"
      formik={formik}
      btn_name1_route={"/superadmin/admin"}
    />
  );
};

export default AddAdmin;
