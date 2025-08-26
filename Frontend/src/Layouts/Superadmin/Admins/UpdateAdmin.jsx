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


  const formik = useFormik({
    initialValues: {
      fullName: rowData?.FullName || "",
      username: rowData?.UserName || "",
      email: rowData?.Email || "",
      phone: rowData?.PhoneNo || "",
      // Licence: rowData?.Licence || "",
      password: "",
      confirmPassword: "",
      FixedPerClient: false,
      FundAdd: false,
      EveryTransaction: false,
      AddClientBonus: "",
      FundLessThan100: "",
      FundLessThan500: "",
      FundLessThan1000: "",
      FundGreaterThan1000: "",
      FixedTransactionPercent: "",

      NetTransactionPercent: false,
      NetTransaction: "",
      Edit_balance: "",
      Fund_request: ""

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



      return errors;
    },

    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        id: rowData?._id,
        FullName: values.fullName,
        UserName: values.username,
        Email: values.email,
        PhoneNo: values.phone,
        // Licence: values.Licence,
        FixedPerClient: values.FixedPerClient,
        AddClientBonus: values.FixedPerClient ? values.AddClientBonus : 0,

        FundAdd: values.FundAdd,
        EveryTransaction: values.FundAdd ? values.EveryTransaction : 0,
        FundLessThan100: values.FundAdd ? values.FundLessThan100 : 0,
        FundLessThan500: values.FundAdd ? values.FundLessThan500 : 0,
        FundLessThan1000: values.FundAdd ? values.FundLessThan1000 : 0,
        FundGreaterThan1000: values.FundAdd ? values.FundGreaterThan1000 : 0,

        EveryTransaction: values.EveryTransaction,
        FixedTransactionPercent: values.EveryTransaction ? values.FixedTransactionPercent : 0,
        NetTransactionPercent: values.NetTransactionPercent,
        NetTransaction: values.NetTransactionPercent ? values.NetTransaction : 0,
        Edit_balance: values.Edit_balance === true ? 1 : 0,
        Fund_request: values.Fund_request === true ? 1 : 0

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
      // Licence: rowData?.Licence || "",
      ProfitMargin: rowData?.ProfitMargin || 0,
      password: "",
      confirmPassword: "",
      FixedPerClient: rowData?.FixedPerClient || false,
      FundAdd: rowData?.FundAdd || false,
      EveryTransaction: rowData?.EveryTransaction || false,
      AddClientBonus: rowData?.AddClientBonus || "",
      FundLessThan100: rowData?.FundLessThan100 || "",
      FundLessThan500: rowData?.FundLessThan500 || "",
      FundLessThan1000: rowData?.FundLessThan1000 || "",
      FundGreaterThan1000: rowData?.FundGreaterThan1000 || "",
      FixedTransactionPercent: rowData?.FixedTransactionPercent || "",
      NetTransactionPercent: rowData?.NetTransactionPercent || false,
      NetTransaction: rowData?.NetTransaction || "",
      Edit_balance: rowData?.Edit_balance == 1 ? true : false,
      Fund_request: rowData?.Fund_request == 1 ? true : false,

    });
  }, [rowData]);




  useEffect(() => {
    if (formik.values.FixedPerClient) {
      formik.setFieldValue("FundAdd", false);
    }
  }, [formik.values.FixedPerClient]);

  useEffect(() => {
    if (formik.values.FundAdd) {
      formik.setFieldValue("FixedPerClient", false);
    }
  }, [formik.values.FundAdd]);

  useEffect(() => {
    if (formik.values.EveryTransaction) {
      formik.setFieldValue("NetTransactionPercent", false);
      formik.setFieldValue("NetTransaction", "");
    }
  }, [formik.values.EveryTransaction]);

  useEffect(() => {
    if (formik.values.NetTransactionPercent) {
      formik.setFieldValue("EveryTransaction", false);
      formik.setFieldValue("FixedTransactionPercent", "");
    }
  }, [formik.values.NetTransactionPercent]);

  const fields = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      label_size: 6,
      col_size: 6,
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: true,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      label_size: 12,
      col_size: 6,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text3",
      label_size: 12,
      col_size: 6,
    },

    {
      name: "ProfitMargin",
      label: "Brokerage Sharing",
      type: "text4",
      label_size: 12,
      col_size: 6,
    },

    {
      name: "FixedPerClient",
      label: "Fixed (Per Client)",
      type: "checkbox",
      label_size: 12,
      col_size: 12,
    },
    {
      name: "AddClientBonus",
      label: "Add Client Bonus",
      type: "number",
      label_size: 12,
      col_size: 6,
      showWhen: (values) => values.FixedPerClient,
      disable: formik.values.FixedPerClient ? false : true,
    },
    {
      name: "FundAdd",
      label: "First-Time Funding Reward",
      type: "checkbox",
      label_size: 12,
      col_size: 12,
    },
    {
      name: "FundLessThan100",
      label: "Fund < 100",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: formik.values.FundAdd ? false : true,
    },
    {
      name: "FundLessThan500",
      label: "Fund < 500",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: formik.values.FundAdd ? false : true,

    },
    {
      name: "FundLessThan1000",
      label: "Fund < 1000",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: formik.values.FundAdd ? false : true,

    },
    {
      name: "FundGreaterThan1000",
      label: "Fund > 1000",
      type: "number",
      label_size: 12,
      col_size: 6,
      disable: formik.values.FundAdd ? false : true,


    },
    {
      name: "EveryTransaction",
      label: "Every Transaction %",
      type: "checkbox",
      label_size: 12,
      col_size: 12,
    },
    {
      name: "FixedTransactionPercent",
      label: "Fixed Transaction %",
      type: "text4",
      label_size: 12,
      col_size: 6,
      showWhen: (values) => values.EveryTransaction,
      disable: formik.values.EveryTransaction ? false : true,
    },

    {
      name: "NetTransactionPercent",
      label: "Net Transaction %",
      type: "checkbox",
      label_size: 12,
      col_size: 12,
    },

    {
      name: "NetTransaction",
      label: "Net Trasaction %",
      type: "text4",
      label_size: 12,
      col_size: 6,
      disable: true,
      showWhen: (values) => values.NetTransactionPercent,
      disable: formik.values.NetTransactionPercent ? false : true,
    },
    {
      name: "Edit_balance",
      label: "Edit Balance",
      type: "checkbox",
      label_size: 12,
      col_size: 12,
      disable: false,
    },
    {
      name: "Fund_request",
      label: "Withdrawal/deposite Request",
      type: "checkbox",
      label_size: 12,
      col_size: 12,
      disable: false,
    }

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
