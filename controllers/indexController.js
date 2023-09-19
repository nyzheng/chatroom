const sql = require("../models/sql");

//接收登入資料
const login = async function (req, res) {
  const { account, password } = req.body;
  console.log("登入者資料:", req.body);
  const user = await sql.checkUser(account, password);
  console.log("login", user);
  if (user) {
    //登入成功
    req.session.user = { id: user.id, account: user.account, name: user.name };
    res.render("backroot", { title: "成功登入!!" });
    return;
  } else {
    res.render("backroot", { title: "帳號或密碼錯誤!!" });
  }
};

//首頁
const welcomePage = function (req, res) {
  userInfo = req.session.user;
  if (userInfo === undefined) {
    res.render("index", {
      title: "歡迎",
      registerText: "註冊",
      logOut: "",
      change: "",
      chat: "",
      OOXX: "",
      showInputs: true,
    });
  } else {
    const name = userInfo.account;
    res.render("index", {
      title: `${name}歡迎!`,
      registerText: "",
      logOut: "登出",
      change: "修改密碼",
      chat: "聊天室",
      OOXX: "OOXX",

      showInputs: false,
    });
  }
};

//登出
const logout = function (req, res) {
  req.session.destroy();
  res.render("backroot", { title: "成功登出!!" });
};

//註冊頁面
const registerPage = function (req, res) {
  res.render("register");
};

//註冊請求
const registerPost = async function (req, res) {
  // 從 req.body 中取得傳送的資料
  const { account, password, checkPassword, name } = req.body;
  console.log("註冊:", req.body);

  if (!account || !password || !checkPassword || !name) {
    res.render("checkregister", { title: "請填寫所有欄位！" });
    console.log("有欄位未填寫");
    return;
  }

  if (password !== checkPassword) {
    res.render("checkregister", { title: "密碼不一致!!" });
    console.log("密碼不一致!!");
    return;
  }

  const add = await sql.insertUser(account, password, name);
  if (add === false) {
    res.render("checkregister", { title: "帳號已存在!!" });
    console.log("註冊失敗");
    return;
  }

  res.render("checkregister", { title: "註冊成功!!" });
  console.log("註冊成功");
};

//修改密碼頁面
const passwordPage = function (req, res) {
  res.render("password");
};

// 使用方式
const updatePost = async function (req, res) {
  // 從 req.body 中取得傳送的資料
  const { newPassword, checkPassword } = req.body;
  console.log("更改密碼:", req.body);

  if (!newPassword || !checkPassword) {
    res.render("backroot", { title: "請填寫所有欄位！" });
    console.log("有欄位未填寫");
    return;
  }

  if (newPassword !== checkPassword) {
    res.render("backroot", { title: "密碼不一致!" });
    console.log("密碼不一致!!");
    return;
  }

  const account = req.session.user.account;
  const update = await sql.updatePassword(newPassword, account);
  if (!update) {
    res.render("backroot", { title: "更改密碼失敗!" });
    console.log("更改密碼失敗");
    return;
  }
  res.render("backroot", { title: "密碼更改成功!" });
  console.log("密碼更改成功");
};

module.exports = {
  welcomePage,
  login,
  logout,
  registerPage,
  registerPost,
  passwordPage,
  updatePost,
};
