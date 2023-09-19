//聊天室頁面
const chatPage = function (req, res) {
  if (!req.session.user) {
    res.render("backroot", { title: "尚未登入!!" });
  }
  res.render("chat");
};

//記錄歷史訊息
let chatHistory = [];

// 最大歷史訊息數量
// const MAX_CHAT_HISTORY = 50;

//目前線上成員
let members = [];

//// 加入線上人數計數
let onlineCount = 0;

//聊天室連線
chatroomConnect = function (socket, io) {
  onlineCount++; //新加入使用者
  io.emit("online", onlineCount); // 發送人數給網頁

  const name = socket.request.session.user.name; // 獲取發送者的身份
  const id = socket.request.session.user.id; // 獲取發送者的id

  socket.broadcast.emit("new user", name); // 通知新使用者加入

  members.push({ name: name, id: id }); //將使用者加入在線清單

  io.emit("members", members); // 發送人數給網頁

  socket.emit("chat history", chatHistory); // 發送歷史訊息

  socket.on("chat message", (msg) => {
    const message = `${name}: ${msg}`;
    chatHistory.push(message);
    io.emit("chat message", message);
  });
};

//聊天室斷線
chatroomDisconnect = function (socket, io) {
  // 有人離線了，扣人
  onlineCount = onlineCount < 0 ? 0 : (onlineCount -= 1);
  io.emit("online", onlineCount);

  const id = socket.request.session.user.id;
  const user = socket.request.session.user.name;
  let newList = members.filter((obj) => obj.id !== id);
  members = newList;
  io.emit("members", members);
  console.log(`${user}::disconnected`);
};

module.exports = {
  chatPage,
  chatroomConnect,
  chatroomDisconnect,
};
