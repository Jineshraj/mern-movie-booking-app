const axios = require("axios");

async function checkStatus() {
  try {
    const res = await axios.get("http://localhost:5000/api/users/login"); // Incorrect method but let's see if we get a 405 or 500
    console.log("Status:", res.status);
  } catch (err) {
    console.log("Status:", err.response?.status);
    console.log("Message:", err.response?.data?.message);
  }
}
checkStatus();
