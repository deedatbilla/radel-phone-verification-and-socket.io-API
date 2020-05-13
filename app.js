const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const phoneVerificationRouter = require("./src");
const router = express.Router();
require("dotenv").config();
const port = process.env.PORT;

//const port = 3000;
server.listen(port, () => console.log("server running on port:" + port));
const users = {};
const riders = {};
io.on("connection", (socket) => {
  //broadcast logged in riders to users
  //users will listen(on) and riders will emit their location data on this channel
  socket.on("new-rider", (riderData) => {
    socket.broadcast.emit("online-riders", riderData);
  });

  // save user details to on the server
  socket.on("new-user", (userData) => {
    socket.broadcast.emit("user-joined", JSON.stringify(userData));
  });
  //the user emits a request with th details of the selected rider
  //the rider is then sent an event to accept or decline the rider
  //the rider listens to this event
  //this request data should include the users unique id so that he can get a reply
  socket.on("request-ride", (requestDetails) => {
    console.log(
      "rider requested from " +
        requestDetails.userid +
        " to " +
        requestDetails.riderid
    );
    socket.broadcast.emit(
      "listening-for-requests-" + requestDetails.riderid,
      requestDetails
    );
  });

  //the user listens for a decision from the rider
  socket.on("request-decision", (decisionData) => {
    console.log("rider decision" + JSON.stringify(decisionData));
    socket.broadcast.emit(
      "rider-decision-" + decisionData.userid,
      decisionData
    );
    if (decisionData.isAvailable) {
      socket.broadcast.emit("customer-movement-" + decisionData.userid);
    }
  });

  //if rider accepts the rider we want to send real time tracking data from the rider to the user

  socket.on("track-rider", (riderTrackingData) => {
    socket.broadcast.emit(
      "tracking-data-" + riderTrackingData.userid,
      riderTrackingData
    );
  });
  socket.on("disconnet", (reason) => {
    console.log(reason);
  });
});
app.use(express.static("src"));
app.use(express.json());
app.use(phoneVerificationRouter);
