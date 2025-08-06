import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { UpdatePlanTypedata } from '../../../Services/Admin/Addmin';
import { getUserFromToken } from '../../../Utils/TokenVerify';
import { getAllClient } from '../../../Services/Superadmin/Superadmin';

const PlanSubscription = () => {
    const TokenData = getUserFromToken();

    const [plans, setPlans] = useState({
        Basic_plan: '',
        Standard_plan: '',
        Premium_plan: '',
    });



    useEffect(() => {
        getAllClientData();
    }, []);

    const getAllClientData = async () => {
        try {
            const data = { userid: TokenData?.user_id };
            const response = await getAllClient(data);

            if (response.status) {
                const clientData = response.data;
                setPlans({
                    Basic_plan: clientData.Basic_plan || '',
                    Standard_plan: clientData.Standard_plan || '',
                    Premium_plan: clientData.Premium_plan || '',
                });
            }
        } catch (error) {
            console.error("Error fetching client data:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlans((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        try {
            const data = {
                adminId: TokenData?.user_id,
                Basic_plan: plans.Basic_plan,
                Standard_plan: plans.Standard_plan,
                Premium_plan: plans.Premium_plan,
            };

            const response = await UpdatePlanTypedata(data);

            if (response?.status) {
                Swal.fire({
                    icon: "success",
                    title: "Plan Updated",
                    text: "The plans have been updated successfully.",
                });
            } else {
                throw new Error("Update failed");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: "There was an error updating the plans. Please try again.",
            });
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="card p-4 shadow">
                    <div className="mb-3">
                        <label className="form-label">Basic Plan</label>
                        <input
                            type="number"
                            className="form-control"
                            name="Basic_plan"
                            value={plans.Basic_plan}
                            onChange={handleChange}
                            placeholder="Enter Basic Plan Price"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Standard Plan</label>
                        <input
                            type="number"
                            className="form-control"
                            name="Standard_plan"
                            value={plans.Standard_plan}
                            onChange={handleChange}
                            placeholder="Enter Standard Plan Price"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Premium Plan</label>
                        <input
                            type="number"
                            className="form-control"
                            name="Premium_plan"
                            value={plans.Premium_plan}
                            onChange={handleChange}
                            placeholder="Enter Premium Plan Price"
                        />
                    </div>
                    <div className="text-center">
                        <button className="btn btn-primary" onClick={handleUpdate}>
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanSubscription;
