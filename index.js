const { ChatTokenBuilder } = require("agora-token");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;
// App credentials
const appId = "be2ac313cccd40c7a0c3ba62d6269025";
const appCertificate = "d3e285a7b4784614a458f939534de279";

// Route to generate a user token
app.get("/api/token/generateUserToken", (req, res) => {
    const account = req.query.account;
    const expireTimeInSeconds = parseInt(req.query.expireTimeInSeconds) || 3600;

    if (!account) {
        return res.status(400).json({ error: "Account parameter is required" });
    }

    try {
        const token = ChatTokenBuilder.buildUserToken(appId, appCertificate, account, expireTimeInSeconds);
        res.json({ status: "success", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to generate an app token
app.get("/api/token/generateAppToken", (req, res) => {
    const expireTimeInSeconds = parseInt(req.query.expireTimeInSeconds) || 3600;

    try {
        const token = ChatTokenBuilder.buildAppToken(appId, appCertificate, expireTimeInSeconds);
        res.json({ status: "success", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});