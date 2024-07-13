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