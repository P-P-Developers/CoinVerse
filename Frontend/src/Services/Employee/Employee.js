import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";


// Add employee
export async function getEmployeedata(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getEmployeedata`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}

// get employee permission data 


export async function getEmployee_permissiondata(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getEmployee_permissiondata`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// get employee user detail  getEmployeeUserHistory

export async function getEmployeeUserHistory(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getEmployeeUserHistory`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// dashboard data

export async function getEmployeeUserdata(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}GetEmployeeUserDashboardData`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// get employee user position data

export async function getEmployeeUserposition(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getEmployeeUserposition`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}

        // GetBrokerageData for employee

export async function getAllBrokerageDataForEmployee(data) {
    try {
        const res = await axios.post(`${Config.base_url}getEmployeeBrokerageData`, data, {
            data:{}
        })
        console.log("res from getAllBrokerageData is ",res)
        return await res?.data;
    }
    catch (err) {
        return await err;

    }
}