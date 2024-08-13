import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";


// Add employee
export async function Employee_request(data, token) {
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