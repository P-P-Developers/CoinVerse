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