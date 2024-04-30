const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.post("/webhook", (req, res) => {
  try {
    console.log(req);
    const payload = req.body;
    console.log("Received webhook payload:", payload);
    res.status(403).send("Webhook received successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("error");
  }
});

const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});