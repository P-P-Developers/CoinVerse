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