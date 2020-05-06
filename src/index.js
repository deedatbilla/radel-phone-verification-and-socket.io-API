const express = require("express");
require("dotenv").config();
var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

const client = require("twilio")(
  "AC64359fabefc2d179db216becb172e971",
  "7aba78b749c445b0ac61fe54cd32f7a9"
);

const router = express.Router();
router.get("/", (req, res) => {
  res.sendFile("./index.html");
});

router.post("/verifyPhone", async (req, res) => {
  try {
    let code = Math.floor(1000 + Math.random() * 9000);
    const { phone } = req.body;
    let verification = await client.messages
      .create({
        body: `Your verification code is ${code}`,
        from: "+17243906302",
        to: `+233${phone}`,
      })
      .then((message) => res.send({ message,code:code }));

    // .verifications.create({ to: `+233${phone}`, channel: "sms" })
    // .then((verification) => console.log(verification.sid));
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e);
  }
});
 
module.exports = router;
