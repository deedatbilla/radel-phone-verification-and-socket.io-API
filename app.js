const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const main = require("./src");
const router = express.Router();
const port = process.env.PORT;
//const port = 3000;
server.listen(port, () => console.log("server running on port:" + port));
// router.post("/sendUserLocation", async (req, res) => {
//   const { longitude, latitude, riderEmail } = req.body;
//   res.send("socket started");
//   io.on("connection", (socket) => {
//     //send user's location to rider
//     socket.emit("clientlocation - " + riderEmail, { Userlocation: req.body });
//     socket.on("return my location", (data) => {
//       console.log(data);
//       //res.send(req.body);
//     });
//   });
// });

// router.post("/sendRiderLocation", async (req, res) => {
//   const { longitude, latitude, userEmail } = req.body;
//   res.send("socket started");
//   io.on("connection", (socket) => {
//     //send the rider's location to user
//     socket.emit("riderlocation - " + userEmail, { Riderlocation: req.body });

//     socket.on("return my location", (data) => {
//       console.log(data);
//       //res.send(req.body);
//     });
//   });
// });

//broadcast all rider location to user
io.on("connection", (socket) => {
  socket.on("Allriderlocation", (data) => {
    socket.broadcast.emit("riderDetails", data);
    console.log("log all " + JSON.stringify(data));
  });
  //user hails a ride
  // user emits and rider listens for event
  socket.on("hailride", (data) => {
    socket.broadcast.emit("hailride-" + data.riderEmail, data);
    console.log("log all " + JSON.stringify(data));
  });

  // rider accepts or decline ride request
  //rider emits and user listens for event
  socket.on("riderChoice", (data) => {
    socket.broadcast.emit("riderChoice-" + data.userEmail, data);
    console.log("log all " + JSON.stringify(data));
  });

  //track rider location
  //rider always emits new location and the user listens to location change events
  socket.on("myRiderLocation", (data) => {
    socket.broadcast.emit("myRiderLocation-" + data.userEmail, data);
    console.log("log all " + JSON.stringify(data));
  });
});

//user hail ride

// router.get("/GetAllRiderLocations", async (req, res) => {
//   res.send("socket started");
//   io.on("connection", (socket) => {
//     //send the rider's location to user
//     socket.emit("Allriderlocation", {
//       latitude: latitude,
//       longitude: longitude,
//     });
//     // socket.on("return my location", (data) => {
//     //   console.log(data);
//     //   //res.send(req.body);
//     // });
//   });
// });
app.use(express.json());
app.use(main);
