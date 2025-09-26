const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());

// Agora REST API credentials
const CUSTOMER_ID = process.env.CUSTOMER_ID;
const CUSTOMER_SECRET = process.env.CUSTOMER_SECRET;
const ORG_NAME = process.env.ORG_NAME;   
const APP_NAME = process.env.APP_NAME;   

console.log("ID:", process.env.CUSTOMER_ID);
console.log("SECRET:", process.env.CUSTOMER_SECRET);
console.log("ORG:", process.env.ORG_NAME);
console.log("APP:", process.env.APP_NAME);

// Get Access Token (for REST API calls)
async function getAppToken() {
  console.log(':sdf' );
  const auth = Buffer.from(`${CUSTOMER_ID}:${CUSTOMER_SECRET}`).toString("base64");
  console.log("auth:", auth);

  try {
    const res = await axios.post(
      `https://a1.easemob.com/${ORG_NAME}/${APP_NAME}/token`,
      { grant_type: "client_credentials",
        client_id: CUSTOMER_ID,
        client_secret: CUSTOMER_SECRET
       },
      { headers: { Authorization: `Basic ${auth}` } }
    );
    return res.data.access_token;
  } catch (error) {
    console.error("Token Request Error:", error.response?.data || error.message);
    throw error;
  }
}

// token
// app.post("/token", async (req, res) => {
//   try {
//     const token = await getAppToken();
//     res.json({ access_token: token });
//   } catch (err) {
//     console.error("Error generating token:", err.response?.data || err.message);
//     res.status(500).json({ error: "Failed to generate token" });
//   }
// });


// Register a new user
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await getAppToken();

    const response = await axios.post(
      `https://a1.easemob.com/${ORG_NAME}/${APP_NAME}/users`,
      { username, password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "User registration failed" });
  }
});



app.listen(4000, () => console.log("🚀 Backend running at http://localhost:4000"));
