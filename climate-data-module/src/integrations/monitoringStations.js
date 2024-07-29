const axios = require("axios");
const { API_BASEURL } = process.env;

const getMonitoringStations = async () => {
  try {
    const url = `${API_BASEURL}/ms2/monitoring-stations`;

    const { data } = await axios.get(url);

    if (!data.results) return null;

    return data.results;
  } catch (error) {
    console.log(error);

    return null;
  }
};

const updateMonitoringStationsById = async (id = "", body) => {
  try {
    const url = `${API_BASEURL}/ms2/monitoring-stations/${id}`;

    const { data } = await axios.put(url, body);

    if (!data.results) return false;

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
};

module.exports = {
  updateMonitoringStationsById,
  getMonitoringStations,
};
