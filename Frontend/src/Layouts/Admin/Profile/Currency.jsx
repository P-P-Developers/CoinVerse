import React, { useEffect, useState } from "react";
import { MarginpriceRequired, getMarginpriceRequired } from "../../../Services/Admin/Addmin";
import Swal from 'sweetalert2';
import { getUserFromToken } from "../../../Utils/TokenVerify";


const Setting = () => {
          const TokenData = getUserFromToken();

    const user_id = TokenData?.user_id;



    const [updatemargin, setUpdatemargin] = useState({
        adminid: "",
        forex: "",
        crypto: "",
        dollarprice: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatemargin((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    
    const updateMargin = async () => {
        try {

            if (!updatemargin.forex || !updatemargin.crypto || !updatemargin.dollarprice) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Invalid Input',
                    text: 'Please ensure all values are non-zero and not null.',
                });
                return; 
            }

            const response = await MarginpriceRequired({
                adminid: user_id,
                forex: updatemargin.forex,
                crypto: updatemargin.crypto,
                dollarprice: updatemargin.dollarprice
            });


            if (response.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Margin updated successfully!',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error updating margin: ${error.message}`,
            });
        }
    };



    const getmarginprice = async () => {
        try {
            const data = { id: user_id };
            const response = await getMarginpriceRequired(data);

            if (response.status) {
                setUpdatemargin({
                    adminid: user_id,
                    forex: response.data.forex,
                    crypto: response.data.crypto,
                    dollarprice: response.data.dollarprice

                });
            }
        } catch (error) {
        }
    };



    useEffect(() => {
        getmarginprice();
    }, []);


    // useEffect(() => {
    //     getmarginprice()
    // }, [])

    
    return (
        <div>
            <div className="container-fluid" style={{ minHeight: 723 }}>
                <div className="row">
                    <div className="col-xl-12 col-lg-12">
                        <div className="card profile-card card-bx ">
                            <div className="card-header">
                                <h6 className="card-title">Account setup</h6>
                            </div>
                            <form className="profile-form">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-4 mb-3">
                                            <label className="form-label">Forex Margin</label>
                                            <input
                                                type="number"
                                                name="forex"
                                                className="form-control"
                                                placeholder="enter forx margin"
                                                value={updatemargin.forex}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-sm-4 mb-3">
                                            <label className="form-label">Crypto Margin</label>
                                            <input
                                                type="number"
                                                name="crypto"
                                                className="form-control"
                                                placeholder="enter margin"
                                                value={updatemargin.crypto}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-sm-4 mb-3">
                                            <label className="form-label">Dollar Price</label>
                                            <input
                                                type="number"
                                                name="dollarprice"
                                                className="form-control"
                                                placeholder="enter dollar price"
                                                value={updatemargin.dollarprice}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer align-items-center d-flex">
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        onClick={updateMargin}
                                    >
                                        UPDATE
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Setting;