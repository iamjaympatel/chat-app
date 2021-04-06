const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const users = require("./routes/api/users");
const messages = require("./routes/api/messages");
const socketio=require("socket.io")
const app = express();

// Port that the webserver listens to
const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);

const io = socketio(server);

// Body Parser middleware to parse request bodies
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Database configuration
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Successfully Connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// Assign socket object to every request

app.use(function (req, res, next) {
  req.io = io;
  next();
});


//app.set('socketio', io);
//console.log('Socket.io listening for connections');

// Authenticate before establishing a socket connection
io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (token) {
    try {
      const user = jwt.decode(token, "secret");
      if (!user) {
        return next(new Error('Not authorized.'));
      }
      socket.user = user;
      
      return next();
    } catch (err) {
      next(err);
    }
  } else {
    return next(new Error('Not authorized.'));
  }
}).on('connection', (socket) => {
//  socket.join(socket.user.id);
   socket.join(socket.user.id);
  console.log('socket connected:', socket.user.name);
});


// Routes
app.use("/api/users", users);
app.use("/api/messages", messages);
