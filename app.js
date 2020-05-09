const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const phoneVerificationRouter = require("./src");
const router = express.Router();
require("dotenv").config();
const port = process.env.PORT;
const users = {};
const riders = {};
//const port = 3000;
server.listen(port, () => console.log("server running on port:" + port));

io.on("connection", (socket) => {
  //broadcast logged in riders to users
  //users will listen(on) and riders will emit their location data on this channel
  socket.on("new-rider", (riderData) => {
    riders[socket.id] = riderData.riderid;
    socket.broadcast.emit("online-riders", riderData);
    console.log("new rider joined " +riderData )
  });

  // save user details to on the server
  socket.on("new-user", (userData) => {
    users[socket.id] = userData.userid;
    console.log("new user joined")
  });

  //the user emits a request with th details of the selected rider
  //the rider is then sent an event to accept or decline the rider
  //the rider listens to this event
  //this request data should include the users unique id so that he can get a reply
  socket.on("request-ride", (requestDetails) => {
    console.log("rider requested from " +requestDetails.userid +" to "+ requestDetails.riderid )
    io.to(riders[requestDetails.riderid]).emit(
      "listening-for-requests",
      requestDetails
    );
  });  

  //the user listens for a decision from the rider
  socket.on("request-decision", (decisionData) => {
    console.log("rider decision" +decisionData)
    io.to(users[decisionData.userid]).emit("rider-decision", decisionData);
  });


  //if rider accepts the rider we want to send real time tracking data from the rider to the user

  socket.on("track-rider",riderTrackingData=>{
    io.to(users[riderTrackingData.userid]).emit("tracking-data",riderTrackingData)
  })
});

app.use(express.json());
app.use(phoneVerificationRouter);
