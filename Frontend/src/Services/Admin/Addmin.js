import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";



// Adding admin
export async function Admindashboarddata(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/GetDashboardData`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// Add user

export async function AddUser(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/AddUser`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// update Licence

export async function updateuserLicence(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/UserupdateLicence`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}

// update user data


export async function updateuserdata(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/updateUser`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// delete user  by admin 



export async function DeleteUserdata(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/DeleteUser`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}

// update Employe

export async function Update_Employe(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/Update_Employe`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// delete Employee



export async function delete_Employee(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/Delete_Employee`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// funds history status


export async function getFundstatus(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/getuserpaymentstatus`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}

// update status

export async function UpdatestatusForpaymenthistory(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/Updatestatus`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// margin required price

export async function MarginpriceRequired(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/marginupdate`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}

// getting margin price

export async function getMarginpriceRequired(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/getmarginprice`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// holoffsymbol

export async function symbolholdoff(data, token) {
    try {
        const res = await axios.get(`${Config.base_url}admin/getsymbolholdoff`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}

// update holdoff



export async function updatesymbolstatus(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/updatesymbolholoff`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// get trade history

export async function getpositionhistory(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}gettardehistory`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}

// get user history

export async function getuserhistory(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getOrderBook`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// balance and licence
export async function getbalancandLicence(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getbalancandLicence`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}



// sign in user detail


export async function getSignIn(data, token) {
    try {
        const res = await axios.get(`${Config.base_url}getSignIn`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// walletBalance

export async function adminWalletBalance(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/countuserBalance`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}



// total count licence

export async function TotalcountLicence(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}TotalcountLicence`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// manage logs of user logout 

export async function LogoutUser(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}logoutUser`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}