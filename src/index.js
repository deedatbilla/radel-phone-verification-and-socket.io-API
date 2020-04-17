const express = require("express");
const lib = require("../lib");
lib.Configuration.userId = "billa5"; // Your user ID master key => 6BCTdFElqLI9wREPUd8JN3vkMIkYG8ZiZe9gJu3GsykH6cKf
lib.Configuration.apiKey = "y2ycIah2jtDkTrRqfFU8tQHiaudXM4vwFu26hBZlXW1K2CGd";

const router = express.Router();
router.get("/",(req, res) => {
    res.send({message:success})
});
router.post("/getLocationDetails/", async (req, res) => {
  try {
    var controller = lib.Geolocation;

    // await controller.sMSMessage("233546055647", 6, 235343, 800, "GH", "en");
    //res.send({ message: "success" });
    //5.65202656  -0.21375904
    const LATITUDE = req.body.latitude;
    const LONGITUDE = req.body.longitude;
    const resp = await controller.geocodeReverse(LATITUDE, LONGITUDE, function (
      error,
      response,
      context
    ) {
      console.log(response, context, error);
    });
    res.send({ resp });

    // var securityCode = 'security-code';

    // controller.verifySecurityCode(securityCode, function(error, response, context) {

    // });
  } catch (e) {
    console.log(e);
  }
});

router.post("/getLglt", async (req, res) => {
  try {
    var controller = lib.Geolocation;

    var address = req.body.address;
    var countryCode = "GH";
    var languageCode = "en";
    var fuzzySearch = false;

    const resp = await controller.geocodeAddress(
      address,
      countryCode,
      languageCode,
      fuzzySearch,
      function (error, response, context) {}
    );
    res.send({ resp });
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
