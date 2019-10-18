require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const http = require("http");
const cookieParser = require("cookie-parser");
const WebSocketServer = require("websocket").server;

const auth = require("./routes/auth");
const profile = require("./routes/profile");
const users = require("./routes/users");
const webSocket = require("./webSocket");
const { authenticated } = require("./middleware/auth");

const app = express();

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000"
  })
);
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
  })
);

app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/users", authenticated, users);

const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log("Server is listening on http://localhost:5000");
});

const socketServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

webSocket(socketServer);
