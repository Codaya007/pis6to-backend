const axios = require("axios");
const { API_BASEURL } = process.env;

const getLimitsConfig = async (code = "") => {
  try {
    const url = `${API_BASEURL}/ms2/limits-config/one`;
    const { data } = await axios.get(url);

    if (!data.results) return null;

    return data.results;
  } catch (error) {
    console.log(error);

    return null;
  }
};

const getNormalLimitsConfig = async (code = "") => {
  try {
    const url = `${API_BASEURL}/ms2/normal-limits-config/one`;
    const { data } = await axios.get(url);

    if (!data.results) return null;

    return data.results;
  } catch (error) {
    console.log(error);

    return null;
  }
};

module.exports = {
  getLimitsConfig,
  getNormalLimitsConfig,
};
