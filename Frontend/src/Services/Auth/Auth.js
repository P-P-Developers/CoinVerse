import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";

// LOGIN-USER
export async function LOGIN_API(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}login`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// sign In

export async function SignIn(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}SignIn`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// changed password

export async function PasswordChanged(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}PasswordChanged`, data, {
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}
