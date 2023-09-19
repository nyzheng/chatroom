const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "0976876123",
  database: "test",
});
// const model = require("./model");

let userList = [];

//讀取mySQL資料放進陣列中
async function read() {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM user_account");
    userList = rows;
    console.log("讀取資料成功", "userList");
    return userList; // 將用戶資料丟給陣列
  } catch (err) {
    console.error("檢索資料發生錯誤:", err);
    res.status(500).json({ error: "檢索資料失敗" });
  }
}

//檢查帳號是否存在資料庫 並回傳使用者資料
async function checkAccount(account) {
  const userList = await read();
  const accountExist = userList.find((obj) => obj.account === account);
  if (accountExist) {
    return accountExist;
  } else {
    return false;
  }
}

//新增使用者資料至mySQL
async function insertUser(account, password, name) {
  const accountExist = await checkAccount(account);
  if (accountExist) {
    console.log("帳號已註冊");
    return false;
  }
  try {
    const connection = await pool.getConnection();
    const sql =
      "INSERT INTO `test`.`user_account` (`account`, `password`, `name`, `status`) VALUES (?, ?, ?, 1);"; //status預設1
    const [rows, fields] = await connection.query(sql, [
      account,
      password,
      name,
    ]);
    connection.release();
    console.log("資料插入成功");
    return rows.insertId;
  } catch (error) {
    console.error("資料插入失敗:", error);
    throw error;
  }
}

//檢查登入者資料與mySQL中資料是否一致
async function checkUser(account, password) {
  try {
    const userInfo = await checkAccount(account);
    console.log("userInfo", "userInfo");
    if (userInfo.password === password) {
      return userInfo;
    }
  } catch (error) {
    console.error("登入失敗:", error);
    throw error;
  }
}

async function updatePassword(newPassword, account) {
  const userInfo = await checkAccount(account);
  const id = userInfo.id;
  try {
    const connection = await pool.getConnection();
    const sql = "UPDATE user_account SET password = ? WHERE id = ?";
    const [rows, fields] = await connection.query(sql, [newPassword, id]);
    connection.release();
    console.log("資料更新成功");
    return rows;
  } catch (error) {
    console.error("資料更新失敗:", error);
    throw error;
  }
}

module.exports = {
  read,
  checkUser,
  insertUser,
  updatePassword,
  checkAccount,
};
