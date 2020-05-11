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
    riders[riderData.riderid] = socket.id;
    socket.broadcast.emit("online-riders", riderData);
    console.log(
      "new rider joined " +
        JSON.stringify(riderData) +
        " and socket id is " +
        riders[riderData.riderid]
    );
  });

  // save user details to on the server
  socket.on("new-user", (userData) => {
    users[userData.userid] = socket.id;
    socket.broadcast.emit("user-joined", JSON.stringify(userData));
    console.log(
      JSON.stringify(userData) +
        " new user joined" +
        " and socket id is " +
        riders[riderData.riderid]
    );
  });
  socket.broadcast.emit("all", { riders: riders, users: users });

  //the user emits a request with th details of the selected rider
  //the rider is then sent an event to accept or decline the rider
  //the rider listens to this event
  //this request data should include the users unique id so that he can get a reply
  socket.on("request-ride", (requestDetails) => {
    console.log(
      "rider requested from " +
        requestDetails.userid +
        " to " +
        riders[requestDetails.riderid] +
        "obj" +
        JSON.stringify(riders)
    );
    socket
      .to(riders[requestDetails.riderid])
      .emit("listening-for-requests", requestDetails);
  });
  
  //the user listens for a decision from the rider
  socket.on("request-decision", (decisionData) => {
    console.log(
      "rider decision" +
        JSON.stringify(decisionData) +
        "user socket id " +
        users[decisionData.userid]
    );
    socket.to(users[decisionData.userid]).emit("rider-decision", decisionData);
  });

  //if rider accepts the rider we want to send real time tracking data from the rider to the user

  socket.on("track-rider", (riderTrackingData) => {
    socket
      .to(users[riderTrackingData.userid])
      .emit("tracking-data", riderTrackingData);
  });

  // socket.on("disconnect", (reason) => {
  //   if (reason.userid) {
  //     delete users[reason.userid];
  //   } else {
  //     delete riders[reason.riderid];
  //   }
  //   console.log("logged out");
  // });
});
app.use(express.static("src"));
app.use(express.json());
app.use(phoneVerificationRouter);
