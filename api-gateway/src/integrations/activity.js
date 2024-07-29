const axios = require("axios");
const { API_BASEURL } = process.env;

const createActivity = async (body) => {
  try {
    console.log("ACTIVIDAD: ", { body });
    const url = `${API_BASEURL}/ms6/system-activities`;

    const { data } = await axios.post(url, body);

    if (!data.results) return null;

    return data.results;
  } catch (error) {
    console.log(error);

    return null;
  }
};

module.exports = {
  createActivity,
};
