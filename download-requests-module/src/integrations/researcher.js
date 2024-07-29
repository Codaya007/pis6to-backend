const axios = require("axios");
const { API_BASEURL } = process.env;

const getResearcherById = async (id = "", bearerToken) => {
  try {
    const url = `${API_BASEURL}/ms1/researchers/${id}`;
    const config = {
      headers: { Authorization: bearerToken },
    };

    // console.log(url, config);

    const { data } = await axios.get(url, config);

    // console.log(data);

    if (!data.results) return null;

    return data.results;
  } catch (error) {
    console.log(error);

    return null;
  }
};

const getAllResearchers = async (bearerToken, filters = {}) => {
  try {
    let url = `${API_BASEURL}/ms1/researchers?limit=10`;

    for (const [key, value] of Object.entries(filters)) {
      url += `&${key}=${encodeURIComponent(value)}`;
    }

    const config = {
      headers: { Authorization: bearerToken },
    };

    const { data } = await axios.get(url, config);

    if (!data.results) return [];

    return data.results;
  } catch (error) {
    console.log(error);

    return [];
  }
};

module.exports = {
  getResearcherById,
  getAllResearchers,
};
