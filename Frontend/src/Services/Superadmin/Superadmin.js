import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";

// Adding admin
export async function Addnewadmin(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}superadmin/addminadd`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// get admin data 

export async function getadmindata(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}superadmin/getAdminDetail`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// get admin recharge


export async function Addbalance(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/walletRecharge`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// get admn user_active_status


export async function updateActivestatus(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/UpdateActiveStatusAdmin`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// get history


export async function gethistory(data, token) {
    try {
        const res = await axios.get(`${Config.base_url}admin/getadminhistory`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// get active status 

export async function getadminActivestatus(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}admin/getActivestatus`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}