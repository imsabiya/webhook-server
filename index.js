const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const dotenv = require('dotenv');


const {
  Onfido,
  Region,
  OnfidoApiError,
  Report,
  WebhookEventVerifier,
} = require("@onfido/api");

const app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());


app.post("/webhook", (req, res) => {
  try {
    console.log(req, req.body.payload, "req");
    const payload = req.body.payload;
    console.log("Received webhook payload:", payload);

    const webhookToken = `${process.env.WEBHOOK_TOKEN}`;
    const signature =
      req.headers["x-sha2-signature"] || req.headers["X-Sha2-Signature"];
    const rawEventBody = req.body.payload;
    console.log(rawEventBody, "rawEventBody", req.headers["x-sha2-signature"]);

    const computedSignature = crypto
      .createHmac("sha256", webhookToken)
      .update(JSON.stringify(rawEventBody))
      .digest("hex");

    const isSignatureValid = computedSignature === signature;

    if (isSignatureValid) {
      console.log("Onfido webhook signature is valid");
      const verifier = new WebhookEventVerifier(webhookToken);

      const event = verifier.readPayload(
        JSON.stringify(rawEventBody),
        signature
      );

      console.log(event, "event123");
    } else {
      console.error("Onfido webhook signature is invalid");
    }

    //res.status(200).send("Webhook received successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("error");
  }
});

const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
