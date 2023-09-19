const { emit } = require("nodemon");

//遊戲頁面
const ooxxPage = function (req, res) {
  if (!req.session.user) {
    res.render("backroot", { title: "尚未登入!!" });
  }
  res.render("ooxx");
};

//遊戲狀態
let gameData = {
  status: [null, null, null, null, null, null, null, null, null], //用來判斷9個位置是否都已下完 true為circle false為cross
  result: null, //輸贏的結果
  turn: true, //起始玩家為圈圈; true是圈圈回合 false是叉叉回合
};

let player1 = {
  name: "",
  turn: true,
};

let player2 = {
  name: "",
  turn: false,
};

//限制連線人數
let connectedUsers = 0;

//確認是否連線 誰勝利
function judge() {
  // circle win
  if (
    gameData.status[0] === true &&
    gameData.status[1] === true &&
    gameData.status[2] === true
  ) {
    gameData.result = true;
  } else if (
    gameData.status[3] === true &&
    gameData.status[4] === true &&
    gameData.status[5] === true
  ) {
    gameData.result = true;
  } else if (
    gameData.status[6] === true &&
    gameData.status[7] === true &&
    gameData.status[8] === true
  ) {
    gameData.result = true;
  } else if (
    gameData.status[0] === true &&
    gameData.status[4] === true &&
    gameData.status[8] === true
  ) {
    gameData.result = true;
  } else if (
    gameData.status[2] === true &&
    gameData.status[4] === true &&
    gameData.status[6] === true
  ) {
    gameData.result = true;
  } else if (
    gameData.status[1] === true &&
    gameData.status[4] === true &&
    gameData.status[7] === true
  ) {
    gameData.result = true;
  } else if (
    gameData.status[0] === true &&
    gameData.status[3] === true &&
    gameData.status[6] === true
  ) {
    gameData.result = true;
  } else if (
    gameData.status[2] === true &&
    gameData.status[5] === true &&
    gameData.status[8] === true
  ) {
    gameData.result = true;
  }

  // cross win
  if (
    gameData.status[0] === false &&
    gameData.status[1] === false &&
    gameData.status[2] === false
  ) {
    gameData.result = false;
  } else if (
    gameData.status[3] === false &&
    gameData.status[4] === false &&
    gameData.status[5] === false
  ) {
    gameData.result = false;
  } else if (
    gameData.status[6] === false &&
    gameData.status[7] === false &&
    gameData.status[8] === false
  ) {
    gameData.result = false;
  } else if (
    gameData.status[0] === false &&
    gameData.status[4] === false &&
    gameData.status[8] === false
  ) {
    gameData.result = false;
  } else if (
    gameData.status[2] === false &&
    gameData.status[4] === false &&
    gameData.status[6] === false
  ) {
    gameData.result = false;
  } else if (
    gameData.status[1] === false &&
    gameData.status[4] === false &&
    gameData.status[7] === false
  ) {
    gameData.result = false;
  } else if (
    gameData.status[0] === false &&
    gameData.status[3] === false &&
    gameData.status[6] === false
  ) {
    gameData.result = false;
  } else if (
    gameData.status[2] === false &&
    gameData.status[5] === false &&
    gameData.status[8] === false
  ) {
    gameData.result = false;
  } else if (gameData.status.every((item) => item !== null)) {
    gameData.result = "draw";
  }
  if (gameData.result === true) {
    // circle win
  } else if (gameData.result === false) {
    // cross win
  }
  // 判斷9個空格是否都已佔用且gameData.result不是true也不是false為平手
}

//一旦檢測到result狀態改變
function checkResult(gameData, io) {
  if (gameData.result === true) {
    io.emit("circleWin");
    console.log("圈圈勝利");
    return;
  }
  if (gameData.result === false) {
    io.emit("crossWin");
    console.log("叉叉勝利");
    return;
  }
  if (gameData.result === "draw") {
    io.emit("draw");
    console.log("平手");
    return;
  }
}

function updateStatus(index, socket, io, whoTurn) {
  if (gameData.status[index] !== null) {
    return;
  }
  gameData.status[index] = whoTurn;
  gameData.turn = !gameData.turn;
  judge();
  checkResult(gameData, io);
  return gameData.status;
}

//遊戲房連線
ooxxRoomConnect = function (socket, io) {
  connectedUsers++; // 新的使用者連線
  if (connectedUsers > 2) {
    socket.emit("connectionExceed");
    console.log(connectedUsers);
    return;
  }

  if (player1.name === "") {
    //新增狀態到session
    //把socket資訊放進上方player
    player1.name = socket.request.session.user.name;
    //將上方player資訊放進socket
    socket.request.session.user.turn = player1.turn;
    io.emit("player1", player1.name);
    io.emit("player2", player2.name);
  } else if (player2.name === "") {
    player2.name = socket.request.session.user.name;
    //新增狀態到session
    socket.request.session.user.turn = false;
    player2.name = socket.request.session.user.name;
    socket.request.session.user.turn = player2.turn;
    io.emit("player1", player1.name);
    io.emit("player2", player2.name);
    // 將第一位玩家名稱廣播給第二位玩家
  }

  if (gameData.turn === true) {
  }
  if (socket.request.session.user.turn === player1.turn) {
    //玩家1的回合
    socket.on("boxClick1", function (boxId) {
      const index = parseInt(boxId);
      updateStatus(index, socket, io, player1.turn);
      // 傳送新的 status 給所有人
      io.emit("statusUpdate", gameData.status);
    });
  } else if (gameData.turn === false) {
  }
  //玩家2的回合
  if (socket.request.session.user.turn === player2.turn) {
    socket.on("boxClick2", function (boxId) {
      const index = parseInt(boxId);
      updateStatus(index, socket, io, player2.turn);
      // 傳送新的 status 給所有人
      io.emit("statusUpdate", gameData.status);
    });
  }

  io.emit("start");

  //重新開始 //
  socket.on("restartGame", function () {
    for (let i = 0; i < gameData.status.length; i++) {
      gameData.status[i] = null;
    }
    gameData.turn = true;
    gameData.result = null;
    io.emit("reset"); //發送給前端重置所有格子
    io.emit("go");
  });
};

ooxxRoomDisconnect = function (socket, io) {
  connectedUsers--; // 使用者斷線
  io.emit("wait");
  console.log(connectedUsers);
  if (player1.name === socket.request.session.user.name) {
    player1.name = "";
    io.emit("removePlayer1", player1.name);
  }
  if (player2.name === socket.request.session.user.name) {
    player2.name = "";
    io.emit("removePlayer2", player2.name);
  }
  const user = socket.request.session.user.name;
  console.log(`${user}::disconnected`);
};

module.exports = {
  ooxxPage,
  ooxxRoomConnect,
  ooxxRoomDisconnect,
};

// 待新增功能
// 輪到該玩家時 另一個玩家不能行動
