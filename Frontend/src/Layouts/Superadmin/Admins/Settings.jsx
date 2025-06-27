import React, { useState, useEffect } from 'react';
import { Companydata, getCompanyApi } from '../../../Services/Superadmin/Superadmin';
import Swal from 'sweetalert2';

const Settings = () => {


    const [plan, setPlan] = useState('');
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);



    useEffect(() => {
        getcompanydata();
    }, []);



    const getcompanydata = async () => {
        try {
            const res = await getCompanyApi();
            if (res?.status) {
                setPlan(res?.data?.plan || '')
            }
        } catch (error) {
            console.error("Failed to fetch company data:", error);
        }
    };




    const handleChange = (e) => {
        setPlan(e.target.value);
        if (touched) validate(e.target.value);
    };



    const handleBlur = () => {
        setTouched(true);
        validate(plan);
    };




    const validate = (value) => {
        if (!value.trim()) {
            setError('Plan is required.');
        } else {
            setError('');
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { plan: plan };
        try {
            const res = await Companydata(data);
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
                <h2 className="text-center mb-4">Update Plan</h2>

                <div className="mb-3">
                    <label htmlFor="plan" className="form-label fw-semibold">
                        Plan
                    </label>
                    <input
                        id="plan"
                        type="number"
                        value={plan}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-control ${error && touched ? 'is-invalid' : ''}`}
                        placeholder="Enter your plan"
                    />
                    {error && touched && (
                        <div className="invalid-feedback">{error}</div>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Settings;
