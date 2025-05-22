import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";

axios.defaults.withCredentials = true; // Send cookies with every request

// Adding admin
export async function AddnewUsers(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}superadmin/addminadd`,
      data,
      {
        data: {},
      }
    );
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// get admin data

export async function getUserdata(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}superadmin/getAdminDetail`,
      data,
      {
        data: {},
      }
    );
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// get admin recharge

export async function Addbalance(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/walletRecharge`,
      data,
      {
        data: {},
      }
    );
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// get admn user_active_status

export async function updateActivestatus(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/UpdateActiveStatusAdmin`,
      data,
      {
        data: {},
      }
    );
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// get history
export async function gethistory(data, token) {
  try {
    const res = await axios.get(
      `${Config.base_url}admin/getadminhistory`,
      data,
      {
        data: {},
      }
    );
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function Update_admin(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}admin/Update_Admin`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// delet admin by superadmin

export async function Delete_Admin(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}admin/Delete_Admin`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// admin status on super admin panel

export async function Superadmindashboarddata(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}SuperadminGetDashboardData`,
      data,
      {
        data: {},
      }
    );
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// get all client

export async function getAllClient(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getAllclent`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// admin user data

export async function getadminuserdetail(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getadminuserdetail`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// get employee user

export async function getEmployeeuserdetail(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}getEmployeeuserdetail`,
      data,
      {
        data: {},
      }
    );
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// get licence detail

export async function getlicencedetailforsuperadmin(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getlicencedetail`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// get position detail

export async function getavailableposition(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getPosition_detail`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// getAllBrokerageData

export async function getAllBrokerageData() {
  try {
    const res = await axios.get(
      `${Config.base_url}getBrokerageDataForSuperAdmin`
    );
    return await res?.data;
  } catch (err) {
    return await err;
  }
}


export async function AddProfitMarginApi(data1) {
  try {
    let res = await axios.post(`${Config.base_url}AddProfitMargin`, data1);


    return await res?.data;
  } catch (err) {
    return await err;
  }
}


export async function getProfitMarginApi(data) {
  try {
    let res = await axios.post(`${Config.base_url}getProfitMargin`, data);
    return await res?.data;
  } catch (err) {
    return
  }
}

export async function createOrUpdateCompanyApi(data) {
  try {
    let res = await axios.post(`${Config.base_url}createOrUpdateCompany`, data);
    return await res?.data;
  } catch (error) {
    return
  }
}

export async function getCompanyApi() {
  try {
    let res = await axios.get(`${Config.base_url}getCompany`);
    return await res?.data;
  } catch (error) {
    return
  }
}
  export async function getAdminName() {
    try {
      let res = await axios.get(`${Config.base_url}getAdminName`);
      return await res?.data;
    } catch (error) {
      return
    }
  }


export async function switchOrderType(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}switchOrderType`, data, {
      data: {},
    })
    return await res?.data;
  }
  catch (err) {
    return await err;

  }

}


export async function GetAdminUsername(data, token) {
  try {
    const res = await axios.get(`${Config.base_url}getAdminName`, data, {
      data: {},
    })
    return await res?.data;
  }
  catch (err) {
    return await err;

  }

}

export async function getAdminUserName(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getAdminUserName`, data, {
      data: {},
    })
    return await res?.data;
  }
  catch (err) {
    return
      await err;
  }
}

export async function GetAdminBalanceWithPosition(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}GetAdminBalanceWithPosition`, data, {
      data: {},
    })
    return await res?.data;
  }
  catch (err) {
    return
      await err;
  }
}