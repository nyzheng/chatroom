const session = require("express-session");
const chatroom = require("./controllers/chatroomController");
const ooxxroom = require("./controllers/ooxxController");
//socket & express-session 串接
const sessionMiddleware = session({
  secret: "changeit",
  resave: false,
  saveUninitialized: false,
});

const wrap = (expressMiddleware) => (socket, next) =>
  expressMiddleware(socket.request, {}, next);

const authorizeUser = (socket, next) => {
  console.log("authorizeUser", socket.request.session.user);
  if (!socket.request.session) {
    next(new Error("Not authorized"));
  } else {
    next();
  }
};

//socket連線
const configureSocketIO = (io) => {
  io.on("connect", (socket) => {
    chatroom.chatroomConnect(socket, io);
    ooxxroom.ooxxRoomConnect(socket, io);

    //socket斷線
    socket.on("disconnect", () => {
      chatroom.chatroomDisconnect(socket, io);
      ooxxroom.ooxxRoomDisconnect(socket, io);
    });
  });
};

module.exports = {
  sessionMiddleware,
  wrap,
  configureSocketIO,
  authorizeUser,
};

// // !方法A
// io.use((socket, next) => {
//   sessionMiddleware(socket.request, socket.request.res, next);
// });

//!方法B
// const wrap = (middleware) => (socket, next) =>
//   middleware(socket.request, {}, next); //return
// io.use(wrap(sessionMiddleware));
////////////////////////////////
