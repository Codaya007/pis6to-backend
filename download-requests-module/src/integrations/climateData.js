const axios = require("axios");
const { API_BASEURL } = process.env;

const getAllClimateData = async (bearerToken, limit = 2000, filters = {}) => {
  try {
    let url = `${API_BASEURL}/ms3/climate-datas?limit=${limit}`;

    for (const [key, value] of Object.entries(filters)) {
      url += `&${key}=${encodeURIComponent(value)}`;
    }

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
  getAllClimateData,
};
