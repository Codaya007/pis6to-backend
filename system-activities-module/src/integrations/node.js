const axios = require("axios");
const { API_BASEURL } = process.env;

const getUserById = async (id = "", bearerToken) => {
  try {
    const url = `${API_BASEURL}/ms1/users/${id}`;
    const config = {
      headers: { Authorization: bearerToken },
    };

    const { data } = await axios.get(url, config);

    if (!data.results) return null;

    return data.results;
  } catch (error) {
    console.log(error);

    return null;
  }
};

module.exports = {
  getUserById,
};
