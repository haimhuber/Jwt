const { log } = require('console');
const sql = require('mssql');

const connectDb = require('./db');

async function getUserByUserName(userName) {
    try {
        const pool = await connectDb.connectionToSqlDB(); // Connect to DB
        const result = await pool.request()
            .input('userName', sql.NVarChar, userName)
            .execute('spGetUserByUserName');
        console.log(result.recordset[0]);
        return result.recordset[0];

    } catch (err) {
        return { 'Error! User not found': err['message'], status: 500 };
    }
}
module.exports.getUserByUserName = getUserByUserName;


async function addNewUser(userName, password) {
    try {
        const pool = await connectionToSqlDB(); // Connect to DB
        const result = await pool.request()
            .input('userName', sql.NVarChar, userName)
            .input('password', sql.NVarChar, password)
            .execute('spAddNewUser');
        console.log(result);

        return result;
    } catch (err) {
        console.log(err.name);

        return err.name;
    }
}
module.exports.addNewUser = addNewUser;

