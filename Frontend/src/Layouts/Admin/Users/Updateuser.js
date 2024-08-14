import React, { useEffect,useState } from "react";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Form from "../../../Utils/Form/Formik"; // Assuming this is your custom Form component
import { updateuserdata } from "../../../Services/Admin/Addmin";
import { getUserdata } from "../../../Services/Superadmin/Superadmin";

const Updateuser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rowData } = location.state;

  const [data, setData] = useState([]);


  // Retrieving user details from localStorage (ensure secure usage)
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
      employee_id:"",
      Licence: "",
      limit: "",
      selectedOption: "",
      inputValue: "",
    },
    validate: (values) => {
      let errors = {};
      // Validation rules for form fields
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
      if (!values.employee_id) {
        errors.employee_id = "Please select a Employee";
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      const selectedOption = values.selectedOption;
      const data = {
        id: rowData && rowData._id,
        limit: values.limit,
        employee_id:values.employee_id,
        Licence: values.Licence,
        [selectedOption]: values.inputValue,
      };
      setSubmitting(false);
      try {
        const response = await updateuserdata(data);
        if (response.status) {
          Swal.fire({
            title: "User Updated!",
            text: "User updated successfully",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            navigate("/admin/users");
          }, 2000);
        } else {
          Swal.fire({
            title: "Error!",
            text: response.message || "User update error",
            icon: "error",
            timer: 3000,
            timerProgressBar: true,
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to update user. Please try again later.",
          icon: "error",
          timer: 3000,
          timerProgressBar: true,
        });
      }
    },
  });



  useEffect(() => {
    if (rowData) {
      const determineSelectedOption = () => {
        if (rowData.pertrade !== undefined) return "pertrade";
        if (rowData.perlot !== undefined) return "perlot";
        return "pertrade"; 
      };

      formik.setValues({
        fullName: rowData.FullName || "",
        username: rowData.UserName || "",
        email: rowData.Email || "",
        phone: rowData.PhoneNo || "",
        Balance: rowData.Balance || "",
        employee_id:rowData.employee_id || "",
        Licence: rowData.Licence || "",
        selectedOption: rowData.selectedOption || determineSelectedOption(),
        inputValue:
          rowData.pertrade ||
          rowData.perlot ||
          "",
        limit: rowData.limit || "",
      });
    }
  }, [rowData]);



  const getInputValueLabel = (selectedOption) => {
    if (selectedOption === "pertrade") return "Enter Value for Per Trade";
    if (selectedOption === "perlot") return "Enter Value for Per Lot";
    return "Enter Value";
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
      console.log("error", error);
    }
  };


  useEffect(() => {
    getAlluserdata();
  }, []);


  // Form fields configuration
  const fields = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      label_size: 6,
      col_size: 6,
      disable: true,
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
      disable: true,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text3",
      label_size: 12,
      col_size: 6,
      disable: true,
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
      name: "employee_id",
      label: "Employee",
      type: "select",
      options: [
        { label: "None", value: "none" }, 
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
      name: "Licence",
      label: "Licence",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "limit",
      label: "Limit",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "selectedOption",
      label: "Select One Option",
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
      label: getInputValueLabel(formik.values.selectedOption),
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
      page_title="Update User"
      btn_name="Update User"
      btn_name1="Cancel"
      formik={formik}
      btn_name1_route={"/admin/users"} 
    />
  );
};

export default Updateuser;
