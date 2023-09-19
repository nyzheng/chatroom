// const sql = require("sql");

//直接從資料庫搜尋
const getUserById = async (id) => {
  try {
    const target = `SELECT * FROM userList WHERE status = 1 AND id = ? `;
    const [result] = await connection.execute(target, [id]);
    console.log(result);
    return result;
  } catch (error) {
    console.error("取得使用者資料失敗：", error);
    throw error;
  }
};

// module.exports = {
//   checkAccount,
// };
