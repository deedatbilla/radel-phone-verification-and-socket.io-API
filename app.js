const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const main = require("./src");
const router = express.Router();
const port = process.env.PORT;
//const port = 3000;
server.listen(port, () => console.log("server running on port:" + port));
router.post("/sendMyLocation", async (req, res) => {
  const { longitude, latitude, riderEmail } = req.body;
  res.send("socket started");
  io.on("connection", (socket) => {
    socket.emit("clientlocation - " + riderEmail, { mylocation: "hj" });

    socket.on("return my location", (data) => {
      console.log(data);
      res.send(req.body);
    });
  });
});
app.use(express.json());
app.use(router);


