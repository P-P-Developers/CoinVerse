import React, { useState, useEffect } from 'react';
import { Companydata, getCompanyApi } from '../../../Services/Superadmin/Superadmin';
import Swal from 'sweetalert2';

const Settings = () => {
    const [plan, setPlan] = useState({
        Basic_plan: '',
        Standard_plan: '',
        Premium_plan: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        getcompanydata();
    }, []);

    const getcompanydata = async () => {
        try {
            const res = await getCompanyApi();
            if (res?.status) {
                setPlan({
                    Basic_plan: res?.data?.Basic_plan,
                    Standard_plan: res?.data?.Standard_plan,
                    Premium_plan: res?.data?.Premium_plan
                });
            }
        } catch (error) {
            console.error("Failed to fetch company data:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlan(prev => ({ ...prev, [name]: value }));
        if (touched[name]) validateField(name, value);
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let errorMsg = '';
        if (!value || value.toString().trim() === '') {
            errorMsg = 'This field is required.';
        }
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        Object.keys(plan).forEach(key => {
            if (!plan[key] || plan[key].toString().trim() === '') {
                newErrors[key] = 'This field is required.';
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTouched({ Basic_plan: true, Standard_plan: true, Premium_plan: true });
            return;
        }

        try {
            const res = await Companydata(plan);
            if (res.status) {
                Swal.fire({
                    title: "Success",
                    text: res.message || "Plan updated successfully",
                    icon: "success",
                    timer: 1000,
                    timerProgressBar: true,
                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: res.message,
                    icon: "error",
                    timer: 1000,
                    timerProgressBar: true,
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Something went wrong.",
                icon: "error",
            });
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <form
                onSubmit={handleSubmit}
                className="bg-white border rounded-4 shadow p-5 w-100"
                style={{ maxWidth: '500px' }}
            >
                <h2 className="text-center mb-4">Update Plans</h2>

                {["Basic_plan", "Standard_plan", "Premium_plan"].map((field) => (
                    <div className="mb-3" key={field}>
                        <label htmlFor={field} className="form-label fw-semibold">
                            {field.replace("_", " ")}
                        </label>
                        <input
                            id={field}
                            name={field}
                            type="number"
                            value={plan[field]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${errors[field] && touched[field] ? 'is-invalid' : ''}`}
                            placeholder={`Enter ${field.replace("_", " ")}`}
                        />
                        {errors[field] && touched[field] && (
                            <div className="invalid-feedback">{errors[field]}</div>
                        )}
                    </div>
                ))}

                <button type="submit" className="btn btn-primary w-100">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Settings;
