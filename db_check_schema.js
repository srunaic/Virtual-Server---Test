const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'virtual_server',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.query('DESCRIBE inquiries', (err, results) => {
    if (err) {
        console.error("테이블 조회 오류:", err);
    } else {
        console.log("inquiries 테이블 구조:");
        console.table(results);
    }
    process.exit();
});
