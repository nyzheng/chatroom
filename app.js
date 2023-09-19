const express = require("express");
const {
  sessionMiddleware,
  wrap,
  configureSocketIO,
  authorizeUser,
} = require("./socket");
const { Server } = require("socket.io");
const app = express(); //此行程式碼要在server之前
const http = require("http");
const server = http.createServer(app);
//上面兩行等同於const server = require('http').createServer(app);
const io = new Server(server);

const engine = require("ejs-locals");

/////////// const records = require("./record");

const port = 3000;

//ejs模組
app.engine("ejs", engine);
app.set("views", "./views");
app.set("view engine", "ejs");

//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// 在此處呼叫 configureSocketIO 函式，傳入 io 物件
app.use(sessionMiddleware); //中間層
io.use(wrap(sessionMiddleware));
io.use(authorizeUser);
configureSocketIO(io);
//路由設定
const router = require("./router/router");
app.use("/", router);

//此行程式碼要在最下面
server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
