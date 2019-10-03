const sessions = [];
const connections = [];

const MAX_SESSION_SIZE = 2;

const { verify } = require("jsonwebtoken");

const genId = require("./helpers/genId");

function Session() {
  this.id = genId();
  this.users = [];

  this.isJoinable = false;

  this.addUser = function(user) {
    this.users.push(user);
    this.isJoinable = this.users.length < MAX_SESSION_SIZE;
    return this;
  };
}

const findSessionById = id => {
  return sessions.find(function(session) {
    return session.id == id;
  });
};

module.exports = socketServer => {
  // socket stuff
  socketServer.on("request", req => {
    const token = req.cookies.find(cookie => cookie.name === "token").value;

    const sessionId = req.resourceURL.query.sessionId;

    verify(token, process.env.JWT_SECRET, function(error, decoded) {
      if (error) {
        return req.reject(401);
      }

      const { id, username } = decoded;
      const connection = req.accept("json", req.origin);
      let session = findSessionById(sessionId);
      const user = {
        id,
        username
      };

      if (!connections.find(connection => connection.id == id)) {
        connection.id = id;
        connections.push(connection);
      }

      if (session && session.isJoinable) {
        session.addUser(user);
      } else {
        session = new Session();

        session.addUser(user);
        sessions.push(session);
      }

      connection.sendUTF(
        JSON.stringify({
          type: "joined_session",
          session
        })
      );

      connection.on("message", function(message) {});

      connection.on("close", function() {});
    });
  });
};
