const axios = require("axios");
const { API_BASEURL } = process.env;

const createAlert = async (body) => {
  try {
    const url = `${API_BASEURL}/ms4/alerts`;
    const { data } = await axios.post(url, body);

    if (!data.results) return null;

    return data.results;
  } catch (error) {
    console.log(error);

    return null;
  }
};

module.exports = {
  createAlert,
};
