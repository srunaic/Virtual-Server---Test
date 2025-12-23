const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // 모든 도메인 허용 (GitHub Pages 연동을 위해 필요)
app.use(express.json());

// MySQL 연결 풀 생성 (연결 관리가 더 효율적임)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 테스트용 API 엔드포인트
app.get('/api/test', (req, res) => {
    res.json({ message: "서버가 정상적으로 작동 중입니다!" });
});

// DB에서 데이터 조회하는 API 예시
app.get('/api/users', (req, res) => {
    pool.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "데이터베이스 조회 중 오류가 발생했습니다." });
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
