import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";

axios.defaults.withCredentials = true; // Send cookies with every request

// Adding admin
export async function Admindashboarddata(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/GetDashboardData`,
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

export async function AddUser(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}admin/AddUser`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// update Licence

export async function updateuserLicence(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/UserupdateLicence`,
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
// admin / marginupdate

export async function marginUpdateOnUserCreate(data) {
  try {
    const res = await axios.post(`${Config.base_url}admin/marginupdate`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function updateuserdata(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}admin/updateUser`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// delete user  by admin

export async function DeleteUserdata(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}admin/DeleteUser`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// update Employe

export async function Update_Employe(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/Update_Employe`,
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

// delete Employee

export async function delete_Employee(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/Delete_Employee`,
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

// funds history status

export async function getFundstatus(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/getuserpaymentstatus`,
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

// update status

export async function UpdatestatusForpaymenthistory(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}admin/Updatestatus`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// margin required price

export async function MarginpriceRequired(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}admin/marginupdate`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// getting margin price

export async function getMarginpriceRequired(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/getmarginprice`,
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

// holoffsymbol

export async function symbolholdoff(data, token) {
  try {
    const res = await axios.get(
      `${Config.base_url}admin/getsymbolholdoff`,
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
// getbrokerageData
//  ----------Testing --------
export async function getbrokerageData(data) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/brokerageData`,
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

// --------------------
// update holdoff

export async function updatesymbolstatus(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/updatesymbolholoff`,
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

export async function getpositionhistory(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}gettardehistory`, data, {
      data: {},
    });

    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// get user history

export async function getuserhistory(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getOrderBook`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// balance and licence
export async function getbalancandLicence(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}getbalancandLicence`,
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

// sign in user detail

export async function getSignIn(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getSignIn`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function getReferClients(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getReferClients`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// Delete sign in user detail
export async function DeleteSignIn(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}DeleteSignIn`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// walletBalance

export async function adminWalletBalance(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/countuserBalance`,
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

// total count licence

export async function TotalcountLicence(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}TotalcountLicence`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// manage logs of user logout


export async function LogoutUser(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}logoutUser`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`, // agar JWT use kar rahe ho
          "Content-Type": "application/json",
        },
        withCredentials: true, // agar cookie-based auth hai
      }
    );

    // Success hone ke baad hi clear karo
    if (res?.data?.status === true) {
      localStorage.clear();
      sessionStorage.clear();
    }

    return res?.data;
  } catch (err) {

    return {
      status: false,
      message: "Logout failed",
      error: err?.message || "Unknown error",
    };
  }
}


// manage logspanel

export async function getlogoutuser(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getlogsuser`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// getclienttradehistory

export async function Clienthistory(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}getclienttradehistory`,
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

export async function gettradehistory(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}gettradehistory`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}




// get licence data
export async function getlicencedata(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getlicensedata`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// add broadcast message

export async function broadcastmessage(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}broadcastmessage`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// get broadcast message

export async function getbroadcastmessage(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}getbroadcastmessage`,
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

// broadcast message for user

export async function getbroadcastmessageforuser(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}getbroadcastmessageforuser`,
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

export async function GetUsersName({ admin_id }) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/getUsersName`,
      { admin_id },
      {
        data: {},
      }
    );
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function switchOrderType(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}switchOrderType`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function AddResearch(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}admin/addresearch`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function getResearch(userId, token) {
  try {
    const res = await axios.get(`${Config.base_url}admin/getresearch`, {
      params: { id: userId },
      headers: {
        Authorization: `Bearer ${token}`, // optional, if your API uses token
      },
    });
    return res?.data;
  } catch (err) {
    return err;
  }
}

export async function EditResearch(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}admin/editresearch`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function UpdatStatus(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}admin/updatstatus`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function DeleteResearch(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/deleteresearch`,
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

// /admin/updateUpiDetails
export async function UpdateUpiDetails(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/updateUpiDetails`,
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

// /admin/getUpiDetails
export async function getUpiDetails(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/getUpiDetails`,
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

export async function UpdateRefferPrice(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/updatereferprice`,
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

export async function GetBonus(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}admin/getbonusdetails`,
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



export async function AllUserDetails(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}allUersDetails`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}


export async function Getuserlistdata(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getUserlist`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}


export async function GetAllUserDeatailsdata(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}admin/getUserDetails`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}
