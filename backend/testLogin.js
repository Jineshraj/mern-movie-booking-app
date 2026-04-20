const axios = require("axios");

async function testLogin() {
  try {
    const res = await axios.post("http://localhost:5000/api/users/login", {
      email: "admin@cineverse.com",
      password: "Admin@1234"
    });
    console.log("Login successful!");
    console.log("Data:", res.data);
  } catch (err) {
    console.log("Login failed!");
    console.log("Status:", err.response?.status);
    console.log("Message:", err.response?.data?.message);
  }
}

testLogin();
