const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const {
  Onfido,
  Region,
  OnfidoApiError,
  Report,
  WebhookEventVerifier,
} = require("@onfido/api");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  try {
    console.log(req, req.body.payload, "req");
    const payload = req.body.payload;
    console.log("Received webhook payload:", payload);

    const webhookToken = "z2N2WUMM3Pb4vbAIcDwo-2XCxtZ6mLtY";
    const signature =
      req.headers["x-sha2-signature"] || req.headers["X-Sha2-Signature"];
    const rawEventBody = req.body.payload;
    console.log(rawEventBody, "rawEventBody", req.headers["x-sha2-signature"]);

    // const Event = readWebhookEvent({
    //   rawEventBody,
    //   signature,
    //   webhookToken,
    // });

    const verifier = new WebhookEventVerifier(webhookToken);

    const event = verifier.readPayload(JSON.stringify(rawEventBody), signature);

    console.log(event, "event123");

    res.status(200).send("Webhook received successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("error");
  }
});

const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
