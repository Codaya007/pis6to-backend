const axios = require("axios");
const { ACTIVE_STATUS_NAME } = require("../constants");
const { API_BASEURL } = process.env;

const getNodeByCode = async (code = "", bearerToken) => {
  try {
    const url = `${API_BASEURL}/ms2/nodes/code/${code}`;
    const config = {
      headers: { Authorization: bearerToken },
    };

    console.log(url, config);

    const { data } = await axios.get(url, config);

    console.log(data);

    if (!data.results) return null;

    return data.results;
  } catch (error) {
    console.log(error);

    return null;
  }
};

const getNodeById = async (id = "", bearerToken) => {
  try {
    const url = `${API_BASEURL}/ms2/nodes/${id}`;
    const config = {
      headers: { Authorization: bearerToken },
    };

    console.log(url, config);

    const { data } = await axios.get(url, config);

    console.log(data);

    if (!data.results) return null;

    return data.results;
  } catch (error) {
    console.log(error);

    return null;
  }
};

const getAllActiveNodes = async (bearerToken, monitoringStation) => {
  try {
    let url = `${API_BASEURL}/ms2/nodes?status=${ACTIVE_STATUS_NAME}&limit=100`;

    if (monitoringStation) url += `&monitoringStation=${monitoringStation}`;

    const config = {
      headers: { Authorization: bearerToken },
    };

    const { data } = await axios.get(url, config);

    console.log({ data });

    if (!data.results) return [];

    return data.results;
  } catch (error) {
    console.log(error);

    return [];
  }
};

module.exports = {
  getNodeByCode,
  getNodeById,
  getAllActiveNodes,
};
